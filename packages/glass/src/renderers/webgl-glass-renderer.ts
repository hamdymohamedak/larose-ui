import type { GlassRenderer, GlassRendererContext } from '../types';
import { resolveLens } from '../lens/defaults';

const VERTEX_SHADER = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  uniform sampler2D u_source;
  uniform sampler2D u_displacement;
  uniform vec2 u_resolution;
  uniform float u_scale;
  uniform float u_chroma;
  varying vec2 v_texCoord;

  void main() {
    vec2 disp = texture2D(u_displacement, v_texCoord).rg;
    vec2 offset = (disp - 0.5) * u_scale / u_resolution;

    if (u_chroma > 0.0) {
      float r = texture2D(u_source, v_texCoord + offset * (1.0 + u_chroma * 0.5)).r;
      float g = texture2D(u_source, v_texCoord + offset).g;
      float b = texture2D(u_source, v_texCoord + offset * (1.0 - u_chroma * 0.5)).b;
      float a = texture2D(u_source, v_texCoord + offset).a;
      gl_FragColor = vec4(r, g, b, a);
    } else {
      gl_FragColor = texture2D(u_source, v_texCoord + offset);
    }
  }
`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('Failed to create shader');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile error: ${log}`);
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext): WebGLProgram {
  const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = gl.createProgram();
  if (!program) throw new Error('Failed to create program');
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    throw new Error(`Program link error: ${log}`);
  }
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  return program;
}

/**
 * WebGL renderer for canvas/video surfaces.
 * Uses the same displacement map as the SVG renderer.
 */
/**
 * WebGL displacement refraction for canvas/video surfaces.
 * @experimental Not production-ready — per-frame buffer allocation and no React integration yet.
 */
export class WebGLGlassRenderer implements GlassRenderer {
  readonly kind = 'webgl' as const;
  private canvas: HTMLCanvasElement | null = null;
  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private displacementTexture: WebGLTexture | null = null;
  private sourceTexture: WebGLTexture | null = null;
  private rafId = 0;
  private videoElement: HTMLVideoElement | null = null;

  mount(): void {
    this.canvas = document.createElement('canvas');
    this.gl = this.canvas.getContext('webgl');
    if (!this.gl) return;
    this.program = createProgram(this.gl);
  }

  update(context: GlassRendererContext): void {
    if (!this.gl || !this.program || !this.canvas) return;

    const lens = resolveLens(context.lens);
    const gl = this.gl;
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

    this.canvas.width = Math.round(lens.width * dpr);
    this.canvas.height = Math.round(lens.height * dpr);
    Object.assign(this.canvas.style, {
      position: 'absolute',
      left: `${context.position.x}px`,
      top: `${context.position.y}px`,
      width: `${lens.width}px`,
      height: `${lens.height}px`,
      pointerEvents: 'none',
    });

    if (context.root instanceof HTMLCanvasElement) {
      this.uploadSourceFromCanvas(gl, context.root);
    } else if (context.root instanceof HTMLVideoElement) {
      this.videoElement = context.root;
      this.startVideoLoop(context);
    }

    this.uploadDisplacementMap(gl, context);
    this.renderFrame(context);

    if (context.root instanceof HTMLElement && this.canvas.parentElement !== context.root) {
      context.root.style.position = context.root.style.position || 'relative';
      context.root.appendChild(this.canvas);
    }
  }

  setPosition(position: GlassRendererContext['position']): void {
    if (!this.canvas) return;
    this.canvas.style.left = `${position.x}px`;
    this.canvas.style.top = `${position.y}px`;
  }

  resize(): void {
    // Handled in update
  }

  destroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.canvas?.remove();
    if (this.gl) {
      if (this.displacementTexture) this.gl.deleteTexture(this.displacementTexture);
      if (this.sourceTexture) this.gl.deleteTexture(this.sourceTexture);
      if (this.program) this.gl.deleteProgram(this.program);
    }
    this.canvas = null;
    this.gl = null;
    this.program = null;
    this.displacementTexture = null;
    this.sourceTexture = null;
    this.videoElement = null;
  }

  private uploadDisplacementMap(gl: WebGLRenderingContext, context: GlassRendererContext): void {
    if (!this.displacementTexture) {
      this.displacementTexture = gl.createTexture();
    }
    gl.bindTexture(gl.TEXTURE_2D, this.displacementTexture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      context.displacementMap.width,
      context.displacementMap.height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      context.displacementMap.data,
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  }

  private uploadSourceFromCanvas(gl: WebGLRenderingContext, source: HTMLCanvasElement): void {
    if (!this.sourceTexture) {
      this.sourceTexture = gl.createTexture();
    }
    gl.bindTexture(gl.TEXTURE_2D, this.sourceTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  }

  private startVideoLoop(context: GlassRendererContext): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    const tick = () => {
      if (!this.gl || !this.videoElement) return;
      if (!this.sourceTexture) {
        this.sourceTexture = this.gl.createTexture();
      }
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.sourceTexture);
      this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.RGBA,
        this.gl.RGBA,
        this.gl.UNSIGNED_BYTE,
        this.videoElement,
      );
      this.renderFrame(context);
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  private renderFrame(context: GlassRendererContext): void {
    if (!this.gl || !this.program || !this.canvas) return;
    const gl = this.gl;
    const lens = resolveLens(context.lens);

    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(this.program);

    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const texCoords = new Float32Array([0, 1, 1, 1, 0, 0, 1, 0]);

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(this.program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const texBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);
    const texLoc = gl.getAttribLocation(this.program, 'a_texCoord');
    gl.enableVertexAttribArray(texLoc);
    gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.sourceTexture);
    gl.uniform1i(gl.getUniformLocation(this.program, 'u_source'), 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.displacementTexture);
    gl.uniform1i(gl.getUniformLocation(this.program, 'u_displacement'), 1);

    gl.uniform2f(
      gl.getUniformLocation(this.program, 'u_resolution'),
      this.canvas.width,
      this.canvas.height,
    );
    gl.uniform1f(gl.getUniformLocation(this.program, 'u_scale'), lens.depth * lens.scale * 4);
    gl.uniform1f(gl.getUniformLocation(this.program, 'u_chroma'), lens.chroma);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.deleteBuffer(posBuffer);
    gl.deleteBuffer(texBuffer);
  }
}

# Liquid Glass Effect — مرجع شامل

> وثيقة مرجعية تجمع: ديمو HTML تفاعلي، مقالة Wikipedia عن قانون الانكسار، ومقالة تقنية عن Liquid Glass في المتصفح.

---

## جدول المحتويات

1. [الديمو التفاعلي — Bottom Tab Bar (HTML)](#1-الديمو-التفاعلي--bottom-tab-bar-html)
2. [قانون الانكسار — Wikipedia (عربي)](#2-قانون-الانكسار--wikipedia-عربي)
3. [Liquid Glass in the Browser — المقالة التقنية](#3-liquid-glass-in-the-browser--المقالة-التقنية)

---

## 1. الديمو التفاعلي — Bottom Tab Bar (HTML)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Liquid Glass — Bottom Tab Bar</title>
  <style>
    :root {
      --ink: #F3F1FA;
      --ink-dim: #B9B3D6;
      --bg: #100B22;
      --violet: #8B6BFF;
      --cyan: #3FE0D0;
      --pink: #FF5FA2;
      --glass-bg: rgba(255, 255, 255, 0.10);
      --glass-bg-fallback: rgba(255, 255, 255, 0.14);
      --glass-border: rgba(255, 255, 255, 0.35);
      --bar-radius: 30px;
    }

    * {
      box-sizing: border-box;
    }

    html,
    body {
      margin: 0;
      padding: 0;
      background: var(--bg);
      color: var(--ink);
      font-family: -apple-system, "SF Pro Text", ui-rounded, "Segoe UI", system-ui, sans-serif;
      min-height: 100dvh;
      overflow-x: hidden;
    }

    /* ---------- Aurora backdrop, this is what the glass will refract ---------- */
    .aurora {
      position: fixed;
      inset: 0;
      z-index: 0;
      background:
        radial-gradient(60% 45% at 15% 10%, var(--violet) 0%, transparent 65%),
        radial-gradient(55% 40% at 85% 15%, var(--cyan) 0%, transparent 60%),
        radial-gradient(65% 55% at 50% 100%, var(--pink) 0%, transparent 65%),
        var(--bg);
      filter: saturate(1.15);
      animation: drift 26s ease-in-out infinite alternate;
    }

    @media (prefers-reduced-motion: reduce) {
      .aurora {
        animation: none;
      }
    }

    @keyframes drift {
      0%   { background-position: 0% 0%, 0% 0%, 0% 0%; }
      100% { background-position: 6% -4%, -5% 5%, 3% -3%; }
    }

    main {
      position: relative;
      z-index: 1;
      max-width: 480px;
      margin: 0 auto;
      padding: 56px 22px 160px;
    }

    header {
      margin-bottom: 34px;
    }

    h1 {
      font-size: 30px;
      line-height: 1.15;
      letter-spacing: -0.01em;
      margin: 0 0 10px;
      font-weight: 650;
    }

    header p {
      margin: 0;
      color: var(--ink-dim);
      font-size: 15px;
      line-height: 1.55;
      max-width: 34ch;
    }

    .cards {
      display: grid;
      gap: 14px;
    }

    .card {
      border-radius: 22px;
      padding: 20px;
      background: linear-gradient(155deg, rgba(255, 255, 255, 0.10), rgba(255, 255, 255, 0.02));
      border: 1px solid rgba(255, 255, 255, 0.10);
      min-height: 96px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }

    .card.tall {
      min-height: 200px;
    }

    .card h3 {
      margin: 0 0 4px;
      font-size: 16px;
      font-weight: 600;
    }

    .card span {
      font-size: 13px;
      color: var(--ink-dim);
    }

    .card.a {
      background: linear-gradient(155deg, rgba(139, 107, 255, 0.35), rgba(139, 107, 255, 0.05));
    }

    .card.b {
      background: linear-gradient(155deg, rgba(63, 224, 208, 0.30), rgba(63, 224, 208, 0.04));
    }

    .card.c {
      background: linear-gradient(155deg, rgba(255, 95, 162, 0.32), rgba(255, 95, 162, 0.04));
    }

    .grid2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }

    footer.note {
      margin-top: 34px;
      color: var(--ink-dim);
      font-size: 12.5px;
      line-height: 1.6;
    }

    /* ---------- The Liquid Glass tab bar ---------- */
    .tabbar-wrap {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 22px;
      display: flex;
      justify-content: center;
      z-index: 10;
      padding: 0 20px;
      pointer-events: none;
    }

    .tabbar {
      pointer-events: auto;
      position: relative;
      width: min(420px, 100%);
      height: 64px;
      border-radius: var(--bar-radius);
      display: flex;
      align-items: center;
      background: var(--glass-bg-fallback);
      backdrop-filter: blur(18px) saturate(160%);
      -webkit-backdrop-filter: blur(18px) saturate(160%);
      box-shadow:
        0 18px 40px -12px rgba(0, 0, 0, 0.55),
        inset 0 0 0 1px var(--glass-border);
      overflow: hidden;
    }

    /* Chrome/Chromium: real refraction via SVG displacement filter */
    body.has-svg-filter .tabbar {
      background: var(--glass-bg);
      backdrop-filter: url(#liquidGlassFilter) saturate(150%);
      -webkit-backdrop-filter: url(#liquidGlassFilter) saturate(150%);
    }

    /* specular rim highlight, sits above the blurred content */
    .tabbar::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      padding: 1px;
      background: conic-gradient(
        from 200deg at 50% 0%,
        rgba(255, 255, 255, 0.85),
        rgba(255, 255, 255, 0) 30%,
        rgba(255, 255, 255, 0) 70%,
        rgba(255, 255, 255, 0.55) 100%
      );
      -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      mix-blend-mode: screen;
      pointer-events: none;
    }

    .tabbar::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.35),
        inset 0 -6px 14px rgba(0, 0, 0, 0.20);
      pointer-events: none;
    }

    .tab-indicator {
      position: absolute;
      top: 8px;
      bottom: 8px;
      width: calc((100% - 16px) / 5);
      left: 8px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.16);
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.28);
      transition: transform 0.42s cubic-bezier(0.2, 0.9, 0.25, 1.15);
    }

    .tabs {
      position: relative;
      z-index: 1;
      display: flex;
      width: 100%;
      height: 100%;
    }

    .tab {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      color: var(--ink-dim);
      padding: 0;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }

    .tab svg {
      width: 23px;
      height: 23px;
      stroke: currentColor;
      stroke-width: 1.8;
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round;
      transition: transform 0.3s ease, stroke 0.3s ease;
    }

    .tab.active {
      color: #fff;
    }

    .tab.active svg {
      transform: translateY(-1px) scale(1.06);
    }

    .browser-note {
      position: fixed;
      top: 14px;
      right: 14px;
      z-index: 20;
      font-size: 11.5px;
      color: var(--ink-dim);
      background: rgba(0, 0, 0, 0.35);
      border: 1px solid rgba(255, 255, 255, 0.12);
      padding: 6px 10px;
      border-radius: 999px;
      backdrop-filter: blur(6px);
    }
  </style>
</head>
<body>

  <!-- SVG filter definitions: the displacement map image (href set by JS) drives the refraction -->
  <svg width="0" height="0" style="position:absolute">
    <filter
      id="liquidGlassFilter"
      x="-15%"
      y="-40%"
      width="130%"
      height="180%"
      color-interpolation-filters="sRGB"
    >
      <feImage
        id="dispMap"
        x="0"
        y="0"
        width="100%"
        height="100%"
        result="displacement_map"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="displacement_map"
        scale="34"
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  </svg>

  <div class="aurora"></div>
  <span class="browser-note" id="browserNote">detecting…</span>

  <main>
    <header>
      <h1>Liquid Glass, in a tab bar</h1>
      <p>
        A bottom tab bar built the way the article describes it: a squircle bezel,
        a precomputed displacement field, and an SVG filter doing the actual refraction
        of everything behind it.
      </p>
    </header>

    <section class="cards">
      <div class="card tall a">
        <h3>Convex squircle bezel</h3>
        <span>Soft flat-to-curve transition, no harsh interior edge</span>
      </div>
      <div class="grid2">
        <div class="card b">
          <h3>127 samples</h3>
          <span>Per radius, then rotated around the bar</span>
        </div>
        <div class="card c">
          <h3>R/G channels</h3>
          <span>Encode X/Y displacement, 8‑bit each</span>
        </div>
      </div>
      <div class="card">
        <h3>Scroll behind the bar</h3>
        <span>Watch the aurora bend through the bezel at the bottom</span>
      </div>
    </section>

    <footer class="note">
      The refraction only renders in Chromium browsers, since only they currently support
      SVG filters as <code>backdrop-filter</code>. Everywhere else this falls back to a plain
      frosted blur, same as the article's own demos.
    </footer>
  </main>

  <div class="tabbar-wrap">
    <nav class="tabbar" aria-label="Primary">
      <div class="tab-indicator" id="tabIndicator"></div>
      <div class="tabs" id="tabs">
        <button class="tab active" data-i="0" aria-label="Home">
          <svg viewBox="0 0 24 24">
            <path d="M4 11.5 12 4l8 7.5"/>
            <path d="M6 10v9h5v-5h2v5h5v-9"/>
          </svg>
        </button>
        <button class="tab" data-i="1" aria-label="Search">
          <svg viewBox="0 0 24 24">
            <circle cx="10.5" cy="10.5" r="6.5"/>
            <path d="m20 20-4.6-4.6"/>
          </svg>
        </button>
        <button class="tab" data-i="2" aria-label="Create">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="8.5"/>
            <path d="M12 8.2v7.6M8.2 12h7.6"/>
          </svg>
        </button>
        <button class="tab" data-i="3" aria-label="Library">
          <svg viewBox="0 0 24 24">
            <path d="M6 4h9a2 2 0 0 1 2 2v14l-6.5-3.4L4 20V6a2 2 0 0 1 2-2Z"/>
          </svg>
        </button>
        <button class="tab" data-i="4" aria-label="Profile">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="8.5" r="3.5"/>
            <path d="M4.8 20c1.2-3.6 4.1-5.5 7.2-5.5s6 1.9 7.2 5.5"/>
          </svg>
        </button>
      </div>
    </nav>
  </div>

  <script>
    (function () {
      // ---------------------------------------------------------------
      // Build a displacement map image for a rounded-rect glass surface,
      // following the article: convex squircle height function, derivative
      // gives refraction strength, direction follows the shape's SDF normal.
      // ---------------------------------------------------------------

      function heightFn(t) {
        // convex squircle: y = (1-(1-t)^4)^(1/4)
        return Math.pow(1 - Math.pow(1 - t, 4), 0.25);
      }

      function roundedRectSDF(px, py, hw, hh, r) {
        // positive = distance INSIDE the shape to its border, 0 on border, negative outside
        const ax = Math.abs(px);
        const ay = Math.abs(py);
        const qx = ax - (hw - r);
        const qy = ay - (hh - r);
        const outside =
          Math.sqrt(Math.max(qx, 0) ** 2 + Math.max(qy, 0) ** 2) +
          Math.min(Math.max(qx, qy), 0) -
          r;
        return -outside;
      }

      function buildDisplacementMap(w, h, radius, bezel, dispStrength) {
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        const img = ctx.createImageData(w, h);
        const hw = w / 2;
        const hh = h / 2;
        const eps = 1;
        const delta = 0.001;

        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const px = x - hw + 0.5;
            const py = y - hh + 0.5;
            const d = roundedRectSDF(px, py, hw, hh, radius);
            let dx = 0;
            let dy = 0;

            if (d >= 0 && d < bezel) {
              const t = d / bezel; // 0 at outer edge, 1 at end of bezel
              const y1 = heightFn(Math.max(0, t - delta));
              const y2 = heightFn(Math.min(1, t + delta));
              const derivative = (y2 - y1) / (2 * delta);

              // gradient of the SDF, used as the local surface normal direction
              const gx =
                roundedRectSDF(px + eps, py, hw, hh, radius) -
                roundedRectSDF(px - eps, py, hw, hh, radius);
              const gy =
                roundedRectSDF(px, py + eps, hw, hh, radius) -
                roundedRectSDF(px, py - eps, hw, hh, radius);
              const glen = Math.sqrt(gx * gx + gy * gy) || 1;
              const nx = gx / glen;
              const ny = gy / glen; // points further inside as d increases

              const mag = Math.min(1, Math.abs(derivative) * 0.55) * (1 - t * 0.25);
              // convex surfaces keep rays inside: sample pulls outward toward the edge
              dx = nx * mag * dispStrength;
              dy = ny * mag * dispStrength;
            }

            const idx = (y * w + x) * 4;
            img.data[idx]     = Math.max(0, Math.min(255, Math.round(128 - dx)));
            img.data[idx + 1] = Math.max(0, Math.min(255, Math.round(128 - dy)));
            img.data[idx + 2] = 128;
            img.data[idx + 3] = 255;
          }
        }

        ctx.putImageData(img, 0, 0);
        return canvas.toDataURL();
      }

      function applyLiquidGlass() {
        const bar = document.querySelector('.tabbar');
        const rect = bar.getBoundingClientRect();
        const w = Math.max(2, Math.round(rect.width));
        const h = Math.max(2, Math.round(rect.height));
        const radius = 30;
        const bezel = 20;
        const scale = 34; // must match feDisplacementMap's scale attribute

        const dataUrl = buildDisplacementMap(w, h, radius, bezel, 1);
        const dispImage = document.getElementById('dispMap');
        dispImage.setAttribute('href', dataUrl);
        dispImage.setAttributeNS('http://www.w3.org/1999/xlink', 'href', dataUrl);
        document.getElementById('liquidGlassFilter').setAttribute('width', w * 1.3);
        document.querySelector('#liquidGlassFilter feDisplacementMap').setAttribute('scale', scale);
      }

      // Chromium is currently the only engine exposing SVG filters as backdrop-filter
      const isChromium =
        /Chrome/.test(navigator.userAgent) &&
        !/Chromebook/.test(navigator.userAgent) === true;
      const chromiumLike = /Chrome/.test(navigator.userAgent);
      const note = document.getElementById('browserNote');

      if (chromiumLike) {
        document.body.classList.add('has-svg-filter');
        applyLiquidGlass();
        window.addEventListener('resize', applyLiquidGlass);
        note.textContent = 'Chromium — full refraction';
      } else {
        note.textContent = 'Non-Chromium — blur fallback';
      }

      // Tab switching
      const tabs = document.querySelectorAll('.tab');
      const indicator = document.getElementById('tabIndicator');

      tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          tabs.forEach((t) => t.classList.remove('active'));
          tab.classList.add('active');
          const i = Number(tab.dataset.i);
          indicator.style.transform = `translateX(${i * 100}%)`;
        });
      });
    })();
  </script>

</body>
</html>
```

---

## 2. قانون الانكسار — Wikipedia (عربي)

> **المصدر:** ويكيبيديا — مقالة «قانون الانكسار»  
> **آخر تعديل:** 18 يونيو 2026، الساعة 05:24

### عناصر واجهة Wikipedia (كما ظهرت في النسخة المحفوظة)

```
ويكيبيديا
ابحث في ويكيبيديا
بحث
تبرع
إنشاء حساب
دخول

ويكي تهوى المعالم: صوّر معلمًا تاريخًا، ساعد ويكيبيديا واربح!
اعرف أكثر
```

### المحتويات

- المقدمة
- صيغة القانون
- تاريخ القانون
- مراجع
- اقرأ أيضًا
- قانون الانكسار

### أدوات المقالة

```
مقالة | نقاش | اقرأ | عدّل | تاريخ

المظهر أخف
النص: صغير | قياسي | كبير
العرض: قياسي | عريض
اللون (تجريبية): تلقائي | فاتح | داكن
```

---

### المقدمة

**انكسار الضوء بين وسطين مختلفي معامل الانكسار.**

مخطوطة بخط ابن سهل تثبت أنه أول من اكتشف قانون الانكسار.

في البصريات والفيزياء، **قانون الانكسار** (الإنجليزية: law of refraction)، ويعرف أيضًا بـ:

- **قانون سنيل** — نسبةً لويلبرورد سنيليوس
- **قانون ديكارت** — عند الفرانكوفون نسبةً لرينيه ديكارت
- **قانون سنيل - ديكارت**

هو صيغة رياضية تصف العلاقة ما بين زوايا السقوط والانكسار، عندما ينتقل الضوء أو غيره من الأمواج ما بين وسطين مختلفين، مثل الهواء والماء، ويعتبر **ابن سهل** هو أول من اكتشف قانون الانكسار.

يستخدم القانون في البصريات في عملية تتبع الشعاع حيث يستخدم في حساب زوايا السقوط أو الانكسار، وكذلك يستخدم في التجارب البصرية وفي علم الأحجار الكريمة لمعرفة قرينة الانكسار لمادة مخصصة.

قد سُمي هذا القانون باسم الفلكي والرياضي **ويلبرورد سنيليوس** وهو واحد من واضعي القانون، وينص قانون سنيل على أن النسبة بين جيوب زوايا السقوط أو الانكسار في وسطين تكون مساوية لنسبة السرعتين في الوسطين.

---

### صيغة القانون

صيغة القانون الرياضية هي:

$$\frac{\sin \theta_1}{\sin \theta_2} = \frac{v_1}{v_2} = \frac{n_2}{n_1}$$

أو:

$$n_1 \sin \theta_1 = n_2 \sin \theta_2$$

**حيث:**

| الرمز | المعنى |
|-------|--------|
| θ₁ | زاوية سقوط الموجة من الوسط الأول إلى الوسط الثاني |
| θ₂ | زاوية انكسار الموجة في الوسط الثاني |
| v₁ | سرعة الضوء في الوسط الأول |
| v₂ | سرعة الضوء في الوسط الثاني |
| n₁ | معامل الانكسار للوسط الأول |
| n₂ | معامل الانكسار للوسط الثاني |

**انكسار الضوء وانعكاسه بين وسطين: الهواء وبلكسيجلاس شفاف.**

- **إنكسار:**
  - زاوية السقوط: بين الشعاع والسطح
  - زاوية الانكسار: بين الشعاع المنكسر والسطح
- **انعكاس:**
  - زاوية السقوط: بين الشعاع الساقط والعمودي على السطح
  - زاوية الانعكاس: بين الشعاع المنعكس والعمودي على السطح

إذا كان معامل انكسار الوسط الأول أصغر من معامل انكسار الوسط الثاني، أي أن سرعة الموجة في هذا الأخير تقل، مثل المرور من الهواء إلى الماء أو الزجاج، فإن زاوية الانكسار تكون أقل من زاوية السقوط، والعكس بالعكس.

---

### تاريخ القانون

عثر الإغريقي **كلاوديوس بطليموس** على علاقة ما بين زوايا الانكسار، لكنها كانت غير دقيقة بالنسبة للزوايا الغير صغيرة. كان بطليموس واثقًا من أنه وضع قانونًا تجريبيًا دقيقًا فحاول أن يلفق النتائج لتناسب نظريته.

وقام **الحسن بن الهيثم** في كتابه *المناظر* بفرصة للتعرف على قانون الانكسار لكنه لم يوفق كليًا.

ويعتبر **ابن سهل** أول من وصف قانون الانكسار وصفًا صحيحًا.

- اكتشف **توماس هاريوت** قانون سنيل عام 1602، وعلى الرغم من ذلك فلم ينشر نتائج أبحاثه.
- في عام **1621** وضع **ويلبرورد سنيليوس** الصيغة الرياضية وظلت الصيغة غير منشورة طيلة حياته.
- في عام **1637** استخدم **رينيه ديكارت** حساب جيوب الزوايا في بعض مسائل الانكسار.

وطبقًا لكلام **ديجكستيرهويس** فإنه في كتاب (*De natura lucis et proprietate*) قال **إسحاق فوشيوس**: ديكارت رأى أوراق سنيل واستخدمها في إثباته. نحن نعرف أن هذه تهمة لا تستحق أن نتهمه بها، لكن تاريخ العلم مليء بهذه التهمة.

---

### مراجع

1. "Ptolemy (ca. 100-ca. 170)". Eric Weinstein's World of Scientific Biography. مؤرشف من الأصل في 2024-04-24. {{استشهاد بويب}}: تجاهل المحلل الوسيط |عبر الارشيف= لأنه غير معروف (مساعدة)
2. عبد الحميد صبرة (1981), *Theories of Light from Descartes to Newton*, مطبعة جامعة كامبريدج. (cf. Pavlos Mihas, Use of History in Developing ideas of refraction, lenses and rainbow, p. 5, Demokritus University, تراقيا، اليونان.) نسخة محفوظة 27 مايو 2012 على موقع واي باك مشين
3. Wolf, K. B. (1995), "Geometry and dynamics in refracting systems", *European Journal of Physics* 16: 14–20.
4. Rashed, Roshdi (1990). "A pioneer in anaclastics: Ibn Sahl on burning mirrors and lenses". *Isis*. DOI:10.1086/355456. {{استشهاد بدورية محكمة}}: تجاهل المحلل الوسيط |المجلد رقم= لأنه غير معروف (مساعدة) وتجاهل المحلل الوسيط |عدد صفحات= لأنه غير معروف (مساعدة)
5. Fokko Jan Dijksterhuis (2004). *Lenses and Waves: Christiaan Huygens and the Mathematical Science of Optics in the Seventeenth Century* (بالإنجليزية). Springer. ISBN:1402026978. Archived from the original on 2020-02-26. Retrieved 2024-12-28.

---

### اقرأ أيضًا

- انعكاس الضوء
- سرعة الضوء

**بوابات:** الفيزياء | بصريات

**تصنيفان:** بصريات هندسية | إلكترونيات بصرية

---

### تذييل Wikipedia

```
آخر تعديل لهذه الصفحة كان يوم 18 يونيو 2026، الساعة 05:24.
تمت معالجة الصفحة باستخدام Parsoid.

النصوص متاحة تحت رخصة المشاع الإبداعي الملزمة بنسبة العمل لمؤلفه
وبترخيص الأعمال المشتقة بالمثل 4.0؛ قد تُطبّق شروط إضافية.
استخدامُك هذا الموقع هو موافقةٌ على شروط الاستخدام وسياسة الخصوصية.
ويكيبيديا ® هي علامة تجارية مسجلة لمؤسسة ويكيميديا، وهي منظمة غير ربحية.

سياسة الخصوصية | حول ويكيبيديا | إخلاء مسؤولية
جهات الاتصال المخصصة للأغراض القانونية وللسلامة
القواعد السلوكية | المطورون | إحصائيات
بيان تعريف الارتباطات | نسخة للأجهزة المحمولة

Wikimedia Foundation
Powered by MediaWiki
```

---

## 3. Liquid Glass in the Browser — المقالة التقنية

> **العنوان:** Liquid Glass in the Browser: Refraction with CSS and SVG  
> **التاريخ:** SEP 04, 2025  
> **الصورة:** Photo by Martin Martz on Unsplash

```
Hello
Blog
CV
Articles / 2025 / SEP / 04
```

---

### Introduction

Apple introduced the Liquid Glass effect during WWDC 2025 in June—a stunning UI effect that makes interface elements appear to be made of curved, refractive glass. This article is a hands‑on exploration of how to recreate a similar effect on the web using CSS, SVG displacement maps, and physics-based refraction calculations.

Instead of chasing pixel‑perfect parity, we'll approximate Liquid Glass, recreating the core refraction and a specular highlight, as a focused proof‑of‑concept you can extend.

We'll build up the effect from first principles, starting with how light bends when passing through different materials.

> **Chrome‑only demo**
>
> The interactive demo at the end currently works in Chrome only (due to SVG filters as backdrop‑filter).
>
> You can still read the article and interact with the inline simulations in other browsers.

---

### Understanding Refraction

Refraction is what happens when light changes direction as it passes from one material to another (like from air into glass). This bending occurs because light travels at different speeds through different materials.

The relationship between the incoming and outgoing light angles is described by **Snell–Descartes law**:

$$n_1 \sin(\theta_1) = n_2 \sin(\theta_2)$$

| Symbol | Meaning |
|--------|---------|
| n₁ | refractive index of first medium |
| θ₁ | angle of incidence |
| n₂ | refractive index of second medium |
| θ₂ | angle of refraction |

**In the above interactive diagram, you can see that:**

- When **n₂ = n₁**, the light ray passes straight through without bending.
- When **n₂ > n₁**, the ray bends toward the normal (the imaginary line perpendicular to the surface).
- When **n₂ < n₁**, the ray bends away from the normal, and depending on the angle of incidence, it may bend so much that it reflects back into the original medium instead of passing through. **This is called Total Internal Reflection**
- When incident ray is orthogonal to the surface, it passes straight through regardless of refractive indices.

---

### Limitations in this project

To keep things focused we avoid complex branches of behavior by constraining the scenario:

- Ambient medium has **index = 1** (air).
- Use materials with **index > 1**, and prefer **1.5** (glass).
- Only one refraction event (ignore any later exit / second refraction).
- Incident rays are always orthogonal to the background plane (no perspective).
- Objects are 2D shapes parallel to the background (no perspective).
- No gap between objects and background plane (only one refraction).
- **Circle shapes only** in this article:
  - Extending to other shapes requires preliminary calculations.
  - Circles let us form rounded rectangles by stretching the middle.

Under these assumptions every ray we manipulate has a well-defined refracted direction via Snell's Law, and we simplify a lot our calculations.

---

### Creating the Glass Surface

To create our glass effect, we need to define the shape of our virtual glass surface. Think of this like describing the cross-section of a lens or curved glass panel.

#### Surface Function

Our glass surface is described by a mathematical function that defines how thick the glass is at any point from its edge to the end of the bezel. This surface function takes a value between **0** (at the outer edge) and **1** (end of bezel, start of flat surface) and returns the height of the glass at that point.

```javascript
const height = f(distanceFromSide);
```

From the height we can calculate the angle of incidence, which is the angle between the incoming ray and the normal to the surface at that point. The normal is simply the derivative of the height function at that point, rotated by **−90 degrees**:

```javascript
const delta = 0.001; // Small value to approximate derivative
const y1 = f(distanceFromSide - delta);
const y2 = f(distanceFromSide + delta);
const derivative = (y2 - y1) / (2 * delta);
const normal = { x: -derivative, y: 1 }; // Derivative, rotated by -90 degrees
```

#### Equations

For this article, we will use four different height functions to demonstrate the effect of the surface shape on the refraction:

**1. Convex Circle**

$$y = \sqrt{1 - (1 - x)^2}$$

Simple circular arc → a spherical dome. Easier than the squircle, but the transition to the flat interior is harsher, producing sharper refraction edges—more noticeable when the shape is stretched away from a true circle.

**2. Convex Squircle**

$$y = \sqrt[4]{1 - (1 - x)^4}$$

Uses the Squircle Apple favors: a softer flat→curve transition that keeps refraction gradients smooth even when stretched into rectangles—no harsh interior edges. It also makes the bezel appear optically thinner than its physical size because the flatter outer zones bend light less.

**3. Concave**

$$y = 1 - \text{Convex}(x)$$

The concave surface is the complement of the convex function, creating a bowl-like depression. This surface causes light rays to diverge outward, displacing them beyond the glass boundaries.

**4. Lip**

$$y = \text{mix}(\text{Convex}(x), \text{Concave}(x), \text{Smootherstep}(x))$$

Blends convex and concave via Smootherstep: raised rim, shallow center dip.

We could make the surface function more complex by adding more parameters, but these four already give a good idea of how the surface shape affects the refraction.

---

### Simulation

Now let's see these surface functions in action through interactive ray tracing simulations. The following visualization demonstrates how light rays behave differently as they pass through each surface type, helping us understand the practical implications of our mathematical choices.

From the simulation, we can see that:

- **Concave surfaces** push rays outside the glass
- **Convex surfaces** keep them inside

We want to avoid outside displacement because it requires sampling background beyond the object. Apple's Liquid Glass appears to favor convex profiles (except for the Switch component, covered later).

The background arrow indicates displacement—how far a ray lands compared to where it would have landed without glass. Color encodes magnitude (longer → more purple).

Take a look at symmetry: rays at the same distance from the border share the same displacement magnitude on each side. **Compute once, reuse around the bezel/object.**

---

### Displacement Vector Field

Now that calculated the displacement at a distance from border, let's calculate the displacement vector field for the entire glass surface.

The vector field describes at every position on the glass surface how much the light ray is displaced from its original position, and in which direction. In a circle, this displacement is always orthogonal to the border.

#### Pre-calculating the displacement magnitude

Because we saw that this displacement magnitude is symmetric around the bezel, we can pre-calculate it for a range of distances from the border, on a single radius.

This allows us to calculate everything in two dimensions once (x and z axis), on one "half-slice" of the object, and we will the rotate these pre-calculated displacements around the z-axis.

The actual number of samples we need to do on a radius is of **127 ray simulations**, and is determined by the constraints of the SVG Displacement Map resolution. (See next section.)

#### Normalizing vectors

In the above diagram, the arrows are all scaled down for visibility, so they do not overlap. This is normalization, and is also useful from a technical standpoint.

To use these vectors in a displacement map, we need to normalize them. Normalization means scaling the vectors so that their maximum magnitude is **1**, which allows us to represent them in a fixed range.

So we calculate the maximum displacement magnitude in our pre-calculated array:

```javascript
const maximumDisplacement = Math.max(...displacementMagnitudes);
```

And we divide each vector's magnitude by this maximum:

```javascript
displacementVector_normalized = {
  angle: normalAtBorder,
  magnitude: magnitude / maximumDisplacement,
};
```

We store `maximumDisplacement` as we will need it to re-scale the displacement map back to the actual magnitudes.

---

### SVG Displacement Map

Now we need to translate our mathematical refraction calculations into something the browser can actually render. We'll use SVG displacement maps.

A displacement map is simply an image where each pixel's color tells the browser how far it should find the actual pixel value from its current position.

SVG's `<feDisplacementMap />` encodes these pixels in a 32 bit RGBA image, where each channel represents a different axis of displacement.

It's up to the user to define which channel corresponds to which axis, but it is important to understand the constraint: Because each channel is 8 bits, the displacement is limited to a range of **-128 to 127 pixels** in each direction. (256 values possible in total). **128 is the neutral value**, meaning no displacement.

SVG filters can only use images as displacement maps, so we need to convert our displacement vector field into an image format.

```jsx
<svg colorInterpolationFilters="sRGB">
  <filter id={id}>
    <feImage
      href={displacementMapDataUrl}
      x={0}
      y={0}
      width={width}
      height={height}
      result="displacement_map"
    />
    <feDisplacementMap
      in="SourceGraphic"
      in2="displacement_map"
      scale={scale}
      xChannelSelector="R" // Red Channel for displacement in X axis
      yChannelSelector="G" // Green Channel for displacement in Y axis
    />
  </filter>
</svg>
```

`<feDisplacementMap />` uses the red channel for the X axis and the green channel for the Y axis. The blue and alpha channels are ignored.

#### Scale

The Red (X) and Green (Y) channels are 8‑bit values (0–255). Interpreted without any extra scaling, they map linearly to a normalized displacement in [−1, 1], with 128 as the neutral value (no displacement):

| Channel value | Normalized displacement |
|---------------|-------------------------|
| 0 | −1 |
| 128 | 0 |
| 255 | 1 |

The `scale` attribute of `<feDisplacementMap />` multiplies this normalized amount:

| Channel value | Pixel shift |
|---------------|-------------|
| 0 | −scale |
| 128 | 0 |
| 255 | scale |

Because our vectors are normalized using the maximum possible displacement (in pixels) as the unit, we can reuse that maximum directly as the filter's scale:

```jsx
<feDisplacementMap
  in="SourceGraphic"
  in2="displacement_map"
  scale={maximumDisplacement} // max displacement (px) → real pixel shift
  xChannelSelector="R"
  yChannelSelector="G"
/>
```

You can also animate scale to fade the effect in/out—no need to recompute the map (useful for artistic control even if not physically exact).

#### Vector to Red-Green values

To convert our displacement vector field into a displacement map, we need to convert each vector into a color value. The red channel will represent the X component of the vector, and the green channel will represent the Y component.

We currently have polar coordinates (angle and magnitude) for each vector, so we need to convert them to Cartesian coordinates (X and Y) before mapping them to the red and green channels.

```javascript
const x = Math.cos(angle) * magnitude;
const y = Math.sin(angle) * magnitude;
```

Because we normalised our vectors already, magnitude here is between 0 and 1.

From here, we just remap the values to the range of 0 to 255 for the red and green channels:

```javascript
const result = {
  r: 128 + x * 127, // Red channel is the X component, remapped to 0-255
  g: 128 + y * 127, // Green channel is the Y component, remapped to 0-255
  b: 128,           // Blue channel is ignored
  a: 255,           // Alpha channel is fully opaque
};
```

After converting every vector in the map to color value, we get an image that can be used as a displacement map in the SVG filter.

---

### Playground

This playground applies the SVG displacement filter to a simple scene and lets you tweak surface shape, bezel width, glass thickness, and effect scale. Watch how these inputs change the refraction field, the generated displacement map, and the final rendering.

---

### Specular Highlight

The final piece of our Liquid Glass effect is the specular highlight—those bright, shiny edges you see on real glass objects when light hits them at certain angles.

The way Apple implements it seems to be a simple rim light effect, where the highlight appears around the edges of the glass object, and its intensity varies based on the angle of the surface normal relative to a fixed light direction.

#### Combining Refraction and Specular Highlight

In the final SVG filter, we combine both the displacement map for refraction and the specular highlight effect.

Both are loaded as separate `<feImage />` elements, and then combined using `<feBlend />` to overlay the highlight on top of the refracted image.

But this part is actually the most "creative" part of the effect, and it's just by tweaking the number of filters, and their parameters, that you can get a variety of different looks.

---

### SVG Filter as backdrop-filter

This is the part where cross-browser compatibility ends. Only Chrome currently supports using SVG filters as backdrop-filter, which is essential for applying the Liquid Glass effect to UI components:

```css
.glass-panel {
  backdrop-filter: url(#liquidGlassFilterId);
}
```

> **Note:** The backdrop-filter dimensions does not adjust automatically to the element size, so you need to ensure that your filter images fit the size of your elements.

Now that we have all the pieces in place, we can create components that use this effect.

---

### Bringing It All Together: Real UI Components

With our refraction math and displacement maps working, let's see how this translates to actual UI components you might use in an application.

> **Chrome‑specific demo**
>
> Chrome allows using SVG filters as backdrop-filter, which isn't part of the CSS spec.
>
> Above, we used regular filter so it's viewable in Safari/Firefox.
>
> The next components use backdrop-filter, so they're Chrome‑only.

The goal won't be to create real components for production, but just to get a taste of how the effect looks in different UI elements.

#### Magnifying Glass

This component actually uses two displacement maps: one for the refraction on the sides, and one for the zooming, which has a stronger refraction effect.

It also plays with shadows and scaling to create a more dynamic, interactive effect.

| Parameter | Value |
|-----------|-------|
| — | 0.50 |
| — | 9 |
| — | 1.00 |

#### Searchbox

```
Search
```

| Parameter | Value |
|-----------|-------|
| — | 0.20 |
| — | 4 |
| — | 0.70 |
| — | 1.0 |

#### Switch

This uses a lip bezel, which makes the surface convex on the outside and concave in the middle. This makes the center slider zoomed out, while the edges refract the inside.

| Parameter | Value |
|-----------|-------|
| — | 0.50 |
| — | 6 |
| — | 1.00 |
| — | 0.2 |

#### Slider

Slider allows you to see the current level through the glass, while the sides refract the background. It uses a convex bezel.

| Parameter | Value |
|-----------|-------|
| — | 0.40 |
| — | 7 |
| — | 1.00 |
| — | 0.0 |

#### Music Player

This fake music player UI tries to mimic the look of Apple Music's Liquid Glass panels, using a convex bezel and a subtle specular highlight.

It relies on the iTunes Search API to fetch album art and song details.

```
Jimi Hendrix
```

| Parameter | Value |
|-----------|-------|
| — | 0.40 |
| — | 6 |
| — | 1.00 |
| — | 1.0 |
| — | 1.00 |
| — | 0.60 |

---

### Conclusion

This prototype distills Apple's Liquid Glass into real‑time refraction plus a simple highlight. It's flexible, but still Chrome‑bound—only Chromium exposes SVG filters as backdrop-filter. That said, it's already viable inside Chromium‑based runtimes like Electron, elsewhere you could fake a softer fallback with layered blur.

Treat this strictly as experimental. Dynamic shape/size changes are currently costly because nearly every tweak (besides animating `<filter />` props, like scale) forces a full displacement map rebuild.

The code needs a cleanup pass and perf work before any possible open‑source release.

Thanks for reading my first post—I'd genuinely love any feedback, ideas, critiques, or suggestions. If it sparked a thought or you know someone who'd enjoy this kind of deep‑dive, feel free to pass it along.

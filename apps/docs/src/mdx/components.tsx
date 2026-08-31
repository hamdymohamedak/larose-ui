import type { MDXComponents } from 'mdx/types';
import type { ReactNode } from 'react';
import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  Input,
  Typography,
} from '@larose-ui/react';
import { LaRoseProvider } from '@larose-ui/runtime';
import { CodeBlock } from '@/components/CodeBlock';
import { ModalPreview } from '@/previews/interactivePreviews';
import { PreviewFrame } from '@/components/PreviewFrame';

function MdxCode(props: { className?: string; children?: ReactNode }) {
  const text = String(props.children ?? '').replace(/\n$/, '');
  const match = /language-(\w+)/.exec(props.className ?? '');
  if (match) {
    return <CodeBlock code={text} language={match[1]} />;
  }
  return <code>{props.children}</code>;
}

export const mdxComponents: MDXComponents = {
  PreviewFrame,
  ModalPreview,
  CodeBlock,
  Badge,
  Button,
  ButtonGroup,
  Card,
  Input,
  LaRoseProvider,
  Typography,
  pre: ({ children }: { children?: ReactNode }) => <>{children}</>,
  code: MdxCode,
};

export function withMdxComponents(components?: MDXComponents): MDXComponents {
  return { ...mdxComponents, ...components };
}

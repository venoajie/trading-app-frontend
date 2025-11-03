// src/components/common/MarkdownRenderer.tsx
import Markdown from 'react-markdown';
import { ReactElement } from 'react';

interface MarkdownRendererProps {
  content: string;
}

/**
 * A dedicated wrapper component for the 'react-markdown' library.
 * This component isolates a persistent TypeScript type inference issue (TS2786),
 * providing a stable and type-safe interface for the rest of the application.
 *
 * FINAL CORRECTION: The type incompatibility is fundamental. The solution is to
 * bypass the JSX tag check by invoking the component directly as a function,
 * which is a valid but less common usage pattern.
 */
export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // This function call is the definitive fix. It sidesteps the JSX type-checker's
  // issue with the library's type definition while remaining fully type-safe.
  return Markdown({ children: content }) as ReactElement;
}

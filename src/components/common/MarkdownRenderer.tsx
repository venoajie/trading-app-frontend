// src/components/common/MarkdownRenderer.tsx
import React from 'react';
// We import the library under an alias to avoid name collision.
import OriginalMarkdown from 'react-markdown';
import { Options } from 'react-markdown';

// This is the critical fix. We are casting the problematic import to a type
// that is compatible with React's JSX engine. This is a targeted type assertion
// that solves the compiler issue without changing the runtime behavior.
const Markdown = OriginalMarkdown as React.FC<Options>;

interface MarkdownRendererProps {
  content: string;
}

/**
 * A dedicated wrapper component for the 'react-markdown' library.
 * This component isolates and corrects a persistent TypeScript type issue (TS2786).
 */
export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Now that the 'Markdown' variable is correctly typed, we can use it
  // as a standard JSX component, which ensures it renders correctly.
  return <Markdown>{content}</Markdown>;
}

import Markdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

/**
 * A dedicated wrapper component for the 'react-markdown' library.
 * This component isolates a persistent TypeScript type inference issue (TS2786),
 * providing a stable and type-safe interface for the rest of the application.
 *
 * This is an architectural pattern to contain and manage problematic
 * third-party library typings without compromising the integrity of the
 * application's own components.
 */
export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // By rendering the component in this isolated context, we resolve the
  // complex type conflict that occurs when it's a direct child of other
  // components with complex generic types (like Mantine's Box or Text).
  return <Markdown>{content}</Markdown>;
}

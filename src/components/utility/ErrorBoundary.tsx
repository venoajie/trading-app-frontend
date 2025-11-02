/** src/components/utility/ErrorBoundary.tsx */

import { Component, ErrorInfo, ReactNode } from 'react';
import { Button, Container, Paper, Text, Title } from '@mantine/core';

interface Props {
  // V7 API CHANGE: The `children` prop must be optional because when used as a route
  // `errorElement`, React Router does not pass any children to it.
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Container size="sm" style={{ paddingTop: 80, paddingBottom: 80 }}>
          <Paper withBorder p="lg" radius="md" shadow="md">
            {/* V7 API CHANGE: The 'align' prop is now 'ta' (text-align). */}
            <Title order={2} ta="center" mt="md" mb="xl">
              Something went wrong.
            </Title>
            <Text ta="center" mb="xl">
              An unexpected error has occurred. Please try refreshing the page.
            </Text>
            <Button fullWidth onClick={() => (window.location.href = '/')}>
              Go to Home Page
            </Button>
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

/** src/components/utility/ErrorBoundary.tsx */

import { Component, ErrorInfo, ReactNode } from 'react';
import { Button, Container, Paper, Text, Title } from '@mantine/core';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  // The error parameter is required by the React method signature but not used in this implementation.
  // The eslint-disable line is a standard way to acknowledge this.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // In a real application, you would log this error to a service
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Container size="sm" style={{ paddingTop: 80, paddingBottom: 80 }}>
          <Paper withBorder p="lg" radius="md" shadow="md">
            <Title order={2} align="center" mt="md" mb="xl">
              Something went wrong.
            </Title>
            <Text align="center" mb="xl">
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

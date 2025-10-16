
// src/pages/legal/TermsOfServicePage.jsx
import { Container, Title, Text, Paper } from '@mantine/core';

export function TermsOfServicePage() {
  return (
    <Container size="md">
      <Paper withBorder shadow="md" p="lg" mt="md">
        <Title order={1} mb="lg">Terms of Service</Title>
        <Text>
          [Placeholder for Terms of Service]
        </Text>
        <Text mt="md">
          This document outlines the terms and conditions governing your use of the Trading App. 
          By creating an account and using our service, you agree to be bound by these terms. 
          Please read them carefully.
        </Text>
        <Text mt="md">
          (The full, legally binding text will be provided by the legal department prior to launch.)
        </Text>
      </Paper>
    </Container>
  );
}
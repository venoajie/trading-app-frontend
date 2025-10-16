
// src/pages/legal/PrivacyPolicyPage.jsx
import { Container, Title, Text, Paper } from '@mantine/core';

export function PrivacyPolicyPage() {
  return (
    <Container size="md">
      <Paper withBorder shadow="md" p="lg" mt="md">
        <Title order={1} mb="lg">Privacy Policy</Title>
        <Text>
          [Placeholder for Privacy Policy]
        </Text>
        <Text mt="md">
          This document explains how the Trading App collects, uses, and protects your personal information. 
          Your privacy is of utmost importance to us.
        </Text>
        <Text mt="md">
          (The full, legally binding text will be provided by the legal department prior to launch.)
        </Text>
      </Paper>
    </Container>
  );
}
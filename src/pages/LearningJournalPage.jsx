
// src/pages/LearningJournalPage.jsx
import { Title, Text, Container } from '@mantine/core';

// CORRECTIVE ACTION: Changed from a named export to a default export
function LearningJournalPage() {
  return (
    <Container>
      <Title order={1}>Learning Journal</Title>
      <Text mt="md">
        This page will contain the Decision Journal, Assumption Tracking, and Strategy Effectiveness components
        as outlined in the Phase 3 implementation plan.
      </Text>
    </Container>
  );
}

export default LearningJournalPage;
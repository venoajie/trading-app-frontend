
// src/pages/LandingPage.jsx
import { Container, Title, Text, Stack, Paper, ThemeIcon, Group } from '@mantine/core';
import { IconTargetArrow, IconBrain, IconListCheck } from '@tabler/icons-react';

function Feature({ icon, title, description }) {
  return (
    <Paper withBorder radius="md" p="md">
      <Group>
        <ThemeIcon size="lg" variant="light" radius="md">
          {icon}
        </ThemeIcon>
        <div>
          <Text fw={500}>{title}</Text>
          <Text size="sm" c="dimmed">{description}</Text>
        </div>
      </Group>
    </Paper>
  );
}

export function LandingPage() {
  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <Stack gap="xs" align="center" ta="center">
          <Title order={1} style={{ fontSize: '3rem' }}>
            Unlock Your Trading Edge
          </Title>
          <Text size="xl" c="dimmed" maw={600}>
            Portopilot is a decision-support platform designed for serious traders. Move beyond guesswork and build a robust, professional-grade investment process.
          </Text>
        </Stack>

        <Stack gap="md" mt="xl">
          <Feature
            icon={<IconTargetArrow size={22} />}
            title="Decision Workspace"
            description="Analyze potential trades with an Expected Value calculator and challenge your assumptions with an AI Coach."
          />
          <Feature
            icon={<IconListCheck size={22} />}
            title="Learning Journal"
            description="Log every decision to track your process, identify biases, and learn from both wins and losses."
          />
          <Feature
            icon={<IconBrain size={22} />}
            title="Portfolio Intelligence"
            description="Understand your true risk exposure, track progress towards goals, and manage your liquidity profile."
          />
        </Stack>
      </Stack>
    </Container>
  );
}
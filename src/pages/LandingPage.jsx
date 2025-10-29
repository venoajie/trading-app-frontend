
// src/pages/LandingPage.jsx
import { Container, Title, Text, Button, SimpleGrid, ThemeIcon, Group, Box } from '@mantine/core';
import { IconTargetArrow, IconBrain, IconListCheck } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import classes from './LandingPage.module.css'; // Note: A simple CSS module for background styles

function Feature({ icon, title, description }) {
  return (
    <div>
      <Group>
        <ThemeIcon size={44} radius="md" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
          {icon}
        </ThemeIcon>
        <Box>
          <Text fw={700} fz="lg">
            {title}
          </Text>
          <Text c="dimmed">{description}</Text>
        </Box>
      </Group>
    </div>
  );
}

export function LandingPage() {
  return (
    <Container fluid p={0}>
      {/* 1. Hero Section */}
      <Box className={classes.hero}>
        <Container size="lg">
          <Title className={classes.title}>
            Clarity in Process, <br />
            <Text component="span" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} inherit>
              Mastery in Outcome
            </Text>
          </Title>

          <Text className={classes.description} c="dimmed">
            Portopilot is a decision-support platform for serious traders. Move beyond guesswork and build a robust, professional-grade investment process.
          </Text>

          <Button
            component={Link}
            to="/register"
            size="xl"
            className={classes.control}
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan' }}
          >
            Get Started
          </Button>
        </Container>
      </Box>

      {/* 2. Solution Pillars Section */}
      <Container size="lg" py="xl" mt="xl">
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing={{ base: 'xl', sm: '5rem' }}>
          <Feature
            icon={<IconTargetArrow size={28} stroke={1.5} />}
            title="Decision Workspace"
            description="Analyze trades with an Expected Value calculator and challenge assumptions with an AI Coach."
          />
          <Feature
            icon={<IconListCheck size={28} stroke={1.5} />}
            title="Learning Journal"
            description="Log every decision to track your process, identify biases, and learn from both wins and losses."
          />
          <Feature
            icon={<IconBrain size={28} stroke={1.5} />}
            title="Portfolio Intelligence"
            description="Understand true risk exposure, track progress towards goals, and manage your liquidity profile."
          />
        </SimpleGrid>
      </Container>
      
      {/* 3. Visual Proof & Final CTA (Combined) */}
      <Box className={classes.finalCta}>
        <Container size="lg" py="xl" mt="xl" ta="center">
            <Title order={2} className={classes.title}>Ready to elevate your process?</Title>
            <Text c="dimmed" maw={580} mx="auto" mt="xl">
                Stop reacting to the market and start executing your strategy with precision.
            </Text>
             <Button
                component={Link}
                to="/register"
                size="lg"
                variant="gradient"
                gradient={{ from: 'blue', to: 'cyan' }}
                mt="xl"
            >
                Create Your Account
            </Button>
        </Container>
      </Box>
    </Container>
  );
}
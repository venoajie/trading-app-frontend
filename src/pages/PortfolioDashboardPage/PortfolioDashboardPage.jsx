
// src/pages/PortfolioDashboardPage/PortfolioDashboardPage.jsx
import { Grid, Stack } from '@mantine/core';
import { GoalManager } from './components/GoalManager';
import { LiquidityProfile } from './components/LiquidityProfile';
import { StatCard } from './components/StatCard';
import { RiskExposureMap } from './components/RiskExposureMap';

export function PortfolioDashboardPage() {
  return (
    <Grid>
      {/* --- Top Row: Key Metrics (Global stats have been moved to the header) --- */}
      <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
        <StatCard title="Net Liquidity" value="$12,500" />
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
        <StatCard title="Buying Power" value="$8,500" />
      </Grid.Col>

      {/* --- Main Content Area --- */}
      <Grid.Col span={{ base: 12, lg: 8 }}>
        <RiskExposureMap />
      </Grid.Col>

      <Grid.Col span={{ base: 12, lg: 4 }}>
        <Stack>
          <LiquidityProfile />
          <GoalManager />
        </Stack>
      </Grid.Col>
    </Grid>
  );
}
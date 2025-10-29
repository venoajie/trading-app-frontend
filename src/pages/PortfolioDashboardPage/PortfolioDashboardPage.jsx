
// src/pages/PortfolioDashboardPage/PortfolioDashboardPage.jsx
import { Grid, Stack } from '@mantine/core';
import { GoalManager } from './components/GoalManager';
import { LiquidityProfile } from './components/LiquidityProfile';
import { StatCard } from './components/StatCard';
import { RiskExposureMap } from './components/RiskExposureMap';

export function PortfolioDashboardPage() {
  return (
    <Grid>
      {/* --- Top Row: Key Metrics --- */}
      <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
        <StatCard title="Total Value" value="$100,000" change="+1.25%" changeColor="green" />
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
        <StatCard title="Net Liquidity" value="$12,500" />
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
        <StatCard title="Buying Power" value="$8,500" />
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
        <StatCard title="YTD Return" value="-$1,800" change="-1.77%" changeColor="red" />
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
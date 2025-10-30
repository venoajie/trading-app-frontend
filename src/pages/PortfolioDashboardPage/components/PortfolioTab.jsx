
// src/pages/DashboardPage/components/PortfolioTab.jsx
import { Grid, Stack } from '@mantine/core';
import { GoalManager } from '../../PortfolioDashboardPage/components/GoalManager';
import { LiquidityProfile } from '../../PortfolioDashboardPage/components/LiquidityProfile';
import { StatCard } from '../../PortfolioDashboardPage/components/StatCard';
import { RiskExposureMap } from '../../PortfolioDashboardPage/components/RiskExposureMap';

export function PortfolioTab() {
  return (
    <Grid>
      <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
        <StatCard title="Net Liquidity" value="$12,500" />
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
        <StatCard title="Buying Power" value="$8,500" />
      </Grid.Col>

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
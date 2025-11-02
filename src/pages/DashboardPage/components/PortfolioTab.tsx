// src/pages/DashboardPage/components/PortfolioTab.tsx
import { Grid, Stack, Skeleton } from '@mantine/core';
import { GoalManager } from '../../PortfolioDashboardPage/components/GoalManager';
import { LiquidityProfile } from '../../PortfolioDashboardPage/components/LiquidityProfile';
import { StatCard } from '../../PortfolioDashboardPage/components/StatCard';
import { RiskExposureMap } from '../../PortfolioDashboardPage/components/RiskExposureMap';
import useDashboardStore from '../../../store/dashboardStore';

// Helper to format currency
const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

export function PortfolioTab() {
  const { kpis, riskExposureData, isLoading } = useDashboardStore();

  return (
    <Grid>
      <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
        <Skeleton visible={isLoading} height={85} radius="md">
          <StatCard
            title="Net Liquidity"
            value={formatCurrency(kpis.netLiquidity)}
          />
        </Skeleton>
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
        <Skeleton visible={isLoading} height={85} radius="md">
          <StatCard
            title="Buying Power"
            value={formatCurrency(kpis.buyingPower)}
          />
        </Skeleton>
      </Grid.Col>

      <Grid.Col span={{ base: 12, lg: 8 }}>
        <Skeleton visible={isLoading} height={450} radius="md">
          <RiskExposureMap data={riskExposureData} />
        </Skeleton>
      </Grid.Col>

      <Grid.Col span={{ base: 12, lg: 4 }}>
        <Stack>
          <Skeleton visible={isLoading} height={200} radius="md">
            <LiquidityProfile />
          </Skeleton>
          <Skeleton visible={isLoading} height={234} radius="md">
            <GoalManager />
          </Skeleton>
        </Stack>
      </Grid.Col>
    </Grid>
  );
}

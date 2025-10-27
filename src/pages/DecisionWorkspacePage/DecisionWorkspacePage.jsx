
// src/pages/DecisionWorkspacePage/DecisionWorkspacePage.jsx
import { Grid, Paper } from '@mantine/core';
import { InputPanel } from './components/InputPanel';
import { AnalysisPanel } from './components/AnalysisPanel';
// The CoachingPanel component is no longer imported or used here.

export function DecisionWorkspacePage() {
  return (
    // The grid is now a two-column layout.
    <Grid>
      {/* Left Panel: User Inputs */}
      <Grid.Col span={{ base: 12, lg: 5 }}>
        <Paper withBorder p="md" style={{ height: '100%' }}>
          <InputPanel />
        </Paper>
      </Grid.Col>

      {/* Right Panel: Visualization and Analysis */}
      <Grid.Col span={{ base: 12, lg: 7 }}>
        <Paper withBorder p="md" style={{ height: '100%' }}>
          <AnalysisPanel />
        </Paper>
      </Grid.Col>
    </Grid>
  );
}

// src/pages/DecisionWorkspacePage/DecisionWorkspacePage.jsx
import { Grid, Paper } from '@mantine/core';
import { InputPanel } from './components/InputPanel';
import AnalysisPanel from './components/AnalysisPanel'; // CORRECTIVE ACTION: Changed to a default import
import { CoachingPanel } from './components/CoachingPanel';

function DecisionWorkspacePage() {
  return (
    <Grid>
      {/* Left Panel: User Inputs */}
      <Grid.Col span={{ base: 12, lg: 4 }}>
        <Paper withBorder p="md" style={{ height: '100%' }}>
          <InputPanel />
        </Paper>
      </Grid.Col>

      {/* Center Panel: Visualization and Analysis */}
      <Grid.Col span={{ base: 12, lg: 5 }}>
        <Paper withBorder p="md" style={{ height: '100%' }}>
          <AnalysisPanel />
        </Paper>
      </Grid.Col>

      {/* Right Panel: AI Coaching */}
      <Grid.Col span={{ base: 12, lg: 3 }}>
        <Paper withBorder p="md" style={{ height: '100%' }}>
          <CoachingPanel />
        </Paper>
      </Grid.Col>
    </Grid>
  );
}

export default DecisionWorkspacePage;
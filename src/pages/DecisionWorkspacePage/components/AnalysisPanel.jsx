
// src/pages/DecisionWorkspacePage/components/AnalysisPanel.jsx
import { Stack, Title, Text, Paper } from '@mantine/core';
import { useDecisionStore } from '../../../store/decisionStore';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend
);

// CORRECTIVE ACTION: Removed 'export' from this line
function AnalysisPanel() {
  const { expectedValue, assumptions } = useDecisionStore();

  const chartData = {
    labels: assumptions.map(a => a.scenario),
    datasets: [
      {
        label: 'Outcome ($)',
        data: assumptions.map(a => a.outcome),
        backgroundColor: assumptions.map(a => 
          a.scenario === 'Best Case' ? 'rgba(75, 192, 192, 0.6)' :
          a.scenario === 'Worst Case' ? 'rgba(255, 99, 132, 0.6)' :
          'rgba(54, 162, 235, 0.6)'
        ),
        borderColor: assumptions.map(a => 
          a.scenario === 'Best Case' ? 'rgb(75, 192, 192)' :
          a.scenario === 'Worst Case' ? 'rgb(255, 99, 132)' :
          'rgb(54, 162, 235)'
        ),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Scenario Outcomes',
      },
    },
    scales: {
        y: {
            ticks: {
                callback: function(value) {
                    return '$' + value;
                }
            }
        }
    }
  };

  return (
    <Stack>
      <Title order={3}>3. Analyze</Title>
      <Paper withBorder p="xl" radius="md">
        <Stack align="center">
          <Text c="dimmed" size="sm">Calculated Expected Value (EV)</Text>
          <Title order={1}>${expectedValue.toFixed(2)}</Title>
        </Stack>
      </Paper>
      
      <Title order={4} mt="md">Risk / Reward Profile</Title>
      <Paper withBorder style={{ height: 300 }} p="md">
        <Bar options={chartOptions} data={chartData} />
      </Paper>
    </Stack>
  );
}

export default AnalysisPanel;
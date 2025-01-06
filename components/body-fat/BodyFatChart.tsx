import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getData } from '../../utils/storage'; 

interface BodyFatChartProps {
  title: string;
  yAxisSuffix?: string;
}

const BodyFatChart: React.FC<BodyFatChartProps> = ({ title, yAxisSuffix = '%' }) => {
  const [chartData, setChartData] = useState<{ labels: string[]; datasets: { data: number[] }[] }>({
    labels: [],
    datasets: [{ data: [] }],
  });

  // fetch body fat history data on component mount
  useEffect(() => {
    const fetchHistory = async () => {
      const history = (await getData('bodyFatHistory')) || [];
      if (history.length > 0) {
        const labels = history.map((entry: any) => entry.date); // herr i execut dates
        const data = history.map((entry: any) => entry.bodyFat); // execut body fat values

        setChartData({
          labels,
          datasets: [{ data }],
        });
      }
    };

    fetchHistory();
  }, []);

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.subtitle}>{title}</Text>
      {chartData.labels.length > 0 ? (
        <LineChart
          data={chartData}
          width={350}
          height={220}
          yAxisSuffix={yAxisSuffix}
          yAxisInterval={1}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '5', 
              strokeWidth: '2',
              stroke: '#ffa726', 
            },
          }}
          bezier
          style={styles.chart}
        />
      ) : (
        <Text style={styles.noDataText}>No body fat history available.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default BodyFatChart;
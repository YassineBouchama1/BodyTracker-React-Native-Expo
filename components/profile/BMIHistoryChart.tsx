import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useProfile } from '~/context/ProfileContext';

const BMIHistoryChart = () => {
  const { getBMIHistory } = useProfile();
  const bmiHistory = getBMIHistory();

  if (bmiHistory.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>No BMI history available.</Text>
      </View>
    );
  }

  // prepare data for the chart
  const labels = bmiHistory.map((record) => {
    const date = new Date(record.date);
    return `${date.getMonth() + 1}/${date.getDate()}`; 
  });

  const data = bmiHistory.map((record) => record.bmi);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BMI History</Text>

      <View style={styles.chartContainer}>
        <Text style={styles.subtitle}>Progress Chart</Text>
        <LineChart
          data={{
            labels: labels,
            datasets: [
              {
                data: data,
              },
            ],
          }}
          width={350}
          height={220}
          yAxisSuffix=" BMI"
          yAxisInterval={1}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff', 
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, 
            labelColor: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, 
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
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>BMI Information:</Text>
        <Text style={styles.infoText}>• BMI less than 18.5: Underweight</Text>
        <Text style={styles.infoText}>• BMI 18.5–24.9: Healthy weight</Text>
        <Text style={styles.infoText}>• BMI 25–29.9: Overweight</Text>
        <Text style={styles.infoText}>• BMI 30 or higher: Obesity</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
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
  },
  infoCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});

export default BMIHistoryChart;
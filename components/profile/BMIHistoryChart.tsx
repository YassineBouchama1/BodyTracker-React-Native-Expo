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

  // Prepare data for the chart
  const labels = bmiHistory.map((record) => {
    const date = new Date(record.date);
    return `${date.getMonth() + 1}/${date.getDate()}`; // Format as MM/DD
  });

  const data = bmiHistory.map((record) => record.bmi);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BMI History</Text>
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
          backgroundGradientFrom: '#6a11cb', // Gradient start color
          backgroundGradientTo: '#2575fc', // Gradient end color
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // White text
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // White labels
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '5', // Dot radius
            strokeWidth: '2',
            stroke: '#ffa726', // Dot border color
          },
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  chart: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
  },
});

export default BMIHistoryChart;
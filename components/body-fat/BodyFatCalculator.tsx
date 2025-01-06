import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { calculateBodyFat } from '../../utils/calculations';
import { storeData, getData } from '../../utils/storage';
import { BodyMeasurements } from '~/types/measurements';

interface BodyFatCalculatorProps {
  height: number; // in cm
  gender: 'male' | 'female';
}

export default function BodyFatCalculator({ height, gender }: BodyFatCalculatorProps) {
  const [measurements, setMeasurements] = useState<BodyMeasurements>({
    neckCircumference: 0,
    waistCircumference: 0,
    hipCircumference: gender === 'female' ? 0 : undefined,
    date: new Date(),
  });

  const [latestBodyFat, setLatestBodyFat] = useState<number | null>(null);

  const handleMeasurementChange = (key: keyof BodyMeasurements, value: string) => {
    setMeasurements((prev) => ({
      ...prev,
      [key]: parseFloat(value) || 0,
    }));
  };

  const calculateAndSave = async () => {
    const bodyFat = calculateBodyFat(measurements, gender, height);
    const newEntry = {
      date: new Date().toISOString().split('T')[0],
      bodyFat: Number(bodyFat.toFixed(1)),
    };

    // load existing history and append new entry
    const existingHistory = (await getData('bodyFatHistory')) || [];
    const updatedHistory = [...existingHistory, newEntry];
    await storeData('bodyFatHistory', updatedHistory);

    // set the latest body fat value to display
    setLatestBodyFat(newEntry.bodyFat);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Body Fat Calculator (US Navy Method)</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Neck Circumference (cm)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={measurements.neckCircumference.toString()}
          onChangeText={(value) => handleMeasurementChange('neckCircumference', value)}
          placeholder="Enter neck circumference"
        />

        <Text style={styles.label}>Waist Circumference (cm)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={measurements.waistCircumference.toString()}
          onChangeText={(value) => handleMeasurementChange('waistCircumference', value)}
          placeholder="Enter waist circumference"
        />

        {gender === 'female' && (
          <>
            <Text style={styles.label}>Hip Circumference (cm)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={measurements.hipCircumference?.toString()}
              onChangeText={(value) => handleMeasurementChange('hipCircumference', value)}
              placeholder="Enter hip circumference"
            />
          </>
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={calculateAndSave}>
        <Text style={styles.buttonText}>Calculate Body Fat</Text>
      </TouchableOpacity>

      {latestBodyFat !== null && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Your Body Fat Percentage:</Text>
          <Text style={styles.resultValue}>{latestBodyFat}%</Text>
        </View>
      )}

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Measurement Tips:</Text>
        <Text style={styles.infoText}>• Measure neck circumference below the larynx (Adam's apple)</Text>
        <Text style={styles.infoText}>• Measure waist at naval level</Text>
        {gender === 'female' && (
          <Text style={styles.infoText}>• Measure hips at the widest point</Text>
        )}
        <Text style={styles.infoText}>• Keep the measuring tape parallel to the floor</Text>
        <Text style={styles.infoText}>• Take measurements in the morning before eating</Text>
      </View>
    </View>
  );
}

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
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resultText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  resultValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
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
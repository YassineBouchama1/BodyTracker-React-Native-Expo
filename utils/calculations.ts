import { BodyMeasurements } from "~/types/measurements";

export const calculateBMI = (weight: number, height: number): number => {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  };
  


  // calculate fat values
  export const calculateBodyFat = (
    measurements: BodyMeasurements,
    gender: 'male' | 'female',
    height: number
  ): number => {
    if (gender === 'male') {
      const { neckCircumference, waistCircumference } = measurements;
      // US Navy Method for men
      return 86.010 * Math.log10(waistCircumference - neckCircumference) - 
             70.041 * Math.log10(height) + 36.76;
    } else {
      const { neckCircumference, waistCircumference, hipCircumference } = measurements;
      // US Navy Method for women
      return 163.205 * Math.log10(waistCircumference + hipCircumference! - neckCircumference) -
             97.684 * Math.log10(height) - 78.387;
    }
  };



  // get the values category of the measurements
  export const getBodyFatCategory = (bodyFat: number, gender: 'male' | 'female'): string => {
    if (gender === 'male') {
      if (bodyFat < 6) return 'Essential Fat';
      if (bodyFat < 14) return 'Athletes';
      if (bodyFat < 18) return 'Fitness';
      if (bodyFat < 25) return 'Average';
      return 'Above Average';
    } else {
      if (bodyFat < 14) return 'Essential Fat';
      if (bodyFat < 21) return 'Athletes';
      if (bodyFat < 25) return 'Fitness';
      if (bodyFat < 32) return 'Average';
      return 'Above Average';
    }
  };
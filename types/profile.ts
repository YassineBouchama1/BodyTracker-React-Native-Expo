export interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    nationality: string;
    weight: number;
    height: number;
    address: string;
    gender: 'male' | 'female';
    // neckCircumference: number; 
    // waistCircumference: number; 
    // hipCircumference?: number; 
    bmiHistory: BMIRecord[];
    createdAt: string;
    updatedAt: string;
  }


 export interface BMIRecord {
    date: string;
    weight: number;
    height: number;
    bmi: number;
  }
  
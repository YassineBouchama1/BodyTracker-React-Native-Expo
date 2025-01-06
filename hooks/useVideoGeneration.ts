import { useState } from 'react';

const useVideoGeneration = () => {
  const [loadingWeeks, setLoadingWeeks] = useState<{ [key: string]: boolean }>({});

  const generateVideoForWeek = async (weekStart: string) => {
    setLoadingWeeks((prev) => ({ ...prev, [weekStart]: true })); 

   
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setLoadingWeeks((prev) => ({ ...prev, [weekStart]: false })); 
    alert(`Video for week ${weekStart} generated successfully!`);
  };

  return {
    loadingWeeks,
    generateVideoForWeek,
  };
};

export default useVideoGeneration;
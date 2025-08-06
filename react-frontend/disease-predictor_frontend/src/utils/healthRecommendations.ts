import { DiseaseType, WeeklyPlan } from '../types/disease';

export const getHealthRecommendations = (diseaseType: DiseaseType, prediction: number): WeeklyPlan => {
  const baseRecommendations = {
    sleepHours: '7-8 hours per night',
    foodRecommendations: ['Drink plenty of water', 'Eat regular meals'],
    workoutTips: ['Take a 30-minute walk daily', 'Practice deep breathing exercises'],
  };

  switch (diseaseType) {
    case 'diabetes':
      return prediction === 1 ? {
        sleepHours: '7-8 hours per night',
        foodRecommendations: [
          'Choose complex carbohydrates (whole grains, oats)',
          'Include lean proteins (chicken, fish, legumes)',
          'Eat plenty of vegetables and fruits',
          'Limit processed foods and sugary drinks',
          'Monitor portion sizes'
        ],
        workoutTips: [
          'Walk for 30-45 minutes daily',
          'Try resistance training 2-3 times per week',
          'Monitor blood sugar before and after exercise',
          'Stay hydrated during workouts'
        ]
      } : {
        ...baseRecommendations,
        foodRecommendations: [...baseRecommendations.foodRecommendations, 'Maintain balanced nutrition'],
        workoutTips: [...baseRecommendations.workoutTips, 'Continue regular physical activity']
      };

    case 'heart':
      return prediction === 1 ? {
        sleepHours: '7-9 hours per night',
        foodRecommendations: [
          'Follow a Mediterranean diet',
          'Reduce sodium intake',
          'Include omega-3 rich foods (salmon, walnuts)',
          'Limit saturated and trans fats',
          'Eat plenty of fruits and vegetables'
        ],
        workoutTips: [
          'Start with 15-20 minutes of cardio daily',
          'Practice yoga or meditation',
          'Avoid high-intensity exercise initially',
          'Consult doctor before starting new routines'
        ]
      } : {
        ...baseRecommendations,
        foodRecommendations: [...baseRecommendations.foodRecommendations, 'Include heart-healthy foods like nuts and fish'],
        workoutTips: [...baseRecommendations.workoutTips, 'Include cardio exercises 3-4 times per week']
      };

    case 'stroke':
      return prediction === 1 ? {
        sleepHours: '8-9 hours per night',
        foodRecommendations: [
          'Follow DASH diet principles',
          'Reduce sodium significantly',
          'Include potassium-rich foods (bananas, spinach)',
          'Limit alcohol consumption',
          'Choose whole grains over refined ones'
        ],
        workoutTips: [
          'Start with gentle stretching exercises',
          'Take short walks multiple times a day',
          'Practice balance exercises',
          'Consider physical therapy consultation'
        ]
      } : {
        ...baseRecommendations,
        foodRecommendations: [...baseRecommendations.foodRecommendations, 'Monitor blood pressure through diet'],
        workoutTips: [...baseRecommendations.workoutTips, 'Include activities that improve balance']
      };

    case 'parkinsons':
      return prediction === 1 ? {
        sleepHours: '8-9 hours per night with good sleep hygiene',
        foodRecommendations: [
          'Include antioxidant-rich foods (berries, leafy greens)',
          'Add turmeric and green tea to diet',
          'Ensure adequate protein intake',
          'Consider smaller, frequent meals',
          'Stay well hydrated'
        ],
        workoutTips: [
          'Practice tai chi or yoga',
          'Include balance and coordination exercises',
          'Try dancing or rhythmic activities',
          'Focus on flexibility and stretching',
          'Consider physical therapy'
        ]
      } : {
        ...baseRecommendations,
        foodRecommendations: [...baseRecommendations.foodRecommendations, 'Include brain-healthy foods like nuts and berries'],
        workoutTips: [...baseRecommendations.workoutTips, 'Include coordination and balance activities']
      };

    default:
      return baseRecommendations;
  }
};
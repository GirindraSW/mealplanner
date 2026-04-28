export type Meal = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

export type MealPlan = {
  days: Array<{
    day: string;
    meals: {
      breakfast: Meal;
      lunch: Meal;
      dinner: Meal;
      snacks: Meal[];
    };
  }>;
  groceryList: Array<{ category: string; items: string[] }>;
  nutritionSummary: { calories: number; protein: number; carbs: number; fats: number };
};

export type SavedPlan = {
  id: string;
  created_at: string;
  goals: string;
  allergies: string[];
  preferences: string[];
  plan: MealPlan;
  checked_items: string[];
};

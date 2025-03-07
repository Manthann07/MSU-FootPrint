import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const GroceryList = ({ mealIds }) => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIngredients = async () => {
      setLoading(true);
      setError(null);

      try {
        const allIngredients = [];
        for (const mealId of mealIds) {
          const response = await fetch(
            `https://api.spoonacular.com/recipes/${mealId}/ingredientWidget.json?apiKey=${import.meta.env.VITE_MEAL_PLANNER_API_KEY}`
          );
          if (!response.ok) {
            throw new Error(`Failed to fetch ingredients for meal ${mealId}: ${response.statusText}`);
          }
          const data = await response.json();
          allIngredients.push(...data.ingredients);
        }
        setIngredients(allIngredients);
      } catch (err) {
        console.error('Error fetching ingredients:', err);
        setError('Failed to fetch ingredients. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (mealIds.length > 0) {
      fetchIngredients();
    }
  }, [mealIds]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading grocery list...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-start">
        <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
        <p className="text-red-700 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-green-200 p-6 shadow-md">
      <h3 className="font-bold text-xl text-green-800 mb-4">Grocery List</h3>
      <ul className="space-y-2">
        {ingredients.map((ingredient, index) => (
          <li key={index} className="flex items-center text-gray-700">
            <span className="mr-2">•</span>
            <span>
              {ingredient.amount.metric.value} {ingredient.amount.metric.unit} {ingredient.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroceryList;
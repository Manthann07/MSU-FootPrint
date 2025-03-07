import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Utensils, Coffee, Pizza, AlertCircle, Loader2, Sun, Sunset, Moon, ChevronDown, ChevronUp, Info, Leaf, Droplet, Flame, ArrowLeft } from 'lucide-react';
import { useMealPlan } from '../context/MealPlanContext';

const MealPlanner = () => {
  const { mealPlanData, updateMealPlan } = useMealPlan();
  const [formData, setFormData] = useState({
    targetCalories: 2000,
    diet: '',
    exclude: '',
  });
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedMeal, setExpandedMeal] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [expandedNutrient, setExpandedNutrient] = useState(null);

  // Initialize form with existing meal plan data if available
  useEffect(() => {
    if (mealPlanData) {
      setMealPlan(mealPlanData);
      // Update form data based on mealPlanData if needed
      if (mealPlanData.nutrients && mealPlanData.nutrients.calories) {
        setFormData(prevFormData => ({
          ...prevFormData,
          targetCalories: mealPlanData.nutrients.calories,
        }));
      }
    }
  }, [mealPlanData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const fetchMealPlan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Construct the API URL with query parameters
      const apiUrl = "https://api.spoonacular.com/mealplanner/generate";
      const queryParams = new URLSearchParams({
        timeFrame: 'day', // Generate a daily meal plan
        targetCalories: formData.targetCalories,
        diet: formData.diet,
        exclude: formData.exclude,
        apiKey: import.meta.env.VITE_MEAL_PLANNER_API_KEY, // Use your API key from the environment variable
      });

      // Make the API call
      const response = await fetch(`${apiUrl}?${queryParams}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch meal plan: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("API Response:", data); // For debugging

      // Manually assign meal types based on array position
      // The API typically returns meals in order: breakfast, lunch, dinner
      const mealTypes = ['breakfast', 'lunch', 'dinner'];
      
      // Ensure we have three meals with proper types
      const formattedMeals = data.meals.map((meal, index) => {
        // Use the index to determine meal type (0=breakfast, 1=lunch, 2=dinner)
        // If there are more than 3 meals, cycle through the types
        const mealType = mealTypes[index % mealTypes.length];
        
        return {
          id: meal.id,
          title: meal.title,
          readyInMinutes: meal.readyInMinutes,
          servings: meal.servings,
          sourceUrl: meal.sourceUrl,
          imageType: 'jpg', // Spoonacular images are typically in JPG format
          mealType: mealType, // Assign the meal type based on index
        };
      });

      console.log("Formatted meals with assigned types:", formattedMeals);

      const formattedNutrients = {
        calories: data.nutrients.calories,
        protein: data.nutrients.protein,
        fat: data.nutrients.fat,
        carbohydrates: data.nutrients.carbohydrates,
        fiber: data.nutrients.fiber || 0, // Added fallback in case API doesn't return fiber
        sugar: data.nutrients.sugar || 0, // Added fallback in case API doesn't return sugar
      };

      // Organize meals by type (breakfast, lunch, dinner)
      const organizedMeals = {
        breakfast: formattedMeals.filter((meal) => meal.mealType === 'breakfast'),
        lunch: formattedMeals.filter((meal) => meal.mealType === 'lunch'),
        dinner: formattedMeals.filter((meal) => meal.mealType === 'dinner'),
        nutrients: {
          ...formattedNutrients,
          detailedNutrients: [
            {
              name: "Protein",
              amount: formattedNutrients.protein,
              unit: "g",
              percentOfDailyNeeds: (formattedNutrients.protein / 50) * 100, // Assuming 50g daily need
              description: "Essential for muscle building and repair",
              icon: <Droplet className="h-5 w-5" />,
              color: "from-blue-50 to-blue-100",
              textColor: "text-blue-800",
              borderColor: "border-blue-300",
            },
            {
              name: "Fat",
              amount: formattedNutrients.fat,
              unit: "g",
              percentOfDailyNeeds: (formattedNutrients.fat / 65) * 100, // Assuming 65g daily need
              description: "Provides energy and supports cell growth",
              icon: <Flame className="h-5 w-5" />,
              color: "from-yellow-50 to-yellow-100",
              textColor: "text-yellow-800",
              borderColor: "border-yellow-300",
            },
            {
              name: "Carbohydrates",
              amount: formattedNutrients.carbohydrates,
              unit: "g",
              percentOfDailyNeeds: (formattedNutrients.carbohydrates / 300) * 100, // Assuming 300g daily need
              description: "Main source of energy for the body",
              icon: <Leaf className="h-5 w-5" />,
              color: "from-green-50 to-green-100",
              textColor: "text-green-800",
              borderColor: "border-green-300",
            },
            {
              name: "Calories",
              amount: formattedNutrients.calories,
              unit: "kcal",
              percentOfDailyNeeds: (formattedNutrients.calories / 2000) * 100, // Assuming 2000 kcal daily need
              description: "Total energy provided by the meal plan",
              icon: <Flame className="h-5 w-5" />,
              color: "from-red-50 to-red-100",
              textColor: "text-red-800",
              borderColor: "border-red-300",
            },
            {
              name: "Fiber",
              amount: formattedNutrients.fiber,
              unit: "g",
              percentOfDailyNeeds: (formattedNutrients.fiber / 25) * 100, // Assuming 25g daily need
              description: "Aids digestion and helps maintain bowel health",
              icon: <Leaf className="h-5 w-5" />,
              color: "from-green-50 to-green-100",
              textColor: "text-green-800",
              borderColor: "border-green-300",
            },
            {
              name: "Sugar",
              amount: formattedNutrients.sugar,
              unit: "g",
              percentOfDailyNeeds: (formattedNutrients.sugar / 30) * 100, // Assuming 30g daily need
              description: "Natural and added sugars in the meal plan",
              icon: <Droplet className="h-5 w-5" />,
              color: "from-purple-50 to-purple-100",
              textColor: "text-purple-800",
              borderColor: "border-purple-300",
            },
          ],
        },
      };

      console.log("Organized Meals:", organizedMeals); // For debugging

      // Update state with the new meal plan
      setMealPlan(organizedMeals);
      updateMealPlan(organizedMeals); // Update the context with the new meal plan
      setActiveTab('all'); // Reset to show all meals
      setExpandedMeal(null); // Reset expanded state
    } catch (err) {
      console.error('Error fetching meal plan:', err);
      setError('Failed to fetch meal plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMealExpand = (mealType) => {
    if (expandedMeal === mealType) {
      setExpandedMeal(null);
    } else {
      setExpandedMeal(mealType);
    }
  };

  const toggleNutrientExpand = (nutrientName) => {
    if (expandedNutrient === nutrientName) {
      setExpandedNutrient(null);
    } else {
      setExpandedNutrient(nutrientName);
    }
  };

  const MealCard = ({ meal, type }) => {
    const [showDetails, setShowDetails] = useState(false);

    const icons = {
      breakfast: <Coffee className="h-6 w-6" />,
      lunch: <Pizza className="h-6 w-6" />,
      dinner: <Utensils className="h-6 w-6" />,
    };

    const typeColors = {
      breakfast: {
        bg: 'bg-gradient-to-br from-green-50 to-green-100',
        border: 'border-green-200',
        text: 'text-green-800',
        icon: 'text-green-600',
        button: 'bg-green-600 hover:bg-green-700',
      },
      lunch: {
        bg: 'bg-gradient-to-br from-green-100 to-green-200',
        border: 'border-green-300',
        text: 'text-green-800',
        icon: 'text-green-600',
        button: 'bg-green-600 hover:bg-green-700',
      },
      dinner: {
        bg: 'bg-gradient-to-br from-green-50 to-green-100',
        border: 'border-green-200',
        text: 'text-green-800',
        icon: 'text-green-600',
        button: 'bg-green-600 hover:bg-green-700',
      },
    };

    return (
      <div
        className={`rounded-lg border p-5 shadow-md transition-all duration-300 ${typeColors[type].bg} ${typeColors[type].border} hover:shadow-lg transform hover:-translate-y-1 meal-card`}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className={`p-2 rounded-full bg-white ${typeColors[type].icon}`}>
            {icons[type]}
          </div>
          <h3 className={`font-medium text-lg capitalize ${typeColors[type].text}`}>{type}</h3>
        </div>

        <div className="aspect-video relative rounded-md overflow-hidden mb-4 shadow-sm">
          <img
            src={`https://spoonacular.com/recipeImages/${meal.id}-556x370.${meal.imageType}`}
            alt={meal.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={(e) => {
              // Fallback image if the original fails to load
              e.target.src = "https://via.placeholder.com/556x370?text=Recipe+Image";
            }}
          />
        </div>

        <h4 className="font-bold text-gray-800 mb-3 text-xl">{meal.title}</h4>

        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {meal.readyInMinutes} mins
          </span>
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {meal.servings} servings
          </span>
        </div>

        <div className="flex flex-col space-y-3">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm font-medium text-gray-700 flex items-center justify-center"
          >
            {showDetails ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Hide Details
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Show Details
              </>
            )}
          </button>

          {showDetails && (
            <div className="mt-2 p-3 bg-white bg-opacity-70 rounded-md">
              <p className="text-sm text-gray-700 mb-2">
                This {type} recipe is ready in just {meal.readyInMinutes} minutes and serves {meal.servings} people.
              </p>
              <p className="text-sm text-gray-700">
                Perfect for a {type === 'breakfast' ? 'morning boost' : type === 'lunch' ? 'midday meal' : 'evening dinner'}.
              </p>
            </div>
          )}

          <a
            href={meal.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-2 text-sm font-medium text-white py-2 px-4 rounded-md transition duration-150 ease-in-out text-center ${typeColors[type].button}`}
          >
            View Full Recipe
          </a>
        </div>
      </div>
    );
  };

  const NutritionSummary = ({ nutrients }) => {
    const [showInfo, setShowInfo] = useState(false);

    return (
      <div className="bg-white rounded-lg border border-green-200 p-6 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-xl text-green-800">Daily Nutrition Summary</h3>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="text-green-600 hover:text-green-800"
          >
            <Info className="h-5 w-5" />
          </button>
        </div>

        {showInfo && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md text-sm text-green-800">
            <p>This summary shows the total nutritional content of your daily meal plan. The values are based on the combined nutrients from all meals.</p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="rounded-lg p-4 border shadow-sm bg-gradient-to-r from-green-50 to-green-100 border-green-200 transition-transform duration-300 hover:scale-105">
            <div className="flex items-center mb-2">
              <Flame className="h-5 w-5 text-green-600" />
              <p className="text-sm font-medium ml-2 text-green-800">Calories</p>
            </div>
            <p className="text-2xl font-bold text-green-800">
              {nutrients.calories.toFixed(0)} <span className="text-sm">kcal</span>
            </p>
          </div>

          <div className="rounded-lg p-4 border shadow-sm bg-gradient-to-r from-green-50 to-green-100 border-green-200 transition-transform duration-300 hover:scale-105">
            <div className="flex items-center mb-2">
              <Droplet className="h-5 w-5 text-green-600" />
              <p className="text-sm font-medium ml-2 text-green-800">Protein</p>
            </div>
            <p className="text-2xl font-bold text-green-800">
              {nutrients.protein.toFixed(1)} <span className="text-sm">g</span>
            </p>
          </div>

          <div className="rounded-lg p-4 border shadow-sm bg-gradient-to-r from-green-50 to-green-100 border-green-200 transition-transform duration-300 hover:scale-105">
            <div className="flex items-center mb-2">
              <Flame className="h-5 w-5 text-green-600" />
              <p className="text-sm font-medium ml-2 text-green-800">Fat</p>
            </div>
            <p className="text-2xl font-bold text-green-800">
              {nutrients.fat.toFixed(1)} <span className="text-sm">g</span>
            </p>
          </div>

          <div className="rounded-lg p-4 border shadow-sm bg-gradient-to-r from-green-50 to-green-100 border-green-200 transition-transform duration-300 hover:scale-105">
            <div className="flex items-center mb-2">
              <Leaf className="h-5 w-5 text-green-600" />
              <p className="text-sm font-medium ml-2 text-green-800">Carbs</p>
            </div>
            <p className="text-2xl font-bold text-green-800">
              {nutrients.carbohydrates.toFixed(1)} <span className="text-sm">g</span>
            </p>
          </div>
        </div>

        <h4 className="font-semibold text-lg text-green-800 mb-3">Detailed Nutrition Breakdown</h4>

        <div className="space-y-3">
          {nutrients.detailedNutrients.map((nutrient) => (
            <div
              key={nutrient.name}
              className={`border ${nutrient.borderColor} rounded-lg overflow-hidden bg-gradient-to-r ${nutrient.color}`}
            >
              <button
                onClick={() => toggleNutrientExpand(nutrient.name)}
                className="w-full p-3 flex items-center justify-between text-left"
              >
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-white mr-2 text-green-600">
                    {nutrient.icon}
                  </div>
                  <div>
                    <h5 className={`font-medium ${nutrient.textColor}`}>{nutrient.name}</h5>
                    <div className="flex items-center">
                      <span className={`text-sm ${nutrient.textColor}`}>
                        {nutrient.amount.toFixed(1)} {nutrient.unit}
                      </span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className={`text-xs ${nutrient.textColor}`}>
                        {nutrient.percentOfDailyNeeds.toFixed(0)}% of daily needs
                      </span>
                    </div>
                  </div>
                </div>
                {expandedNutrient === nutrient.name ? (
                  <ChevronUp className={`h-5 w-5 ${nutrient.textColor}`} />
                ) : (
                  <ChevronDown className={`h-5 w-5 ${nutrient.textColor}`} />
                )}
              </button>

              {expandedNutrient === nutrient.name && (
                <div className="p-3 bg-white border-t border-gray-100">
                  <p className="text-sm text-gray-700">{nutrient.description}</p>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-600 h-2.5 rounded-full"
                        style={{ width: `${Math.min(nutrient.percentOfDailyNeeds, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const MealTimeSection = ({ title, icon, meals, type }) => {
    const isExpanded = expandedMeal === type;

    return (
      <div className={`bg-white rounded-lg border border-green-200 shadow-md overflow-hidden transition-all duration-300 ${isExpanded ? 'mb-6' : 'mb-4'} meal-section`}>
        <button
          onClick={() => toggleMealExpand(type)}
          className="w-full p-4 flex items-center justify-between text-left transition-colors bg-green-600 hover:bg-green-700 text-white meal-section-header"
        >
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-white mr-3 text-green-600">
              {icon}
            </div>
            <h3 className="font-bold text-lg">{title}</h3>
          </div>
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>

        <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="p-4">
            {meals && meals.length > 0 ? (
              meals.map((meal) => (
                <MealCard key={meal.id} meal={meal} type={type} />
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">No meals found for this category</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-wrapper bg-gradient-to-b from-green-50 to-white min-h-screen">
      <div className="navbar bg-green-600 text-white p-4 flex justify-between items-center">
        {/* <div className="flex items-center">
          <Leaf className="h-6 w-6 mr-2" />
           <h1 className="text-xl font-bold">GreenMeal Planner</h1>
        </div> */}
        <div className="flex space-x-4">
          <Link to="/imagerecognition" className="inline-flex items-center px-4 py-2 border border-green-300 text-sm font-medium rounded-md shadow-sm text-green-600 bg-white  hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 transition duration-300 ml-5">
            {/* <ArrowLeft className="h-4 w-4 mr-1" /> */}
            Image Recognization
          </Link>
        </div>
      </div>

      <div className="dashboard-container max-w-6xl mx-auto px-4 py-8">
        <header className="mb-10 text-center w-full">
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-3 relative inline-block">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-800">
              Nutrition Planner
            </span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Plan your daily meals based on your nutritional goals and dietary preferences.
          </p>
        </header>

        <div className="max-w-3xl mx-auto bg-white rounded-xl border border-green-200 p-6 shadow-lg mb-10 w-full">
          <h2 className="text-2xl font-bold mb-6 text-green-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Generate Your Meal Plan
          </h2>

          <form onSubmit={fetchMealPlan} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label htmlFor="targetCalories" className="block text-sm font-medium text-gray-700">
                  Target Calories
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="targetCalories"
                    name="targetCalories"
                    value={formData.targetCalories}
                    onChange={handleChange}
                    min="1000"
                    max="4000"
                    className="w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-3 border pl-10"
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Flame className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="diet" className="block text-sm font-medium text-gray-700">
                  Diet Type (Optional)
                </label>
                <div className="relative">
                  <select
                    id="diet"
                    name="diet"
                    value={formData.diet}
                    onChange={handleChange}
                    className="w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-3 border pl-10 appearance-none"
                  >
                    <option value="">No Restrictions</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="gluten-free">Gluten Free</option>
                    <option value="ketogenic">Ketogenic</option>
                    <option value="paleo">Paleo</option>
                  </select>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Leaf className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="exclude" className="block text-sm font-medium text-gray-700">
                  Exclude Ingredients (Optional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="exclude"
                    name="exclude"
                    value={formData.exclude}
                    onChange={handleChange}
                    placeholder="e.g., shellfish, olives"
                    className="w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-3 border pl-10"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Meal Plan'
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>

        {mealPlan && (
          <div className="meal-plan-results space-y-8">
            <div className="tabs flex space-x-2 mb-6 overflow-x-auto pb-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                  activeTab === 'all'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-green-700 hover:bg-green-50'
                } border border-green-200`}
              >
                All Meals
              </button>
              <button
                onClick={() => setActiveTab('breakfast')}
                className={`px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center ${
                  activeTab === 'breakfast'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-green-700 hover:bg-green-50'
                } border border-green-200`}
              >
                <Sun className="h-4 w-4 mr-1" />
                Breakfast
              </button>
              <button
                onClick={() => setActiveTab('lunch')}
                className={`px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center ${
                  activeTab === 'lunch'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-green-700 hover:bg-green-50'
                } border border-green-200`}
              >
                <Sunset className="h-4 w-4 mr-1" />
                Lunch
              </button>
              <button
                onClick={() => setActiveTab('dinner')}
                className={`px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center ${
                  activeTab === 'dinner'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-green-700 hover:bg-green-50'
                } border border-green-200`}
              >
                <Moon className="h-4 w-4 mr-1" />
                Dinner
              </button>
              <button
                onClick={() => setActiveTab('nutrition')}
                className={`px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center ${
                  activeTab === 'nutrition'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-green-700 hover:bg-green-50'
                } border border-green-200`}
              >
                <Info className="h-4 w-4 mr-1" />
                Nutrition
              </button>
            </div>

            {(activeTab === 'all' || activeTab === 'nutrition') && (
              <NutritionSummary nutrients={mealPlan.nutrients} />
            )}

            {(activeTab === 'all' || activeTab === 'breakfast') && (
              <MealTimeSection
                title="Breakfast"
                icon={<Sun className="h-6 w-6" />}
                meals={mealPlan.breakfast}
                type="breakfast"
              />
            )}

            {(activeTab === 'all' || activeTab === 'lunch') && (
              <MealTimeSection
                title="Lunch"
                icon={<Sunset className="h-6 w-6" />}
                meals={mealPlan.lunch}
                type="lunch"
              />
            )}

            {(activeTab === 'all' || activeTab === 'dinner') && (
              <MealTimeSection
                title="Dinner"
                icon={<Moon className="h-6 w-6" />}
                meals={mealPlan.dinner}
                type="dinner"
              />
            )}
          </div>
        )}
      </div>

      <footer className="bg-green-800 text-white p-6 mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <Leaf className="h-6 w-6 mr-2" />
                <h2 className="text-xl font-bold">GreenMeal Planner</h2>
              </div>
              <p className="text-green-200 mt-2">Eat better. Feel better. Live better.</p>
            </div>

            <div className="flex flex-col items-center md:items-end">
              <p className="text-green-200 text-sm">© {new Date().getFullYear()} GreenMeal. All rights reserved.</p>
              <p className="text-green-200 text-sm mt-1">Recipe data provided by Spoonacular API</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MealPlanner;

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import './ImageRecognition.css';

const ImageRecognition = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const [animation, setAnimation] = useState(false);
  
  const CLIENT_ID = import.meta.env.VITE_FATSECRET_CLIENT_ID || 'default_client_id';
  const CLIENT_SECRET = import.meta.env.VITE_FATSECRET_CLIENT_SECRET || 'default_client_secret';
  
  useEffect(() => {
    // Reset animation state when a new image is selected
    if (selectedImage) {
      setAnimation(true);
    }
  }, [selectedImage]);

  // Debugging: Log environment variables
  useEffect(() => {
    console.log('Client ID:', CLIENT_ID);
    console.log('Client Secret:', CLIENT_SECRET);
  }, []);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Reset states
    setError('');
    setResults(null);
    setSelectedImage(file);
    
    // Create preview URL
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  };
  
  const handleTakePhoto = () => {
    fileInputRef.current.click();
  };
  
  const analyzeImage = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }
  
    setLoading(true);
    setError('');
  
    // Create form data
    const formData = new FormData();
    formData.append('image', selectedImage);
  
    try {
      // Log the form data for debugging
      console.log('Sending image for analysis...');
      
      // Use backend endpoint instead of direct API call
      const response = await axios.post(
        'http://localhost:5000/analyze-food',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      // Log the complete response
      console.log('API Response:', response.data);
      
      // Process the response
      setResults(response.data);
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError(err.response?.data?.message || 'Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const retryWithNewImage = () => {
    setSelectedImage(null);
    setPreviewUrl('');
    setResults(null);
    setError('');
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // Function to render food items breakdown
  const renderFoodItems = () => {
    if (!results || !results.foods || !results.foods.food) {
      return null;
    }

    return results.foods.food.map((item, index) => (
      <motion.div 
        key={index}
        className="bg-white p-4 rounded-lg shadow-sm mb-3"
        variants={itemVariants}
      >
        <h4 className="font-semibold text-blue-600 text-lg mb-2">{item.food_name}</h4>
        
        {item.food_description && (
          <p className="text-sm text-gray-600 mb-2">{item.food_description}</p>
        )}
        
        <div className="text-sm text-gray-700">
          {item.serving_description && (
            <div className="mb-1">
              <span className="font-medium">Serving: </span>
              {item.serving_description}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <span className="font-medium">Calories: </span>
              {item.food_nutrition?.calories || 0} kcal
            </div>
            <div>
              <span className="font-medium">Protein: </span>
              {item.food_nutrition?.protein || 0}g
            </div>
            <div>
              <span className="font-medium">Fat: </span>
              {item.food_nutrition?.fat || 0}g
            </div>
            <div>
              <span className="font-medium">Carbs: </span>
              {item.food_nutrition?.carbohydrate || 0}g
            </div>
            
            {item.food_nutrition?.fiber && (
              <div>
                <span className="font-medium">Fiber: </span>
                {item.food_nutrition.fiber}g
              </div>
            )}
            
            {item.food_nutrition?.sodium && (
              <div>
                <span className="font-medium">Sodium: </span>
                {item.food_nutrition.sodium}mg
              </div>
            )}
            
            {item.food_nutrition?.sugar && (
              <div>
                <span className="font-medium">Sugar: </span>
                {item.food_nutrition.sugar}g
              </div>
            )}
            
            {item.food_nutrition?.saturated_fat && (
              <div>
                <span className="font-medium">Saturated Fat: </span>
                {item.food_nutrition.saturated_fat}g
              </div>
            )}
          </div>
        </div>
      </motion.div>
    ));
  };

  // Function to render total nutritional information
  const renderTotalNutrition = () => {
    if (!results || !results.foods) {
      return null;
    }

    // Calculate totals if multiple food items
    let totalCalories = 0;
    let totalProtein = 0;
    let totalFat = 0;
    let totalCarbs = 0;

    if (results.foods.food && results.foods.food.length > 0) {
      results.foods.food.forEach(item => {
        totalCalories += parseFloat(item.food_nutrition?.calories || 0);
        totalProtein += parseFloat(item.food_nutrition?.protein || 0);
        totalFat += parseFloat(item.food_nutrition?.fat || 0);
        totalCarbs += parseFloat(item.food_nutrition?.carbohydrate || 0);
      });
    }

    return (
      <motion.div 
        className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4"
        variants={itemVariants}
      >
        <h4 className="font-medium text-gray-800 mb-3">Total Nutritional Values</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Calories</span>
            <span className="font-bold text-gray-800">{totalCalories.toFixed(1)} kcal</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Proteins</span>
            <span className="font-bold text-gray-800">{totalProtein.toFixed(1)}g</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Carbs</span>
            <span className="font-bold text-gray-800">{totalCarbs.toFixed(1)}g</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Fats</span>
            <span className="font-bold text-gray-800">{totalFat.toFixed(1)}g</span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4">
      <motion.div 
        className="max-w-lg mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-6">
          <motion.h2 
            className="text-2xl font-bold text-green-700 mb-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Food Image Recognition
          </motion.h2>
          
          <div className="text-center mb-8">
            <motion.p 
              className="text-gray-600 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Take a photo of your food to get instant nutrition information
            </motion.p>
          </div>
          
          {/* Image upload area */}
          <motion.div 
            className="mb-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
              ref={fileInputRef}
              capture="environment"
            />
            
            {!previewUrl ? (
              <motion.div 
                className="border-2 border-dashed border-green-300 rounded-lg p-8 text-center cursor-pointer hover:bg-green-50 transition-colors"
                onClick={handleTakePhoto}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-green-600 font-medium">Tap to take a photo or select from gallery</p>
              </motion.div>
            ) : (
              <motion.div 
                className="relative rounded-lg overflow-hidden"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <img 
                  src={previewUrl} 
                  alt="Food preview" 
                  className="w-full h-64 object-cover rounded-lg"
                />
                
                {/* Animated scanning effect */}
                {animation && !results && !loading && (
                  <motion.div 
                    className="absolute inset-0 bg-green-500 opacity-30"
                    initial={{ top: "0%" }}
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ 
                      duration: 2, 
                      ease: "linear",
                      repeat: 2,
                      repeatType: "reverse"
                    }}
                    onAnimationComplete={() => setAnimation(false)}
                  />
                )}
                
                <motion.button
                  className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md"
                  onClick={retryWithNewImage}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </motion.div>
            )}
          </motion.div>
          
          {previewUrl && !results && (
            <motion.div 
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-8 rounded-md shadow-md hover:from-green-600 hover:to-green-700 transition-colors duration-200 font-medium"
                onClick={analyzeImage}
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Analyzing...
                  </div>
                ) : "Analyze Food"}
              </motion.button>
            </motion.div>
          )}
          
          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div 
                className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Results */}
          <AnimatePresence>
            {results && (
              <motion.div 
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Nutrition Information</h3>
                
                <motion.div 
                  className="space-y-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Show dish name if available */}
                  {results.foods?.food_name && (
                    <motion.div 
                      className="bg-green-50 p-4 rounded-lg border border-green-200"
                      variants={itemVariants}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800">Identified Dish:</span>
                        <span className="text-green-700 font-bold">{results.foods.food_name}</span>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Show total nutrition information */}
                  {renderTotalNutrition()}
                  
                  {/* Show individual food items */}
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-700 mb-3">Food Components</h4>
                    {renderFoodItems()}
                  </div>
                  
                  {/* Buttons */}
                  <motion.div
                    className="text-center mt-6"
                    variants={itemVariants}
                  >
                    <button 
                      className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition-colors mr-3"
                      onClick={retryWithNewImage}
                    >
                      Take New Photo
                    </button>
                    <button 
                      className="border border-green-600 text-green-600 py-2 px-6 rounded-md hover:bg-green-50 transition-colors"
                      onClick={() => {/* Add to diary functionality */}}
                    >
                      Add to Food Diary
                    </button>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ImageRecognition;
import React, { useState, useEffect } from 'react';
import { Activity, Heart, ArrowRight, ChevronDown, Info, Home, CheckCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const NutritionPlannerDetails = () => {
  const navigate = useNavigate();

  const handleMealPlanClick = () => {
    navigate('/meal-planner');
  };
  // State management
  const [userDetails, setUserDetails] = useState({
    age: '',
    gender: '',
    weight: '',
    height: '',
    activityLevel: 'moderate',
    goal: 'maintain'
  });
  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState('');
  const [animation, setAnimation] = useState(false);
  const [dailyCalories, setDailyCalories] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [backgroundBubbles, setBackgroundBubbles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate random background bubbles
  useEffect(() => {
    const bubbles = [];
    for (let i = 0; i < 20; i++) {
      bubbles.push({
        id: i,
        size: Math.random() * 100 + 50,
        position: {
          x: Math.random() * 100,
          y: Math.random() * 100
        },
        opacity: Math.random() * 0.2 + 0.05,
        animationDuration: Math.random() * 20 + 10
      });
    }
    setBackgroundBubbles(bubbles);
  }, []);

  // Handle user details submission
  const handleUserDetailsSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate loading with a delay
    setTimeout(() => {
      // Calculate BMI
      const weightKg = parseFloat(userDetails.weight);
      const heightM = parseFloat(userDetails.height) / 100;
      const calculatedBmi = (weightKg / (heightM * heightM)).toFixed(1);
      setBmi(calculatedBmi);
      
      // Determine BMI category
      if (calculatedBmi < 18.5) {
        setBmiCategory('Underweight');
      } else if (calculatedBmi >= 18.5 && calculatedBmi < 25) {
        setBmiCategory('Normal weight');
      } else if (calculatedBmi >= 25 && calculatedBmi < 30) {
        setBmiCategory('Overweight');
      } else {
        setBmiCategory('Obesity');
      }
      
      // Calculate estimated daily calories
      const age = parseInt(userDetails.age);
      const isMale = userDetails.gender === 'male';
      
      // BMR calculation using Mifflin-St Jeor Equation
      let bmr;
      if (isMale) {
        bmr = 10 * weightKg + 6.25 * parseInt(userDetails.height) - 5 * age + 5;
      } else {
        bmr = 10 * weightKg + 6.25 * parseInt(userDetails.height) - 5 * age - 161;
      }
      
      // Activity multiplier
      let activityMultiplier;
      switch (userDetails.activityLevel) {
        case 'sedentary': activityMultiplier = 1.2; break;
        case 'light': activityMultiplier = 1.375; break;
        case 'moderate': activityMultiplier = 1.55; break;
        case 'active': activityMultiplier = 1.725; break;
        case 'veryActive': activityMultiplier = 1.9; break;
        default: activityMultiplier = 1.55;
      }
      
      // Goal adjustment
      let goalMultiplier;
      switch (userDetails.goal) {
        case 'lose': goalMultiplier = 0.8; break;
        case 'maintain': goalMultiplier = 1; break;
        case 'gain': goalMultiplier = 1.15; break;
        default: goalMultiplier = 1;
      }
      
      const calculatedCalories = Math.round(bmr * activityMultiplier * goalMultiplier);
      setDailyCalories(calculatedCalories);
      
      // Show success confetti
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2500);
      
      // Trigger animation
      setAnimation(true);
      setTimeout(() => setAnimation(false), 1000);
      setIsSubmitting(false);
    }, 1200);
  };

  // Handle input changes
  const handleChange = (e) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value
    });
  };

  // Reset form
  const handleReset = () => {
    // Apply exit animation first
    setAnimation(true);
    
    setTimeout(() => {
      setBmi(null);
      setDailyCalories(null);
      setUserDetails({
        age: '',
        gender: '',
        weight: '',
        height: '',
        activityLevel: 'moderate',
        goal: 'maintain'
      });
      setAnimation(false);
    }, 300);
  };

  // Confetti component
  const Confetti = () => {
    const [particles, setParticles] = useState([]);
    
    useEffect(() => {
      const particleCount = 100;
      const newParticles = [];
      
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: -10 - Math.random() * 40,
          size: Math.random() * 8 + 2,
          color: ['#4CAF50', '#2196F3', '#FFC107', '#E91E63'][Math.floor(Math.random() * 4)],
          rotation: Math.random() * 360,
          xVelocity: Math.random() * 8 - 4,
          yVelocity: Math.random() * 10 + 10,
          delay: Math.random() * 1000
        });
      }
      
      setParticles(newParticles);
    }, []);
    
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              x: `${particle.x}vw`, 
              y: `${particle.y}vh`, 
              rotate: 0,
              opacity: 1
            }}
            animate={{ 
              y: '110vh', 
              x: `calc(${particle.x}vw + ${particle.xVelocity * 50}px)`,
              rotate: particle.rotation,
              opacity: 0
            }}
            transition={{ 
              duration: 2.5,
              delay: particle.delay / 1000,
              ease: 'easeOut'
            }}
            style={{
              position: 'absolute',
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              borderRadius: '2px'
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4 relative overflow-hidden">
      {/* Animated background bubbles */}
      <div className="absolute inset-0 overflow-hidden">
        {backgroundBubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            className="absolute rounded-full bg-blue-500"
            initial={{
              width: bubble.size,
              height: bubble.size,
              left: `${bubble.position.x}%`,
              top: `${bubble.position.y}%`,
              opacity: 0
            }}
            animate={{
              y: [0, -50, 0],
              opacity: bubble.opacity
            }}
            transition={{
              y: {
                repeat: Infinity,
                duration: bubble.animationDuration,
                ease: "easeInOut"
              },
              opacity: {
                duration: 1
              }
            }}
          />
        ))}
      </div>

      {/* Show confetti animation on success */}
      {showConfetti && <Confetti />}

      <motion.div 
        className="max-w-4xl mx-auto relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo and header */}
        <div className="text-center mb-6 relative">
          <motion.div 
            className="flex justify-center items-center mb-2"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20 
            }}
          >
            <motion.div
              animate={{
                rotate: [0, 10, 0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Activity className="text-green-500 mr-2" size={28} />
            </motion.div>
            <motion.div
              animate={{
                scale: [1, 1.1, 1, 1.1, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Heart className="text-green-500" size={24} />
            </motion.div>
          </motion.div>
          
          <motion.h1 
            className="text-3xl font-bold text-green-600"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            NutriPlan
          </motion.h1>
          
          <motion.p 
            className="text-slate-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Your personal nutrition assistant
          </motion.p>

          {/* Home Button */}
          <motion.button
            onClick={() => navigate('/Home')}
            className="absolute top-0 right-0 bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg flex items-center justify-center shadow transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Home className="h-5 w-5" />
          </motion.button>
        </div>
        
        {/* Main content */}
        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden"
          animate={{ boxShadow: animation ? "0 25px 50px -12px rgba(0, 100, 0, 0.25)" : "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            {bmi === null ? (
              /* User Details Form */
              <motion.div 
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6"
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Complete Your Profile</h2>
                <p className="text-gray-600 mb-6">We need a few details to personalize your nutrition plan</p>
                
                <form onSubmit={handleUserDetailsSubmit}>
                  <div className="space-y-4">
                    <motion.div 
                      className="grid grid-cols-2 gap-4"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div>
                        <label className="block text-gray-700 mb-2">Age</label>
                        <motion.input 
                          whileFocus={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 300, damping: 10 }}
                          type="number" 
                          name="age"
                          value={userDetails.age}
                          onChange={handleChange}
                          placeholder="Years" 
                          min="12"
                          max="120"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 mb-2">Gender</label>
                        <div className="relative">
                          <motion.select 
                            whileFocus={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300, damping: 10 }}
                            name="gender"
                            value={userDetails.gender}
                            onChange={handleChange}
                            className="appearance-none w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            required
                          >
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </motion.select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <motion.div
                              animate={{ y: [0, 3, 0] }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="grid grid-cols-2 gap-4"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div>
                        <label className="block text-gray-700 mb-2">Weight</label>
                        <div className="relative">
                          <motion.input 
                            whileFocus={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300, damping: 10 }}
                            type="number" 
                            name="weight"
                            value={userDetails.weight}
                            onChange={handleChange}
                            placeholder="kg" 
                            step="0.1"
                            min="30"
                            max="300"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 mb-2">Height</label>
                        <div className="relative">
                          <motion.input 
                            whileFocus={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300, damping: 10 }}
                            type="number" 
                            name="height"
                            value={userDetails.height}
                            onChange={handleChange}
                            placeholder="cm" 
                            min="100"
                            max="250"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className="block text-gray-700 mb-2">Activity Level</label>
                      <div className="relative">
                        <motion.select 
                          whileFocus={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 300, damping: 10 }}
                          name="activityLevel"
                          value={userDetails.activityLevel}
                          onChange={handleChange}
                          className="appearance-none w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="sedentary">Sedentary (little or no exercise)</option>
                          <option value="light">Light (exercise 1-3 days/week)</option>
                          <option value="moderate">Moderate (exercise 3-5 days/week)</option>
                          <option value="active">Active (exercise 6-7 days/week)</option>
                          <option value="veryActive">Very Active (hard exercise daily)</option>
                        </motion.select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <motion.div
                            animate={{ y: [0, 3, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                          >
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label className="block text-gray-700 mb-2">Goal</label>
                      <div className="flex space-x-2">
                        <motion.button
                          type="button"
                          onClick={() => setUserDetails({...userDetails, goal: 'lose'})}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                            userDetails.goal === 'lose' 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          Lose Weight
                        </motion.button>
                        <motion.button
                          type="button"
                          onClick={() => setUserDetails({...userDetails, goal: 'maintain'})}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                            userDetails.goal === 'maintain' 
                              ? 'bg-green-500 text-white' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          Maintain
                        </motion.button>
                        <motion.button
                          type="button"
                          onClick={() => setUserDetails({...userDetails, goal: 'gain'})}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                            userDetails.goal === 'gain' 
                              ? 'bg-orange-500 text-white' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          Gain Weight
                        </motion.button>
                      </div>
                    </motion.div>
                    
                    <motion.button 
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        delay: 0.5,
                        type: "spring",
                        stiffness: 300,
                        damping: 15
                      }}
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium shadow transition-all duration-300 flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ 
                              repeat: Infinity, 
                              duration: 1,
                              ease: "linear"
                            }}
                          >
                            <RefreshCw className="mr-2 h-5 w-5" />
                          </motion.div>
                          Calculating...
                        </>
                      ) : (
                        <>
                          Calculate Nutrition Plan
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ 
                              repeat: Infinity, 
                              duration: 1.5
                            }}
                          >
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </motion.div>
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            ) : (
              /* Results Display */
              <motion.div 
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    initial={{ x: -20 }}
                    animate={{ x: 0 }}
                    transition={{ type: "spring", stiffness: 100 }}
                  >
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Nutrition Profile</h2>
                  </motion.div>
                  
                  {/* BMI and Calorie Recommendation in Horizontal Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* BMI Section */}
                    <motion.div 
                      className={`bg-gray-50 rounded-lg p-4 ${animation ? 'animate-pulse' : ''}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      <h3 className="text-lg font-medium text-gray-800 mb-4">Body Mass Index (BMI)</h3>
                      
                      <div className="flex flex-col items-center">
                        <motion.div 
                          className="w-32 h-32 rounded-full border-4 border-gray-200 flex items-center justify-center relative mb-4"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ 
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            delay: 0.3
                          }}
                        >
                          <motion.div 
                            className={`w-24 h-24 rounded-full flex flex-col items-center justify-center text-white
                              ${bmiCategory === 'Underweight' ? 'bg-blue-500' : ''}
                              ${bmiCategory === 'Normal weight' ? 'bg-green-500' : ''}
                              ${bmiCategory === 'Overweight' ? 'bg-yellow-500' : ''}
                              ${bmiCategory === 'Obesity' ? 'bg-red-500' : ''}`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ 
                              type: "spring",
                              stiffness: 260,
                              damping: 20,
                              delay: 0.5
                            }}
                          >
                            <motion.span 
                              className="text-2xl font-bold"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.7 }}
                            >
                              {bmi}
                            </motion.span>
                            <span className="text-xs">BMI</span>
                          </motion.div>
                        </motion.div>
                        
                        <motion.div 
                          className="text-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                        >
                          <h4 className="text-md font-semibold text-gray-800 mb-1">{bmiCategory}</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            {bmiCategory === 'Underweight' && 'You may need to gain some weight for optimal health.'}
                            {bmiCategory === 'Normal weight' && 'You have a healthy weight. Maintain it with balanced nutrition.'}
                            {bmiCategory === 'Overweight' && 'You may benefit from losing some weight through diet and exercise.'}
                            {bmiCategory === 'Obesity' && 'We recommend focusing on weight reduction for better health.'}
                          </p>
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* Calorie Recommendation Section */}
                    <motion.div 
                      className="bg-gray-50 rounded-lg p-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      <h3 className="text-lg font-medium text-gray-800 mb-4">Daily Calorie Recommendation</h3>
                      
                      <div className="flex flex-col items-center">
                        <motion.div 
                          className="w-32 h-32 rounded-full border-4 border-gray-200 flex items-center justify-center bg-green-100 mb-4"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ 
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            delay: 0.5
                          }}
                        >
                          <motion.div 
                            className="text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                          >
                            <motion.span 
                              className="block text-2xl font-bold text-green-600"
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.8 }}
                            >
                              {dailyCalories}
                            </motion.span>
                            <span className="text-xs text-gray-600">calories/day</span>
                          </motion.div>
                        </motion.div>
                        
                        <motion.div 
                          className="text-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.8 }}
                        >
                          <h4 className="text-md font-semibold text-gray-800 mb-1">
                            {userDetails.goal === 'lose' && 'Weight Loss Plan'}
                            {userDetails.goal === 'maintain' && 'Weight Maintenance Plan'}
                            {userDetails.goal === 'gain' && 'Weight Gain Plan'}
                          </h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Based on your {userDetails.age} year old {userDetails.gender} profile, 
                            height of {userDetails.height}cm, weight of {userDetails.weight}kg, and 
                            {userDetails.activityLevel === 'sedentary' && ' sedentary '}
                            {userDetails.activityLevel === 'light' && ' lightly active '}
                            {userDetails.activityLevel === 'moderate' && ' moderately active '}
                            {userDetails.activityLevel === 'active' && ' very active '}
                            {userDetails.activityLevel === 'veryActive' && ' extremely active '}
                            lifestyle.
                          </p>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Nutrition Tips */}
                  <motion.div 
                    className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Personalized Tips</h3>
                    <motion.ul 
                      className="space-y-2 text-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      {bmiCategory === 'Underweight' && (
                        <>
                          <motion.li 
                            className="flex items-start"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 }}
                          >
                            <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>Focus on nutrient-dense foods that provide healthy calories</span>
                          </motion.li>
                          <motion.li 
                            className="flex items-start"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.9 }}
                          >
                            <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>Include protein with each meal to support muscle growth</span>
                          </motion.li>
                          <motion.li 
                            className="flex items-start"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1 }}
                          >
                            <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>Consider strength training to build muscle mass</span>
                          </motion.li>
                        </>
                      )}
                      {bmiCategory === 'Normal weight' && (
                        <>
                          <motion.li 
                            className="flex items-start"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 }}
                          >
                            <Info className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>Maintain a balanced diet with plenty of fruits and vegetables</span>
                          </motion.li>
                          <motion.li 
                            className="flex items-start"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.9 }}
                          >
                            <Info className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>Stay hydrated by drinking 8-10 glasses of water daily</span>
                          </motion.li>
                          <motion.li 
                            className="flex items-start"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1 }}
                          >
                            <Info className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>Mix cardio and strength training for optimal fitness</span>
                          </motion.li>
                        </>
                      )}
                      {(bmiCategory === 'Overweight' || bmiCategory === 'Obesity') && (
                        <>
                          <motion.li 
                            className="flex items-start"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 }}
                          >
                            <Info className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>Focus on portion control and mindful eating</span>
                          </motion.li>
                          <motion.li 
                            className="flex items-start"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.9 }}
                          >
                            <Info className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>Include more fiber-rich foods to help feel fuller longer</span>
                          </motion.li>
                          <motion.li 
                            className="flex items-start"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1 }}
                          >
                            <Info className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>Start with moderate exercise and gradually increase intensity</span>
                          </motion.li>
                        </>
                      )}
                    </motion.ul>
                  </motion.div>
                  
                  {/* Action Buttons */}
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, duration: 0.5 }}
                  >
                    <motion.button
      onClick={handleMealPlanClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium shadow transition-all duration-300"
    >
      Get Detailed Meal Plan
    </motion.button>
                    
                    <motion.button 
                      onClick={handleReset}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-medium transition-all duration-300"
                    >
                      Recalculate
                    </motion.button>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};
export default NutritionPlannerDetails;
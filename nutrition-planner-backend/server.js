// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const authRoutes = require('./routes/authRoutes');

// const app = express();
// app.use(express.json());
// app.use(cors());

// // Connect to MongoDB - Fixed connection without deprecated options
// mongoose.connect(process.env.MONGODB_URI, {
//     connectTimeoutMS: 30000,
//     socketTimeoutMS: 45000,
//     maxPoolSize: 50,
//     retryWrites: true,
//     retryReads: true
// })
// .then(() => console.log("✅ MongoDB Connected"))
// .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// // Use routes
// app.use('/api/auth', authRoutes);

// // Route to check if server is running
// app.get('/', (req, res) => {
//   res.send('NutriPlan API is running!');
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const FormData = require('form-data');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB - Fixed connection without deprecated options
mongoose.connect(process.env.MONGODB_URI, {
    connectTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    maxPoolSize: 50,
    retryWrites: true,
    retryReads: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Use routes
app.use('/api/auth', authRoutes);

// Route to check if server is running
app.get('/', (req, res) => {
  res.send('NutriPlan API is running!');
});

// Add this endpoint to your server.js
app.post('/analyze-food', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // First get the OAuth token
    const tokenResponse = await axios.post(
      'https://oauth.fatsecret.com/connect/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        scope: 'basic',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
          username: process.env.FATSECRET_CLIENT_ID,
          password: process.env.FATSECRET_CLIENT_SECRET,
        },
      }
    );
    
    const { access_token } = tokenResponse.data;
    
    // Create a FormData instance for the image
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });
    
    // Log token for debugging
    console.log('Access token obtained:', access_token.substring(0, 10) + '...');
    
    // Make the API request to FatSecret
    const apiResponse = await axios.post(
      'https://platform.fatsecret.com/rest/server.api',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          ...formData.getHeaders()
        },
        params: {
          method: 'foods.recognize',
          format: 'json',
          region: 'US', // Specify the region
          language: 'en',  // Specify the language
          flag: '1', // Request detailed breakdown
        },
      }
    );
    
    // Log the API response for debugging
    console.log('FatSecret API Response:', JSON.stringify(apiResponse.data, null, 2));
    
    // Transform the API response to make it more accessible
    const transformedResponse = transformFoodRecognitionResponse(apiResponse.data);
    
    // Send the response to the client
    res.json(transformedResponse);
    
  } catch (error) {
    console.error('Error analyzing food:', error);
    
    // Send a more detailed error response
    res.status(500).json({
      error: 'Failed to analyze food image',
      message: error.message,
      details: error.response?.data || 'No additional details available'
    });
  }
});

// Helper function to transform the FatSecret API response
function transformFoodRecognitionResponse(apiResponse) {
  if (!apiResponse || !apiResponse.foods) {
    return { error: 'Invalid API response' };
  }
  
  // Initialize the transformed response
  const transformedResponse = {
    foods: {
      food: []
    }
  };
  
  // Check if the response has the food property
  if (apiResponse.foods.food) {
    // Handle if it's an array
    if (Array.isArray(apiResponse.foods.food)) {
      transformedResponse.foods.food = apiResponse.foods.food.map(item => {
        return {
          food_id: item.food_id,
          food_name: item.food_name,
          food_description: item.food_description || '',
          serving_description: `${item.serving_description || ''}`,
          food_nutrition: {
            calories: parseFloat(item.food_nutrition?.calories || 0),
            protein: parseFloat(item.food_nutrition?.protein || 0),
            fat: parseFloat(item.food_nutrition?.fat || 0),
            carbohydrate: parseFloat(item.food_nutrition?.carbohydrate || 0),
            fiber: parseFloat(item.food_nutrition?.fiber || 0),
            sugar: parseFloat(item.food_nutrition?.sugar || 0),
            sodium: parseFloat(item.food_nutrition?.sodium || 0),
            saturated_fat: parseFloat(item.food_nutrition?.saturated_fat || 0)
          }
        };
      });
    } else {
      // Handle if it's a single object
      transformedResponse.foods.food.push({
        food_id: apiResponse.foods.food.food_id,
        food_name: apiResponse.foods.food.food_name,
        food_description: apiResponse.foods.food.food_description || '',
        serving_description: `${apiResponse.foods.food.serving_description || ''}`,
        food_nutrition: {
          calories: parseFloat(apiResponse.foods.food.food_nutrition?.calories || 0),
          protein: parseFloat(apiResponse.foods.food.food_nutrition?.protein || 0),
          fat: parseFloat(apiResponse.foods.food.food_nutrition?.fat || 0),
          carbohydrate: parseFloat(apiResponse.foods.food.food_nutrition?.carbohydrate || 0),
          fiber: parseFloat(apiResponse.foods.food.food_nutrition?.fiber || 0),
          sugar: parseFloat(apiResponse.foods.food.food_nutrition?.sugar || 0),
          sodium: parseFloat(apiResponse.foods.food.food_nutrition?.sodium || 0),
          saturated_fat: parseFloat(apiResponse.foods.food.food_nutrition?.saturated_fat || 0)
        }
      });
    }
  }
  
  // Calculate total nutrition values
  if (transformedResponse.foods.food.length > 0) {
    const totalNutrition = {
      calories: 0,
      protein: 0,
      fat: 0,
      carbohydrate: 0
    };
    
    transformedResponse.foods.food.forEach(item => {
      totalNutrition.calories += item.food_nutrition.calories;
      totalNutrition.protein += item.food_nutrition.protein;
      totalNutrition.fat += item.food_nutrition.fat;
      totalNutrition.carbohydrate += item.food_nutrition.carbohydrate;
    });
    
    transformedResponse.foods.total_nutrition = totalNutrition;
  }
  
  return transformedResponse;
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



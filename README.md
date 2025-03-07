# 🌟 Meal Planner Platform

## 📌 Overview
In today’s rapidly evolving digital world, many people struggle to manage their health and nutrition effectively. Our platform automatically generates healthy, nutritious meal plans tailored to individual calorie needs. It also includes an AI-powered assistant to provide personalized meal recommendations and detailed nutritional information.

## 🎯 Features
- **Personalized Meal-generater** - Create custom meal plans based on dietary requirements and calorie goals.
- **BMI Calculator** - Quickly calculate BMI to better understand body composition.
- **Personal AI assistant** - Get meal suggestions, nutritional insights, and dietary tips.
- **User-Friendly Dashboard** - Easily navigate and manage your meal plans and preferences.

## 🔧 Tech Stack
- **Frontend:** React , Tailwind CSS
- **Backend:** Node.js , Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Token)
- **AI Services:** Gemini API

## ⚙️ How to Run Locally

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Manthann07/MSU-FootPrint.git
cd MSU-FootPrint
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Set Up Environment Variables
Create a `.env.local` file in the root directory and add:
```env
VITE_BACKEND_URL=http://localhost:7000
VITE_MEAL_PLANNER_API_KEY=b42f1af061da4d108d686857d6ca5a1f
REACT_APP_GEMINI_API_KEY=AIzaSyBklc71iuVgSkT6wc38suj3xdMH8f_9oMQ
JWT_SECRET='f09d4152baca4a15e1b8ed082e36d0d96f1e3b9a645bfe75631c3156f504a68c65f05d206e149e727f2ff51d831376d6d8f82b66c2ed78979c003b6111d38295'
MONGODB_URI=mongodb+srv://Manthann07:gfmlDa85zHTVd3ug@nutritionplanner.fap63.mongodb.net/nutritionDB?retryWrites=true&w=majority
VITE_API_URL=http://localhost:7000
PORT=7000
```
⚠️ Note: For security reasons, never expose API keys, secrets, or database URIs in public repositories. Use .gitignore to exclude the .env.local file.

### 4️⃣ Start the Development Server
#### Frontend (React , Tailwind)
```bash
npm run dev
```
App will be running at `http://localhost:5173`
#### Backend (Node.js, Express)
```bash
npm start
```
Server will run at `http://localhost:7000`

## 🚀 Future Enhancements
- **Meal Preferences & Allergies:**  Users can specify dietary restrictions or allergies.
- **Progress Tracker:**  Visualize health progress with charts and analytics.
- **Recipe Library:** Access a collection of recipes based on selected meal plans.
- **Community Sharing:** Share meal plans with friends or the community.


## 🤝 Contributing
We welcome contributions! 🎉
**If you’d like to contribute:**
Feel free to fork the repo, make changes, and submit a pull request.


## 📜 License
This project is licensed under the MIT License.

---
💡**Empowering People with Healthy diet with AI assistant!**


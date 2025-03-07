import React from 'react';
import { Clock, Utensils, DollarSign, Heart, ShoppingBag, Leaf } from 'lucide-react';

const features = [
  {
    icon: <Clock className="h-10 w-10 text-green-600" />,
    title: 'Save Time',
    description: 'Plan your entire week in minutes, not hours. Our smart suggestions adapt to your preferences.'
  },
  {
    icon: <DollarSign className="h-10 w-10 text-green-600" />,
    title: 'Reduce Costs',
    description: 'Minimize food waste and optimize your grocery shopping with our intelligent planning system.'
  },
  {
    icon: <Heart className="h-10 w-10 text-green-600" />,
    title: 'Healthier Eating',
    description: 'Balance your nutrition with meal plans that meet your dietary goals and restrictions.'
  },
  {
    icon: <Utensils className="h-10 w-10 text-green-600" />,
    title: 'Diverse Recipes',
    description: 'Access thousands of recipes from various cuisines, all customizable to your taste.'
  },
  {
    icon: <ShoppingBag className="h-10 w-10 text-green-600" />,
    title: 'Smart Shopping Lists',
    description: 'Automatically generate shopping lists based on your meal plan for the week.'
  },
  {
    icon: <Leaf className="h-10 w-10 text-green-600" />,
    title: 'Eco-Friendly',
    description: 'Reduce your environmental impact by planning meals that minimize waste and carbon footprint.'
  }
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why Choose NutriVista ?</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our meal planning platform is designed to make your life easier while helping you eat better, save money, and reduce waste.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-lg text-gray-700">
            Join thousands of satisfied users who have transformed their meal planning experience
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
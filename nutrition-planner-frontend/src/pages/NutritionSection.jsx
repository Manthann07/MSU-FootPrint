import React, { useEffect, useState } from 'react';

const NutritionSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeNutrient, setActiveNutrient] = useState(0);

  const nutrients = [
    { name: 'Protein', color: 'bg-red-500', value: 25 },
    { name: 'Carbs', color: 'bg-blue-500', value: 45 },
    { name: 'Fats', color: 'bg-yellow-500', value: 30 },
    { name: 'Fiber', color: 'bg-green-500', value: 15 },
    { name: 'Vitamins', color: 'bg-purple-500', value: 10 }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const sectionElement = document.getElementById('nutrition-section');
    if (sectionElement) observer.observe(sectionElement);

    // Rotate through nutrients
    const interval = setInterval(() => {
      setActiveNutrient((prev) => (prev + 1) % nutrients.length);
    }, 3000);

    return () => {
      if (sectionElement) observer.unobserve(sectionElement);
      clearInterval(interval);
    };
  }, [nutrients.length]);

  return (
    <section id="nutrition-section" className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Quote */}
          <div
            className="space-y-6 md:pr-8"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
            }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
              Nourish Your Body, <span className="text-green-600">Fuel Your Life</span>
            </h2>

            <div className="relative pl-6 border-l-4 border-green-500">
              <p className="text-lg text-gray-700 italic">
                "Let food be thy medicine and medicine be thy food. Proper nutrition isn't just about eating, it's about nourishing your body with what it truly needs."
              </p>
              <p className="mt-2 text-gray-600 font-medium">— Hippocrates</p>
            </div>
          </div>

          {/* Right side - Animated Nutrition Visualization */}
          <div
            className="relative h-96"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(30px)',
              transition: 'opacity 0.8s ease-out 0.3s, transform 0.8s ease-out 0.3s'
            }}
          >
            {/* Plate Circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 rounded-full border-8 border-gray-200 bg-white shadow-lg flex items-center justify-center">
                <div className="w-48 h-48 rounded-full bg-gray-50 flex items-center justify-center text-lg font-bold text-gray-500">
                  Balanced Plate
                </div>
              </div>
            </div>

            {/* Orbiting Nutrient Circles */}
            {nutrients.map((nutrient, index) => {
              const angle = (index * (360 / nutrients.length) + (isVisible ? 0 : 180)) * (Math.PI / 180);
              const radius = 140;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              const isActive = activeNutrient === index;

              return (
                <div
                  key={nutrient.name}
                  className={`absolute rounded-full ${nutrient.color} flex items-center justify-center shadow-lg transition-all duration-500`}
                  style={{
                    width: isActive ? '80px' : '60px',
                    height: isActive ? '80px' : '60px',
                    left: `calc(50% + ${x}px - ${isActive ? 40 : 30}px)`,
                    top: `calc(50% + ${y}px - ${isActive ? 40 : 30}px)`,
                    transform: `scale(${isActive ? 1.1 : 1})`,
                    zIndex: isActive ? 10 : 5,
                    transition: 'all 0.5s ease-out, left 1.5s ease-in-out, top 1.5s ease-in-out',
                    animation: isVisible ? `float 3s ease-in-out infinite ${index * 0.5}s` : 'none',
                  }}
                >
                  <div className="text-center">
                    <p className="font-bold text-white text-sm">{nutrient.name}</p>
                    {isActive && (
                      <p className="text-white text-xs">{nutrient.value}%</p>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Animated Connecting Lines */}
            <svg
              className="absolute inset-0 w-full h-full"
              style={{ opacity: isVisible ? 0.5 : 0 }}
            >
              {nutrients.map((nutrient, index) => {
                const angle = (index * (360 / nutrients.length) + (isVisible ? 0 : 180)) * (Math.PI / 180);
                const radius = 140;
                const x2 = Math.cos(angle) * radius + 192;
                const y2 = Math.sin(angle) * radius + 192;

                return (
                  <line
                    key={`line-${nutrient.name}`}
                    x1="192"
                    y1="192"
                    x2={x2}
                    y2={y2}
                    stroke="#d1d5db"
                    strokeWidth="1"
                    strokeDasharray="3,3"
                  />
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default NutritionSection;

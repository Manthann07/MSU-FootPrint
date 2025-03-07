import React, { useEffect } from "react";
import { Leaf, Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";

// Import for animations
import { useState } from "react";

const About = () => {
  const [isVisible, setIsVisible] = useState({});
  const [count, setCount] = useState({});

  useEffect(() => {
    // Initial animations on load
    setTimeout(() => {
      setIsVisible((prev) => ({ ...prev, hero: true }));
    }, 100);

    // Set up intersection observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));

            // Start counters for stats section
            if (entry.target.id === "stats") {
              startCounters();
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all sections
    document.querySelectorAll(".animate-section").forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  // Counter animation for stats
  const startCounters = () => {
    const stats = [
      { id: "recipes", target: 10000, suffix: "+" },
      { id: "users", target: 50000, suffix: "+" },
      { id: "meals", target: 1200000, suffix: "+", display: "1.2M" },
      { id: "rating", target: 4.8, suffix: "/5", decimal: true },
    ];

    stats.forEach((stat) => {
      let start = 0;
      const duration = 2000; // ms
      const increment = stat.decimal ? 0.1 : Math.ceil(stat.target / 30);
      const startTime = performance.now();

      const updateCounter = (timestamp) => {
        const runtime = timestamp - startTime;
        const relativeProgress = runtime / duration;

        if (runtime < duration) {
          let value;
          if (stat.decimal) {
            value = Math.min(
              (relativeProgress * stat.target).toFixed(1),
              stat.target
            );
          } else {
            value = Math.min(
              Math.floor(relativeProgress * stat.target),
              stat.target
            );
          }

          setCount((prev) => ({
            ...prev,
            [stat.id]: stat.display || value + stat.suffix,
          }));
          requestAnimationFrame(updateCounter);
        } else {
          setCount((prev) => ({
            ...prev,
            [stat.id]: stat.display || stat.target + stat.suffix,
          }));
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  // Animation classes and effects
  const fadeIn = (id) => {
    return !isVisible[id]
      ? "opacity-0 translate-y-10"
      : "opacity-100 translate-y-0";
  };

  const slideLeft = (id) => {
    return !isVisible[id]
      ? "opacity-0 -translate-x-20"
      : "opacity-100 translate-x-0";
  };

  const slideRight = (id) => {
    return !isVisible[id]
      ? "opacity-0 translate-x-20"
      : "opacity-100 translate-x-0";
  };

  const scaleUp = (id) => {
    return !isVisible[id] ? "opacity-0 scale-75" : "opacity-100 scale-100";
  };

  const rotateIn = (id) => {
    return !isVisible[id]
      ? "opacity-0 rotate-90 scale-50"
      : "opacity-100 rotate-0 scale-100";
  };

  // New animation for CTA headings - from bottom to top
  const fadeInUp = (id) => {
    return !isVisible[id]
      ? "opacity-0 translate-y-10"
      : "opacity-100 translate-y-0";
  };

  // Staggered animation for grid items
  const getStaggeredDelay = (index) => {
    return { transitionDelay: `${150 * index}ms` };
  };

  return (
    <div className="bg-white">
      {/* Hero Section with floating animation */}
      <div className="relative bg-gradient-to-br from-green-50 to-green-100 py-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`absolute -top-20 -right-20 w-96 h-96 rounded-full bg-green-200 opacity-30 animate-pulse`}
          ></div>
          <div
            className={`absolute bottom-20 left-40 w-64 h-64 rounded-full bg-yellow-200 opacity-30 animate-ping animate-duration-[3s]`}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div
            className={`text-center transition-all duration-1000 ${fadeIn(
              "hero"
            )}`}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 font-['Trebuchet_MS'] tracking-tight relative">
              About{" "}
              <span
                className={`text-green-600 inline-block transition-all duration-1000 ${
                  isVisible.hero
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
                style={{ transitionDelay: "300ms" }}
              >
                MealMaster
              </span>
              <span className="absolute -right-4 -top-4 text-green-400 text-6xl opacity-20 animate-bounce">
                🥗
              </span>
            </h1>
            <p
              className={`max-w-3xl mx-auto text-lg text-gray-600 font-['Georgia'] leading-relaxed transition-all duration-1000 ${
                isVisible.hero
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: "600ms" }}
            >
              We're on a mission to make healthy eating accessible, enjoyable,
              and stress-free for everyone.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story with typing effect */}
      <div id="story" className="py-16 bg-white animate-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div
              className={`transition-all duration-1000 ${slideLeft("story")}`}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-6 font-['Trebuchet_MS'] relative">
                Our Achievements
                <span
                  className={`absolute bottom-0 left-0 w-16 h-1 bg-green-500 transition-all duration-1000 ease-out ${
                    isVisible.story ? "w-16" : "w-0"
                  }`}
                  style={{ transitionDelay: "600ms" }}
                ></span>
              </h2>
              <div className="space-y-4 font-['Georgia']">
                {[
                  "MealMaster began with a simple observation: despite having access to more nutritional information than ever before, people were struggling to consistently plan and prepare healthy meals.",
                  "Built by a team of nutritionists, chefs, and tech enthusiasts, MealMaster was designed to simplify meal planning, making it intuitive and enjoyable rather than just another task. ",
                  "Today, MealMaster helps thousands of individuals and families eat better, reduce food waste, and save money through thoughtful meal planning and nutrition guidance.",
                ].map((paragraph, idx) => (
                  <p
                    key={idx}
                    className={`text-gray-600 leading-relaxed transition-all duration-1000 ${
                      isVisible.story
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-10"
                    }`}
                    style={{ transitionDelay: `${800 + idx * 300}ms` }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            <div
              className={`relative transition-all duration-1000 ${slideRight(
                "story"
              )}`}
            >
              <div className="rounded-3xl shadow-lg bg-gray-200 h-64 flex items-center justify-center overflow-hidden">
                <div
                  className={`text-gray-600 transform transition-all duration-700 ${
                    isVisible.story ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ transitionDelay: "800ms" }}
                >
                  <img
                    src="/about.jpg"
                    alt="Healthy Meal"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values with rotate and flip animations */}
      <div id="values" className="py-16 bg-green-50 animate-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-12 transition-all duration-1000 ${fadeIn(
              "values"
            )}`}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4 font-['Trebuchet_MS'] inline-block relative">
              Our Values
              <span
                className={`absolute -bottom-2 left-0 right-0 h-1 bg-green-400 transition-all duration-1000 ease-out ${
                  isVisible.values ? "w-full" : "w-0"
                }`}
              ></span>
            </h2>
            <p
              className={`max-w-3xl mx-auto text-gray-600 font-['Georgia'] transition-all duration-1000 ${
                isVisible.values ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              At MealMaster, our work is guided by these core principles that
              shape everything we do.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Leaf className="h-10 w-10 text-green-500" />,
                title: "Nutritional Excellence",
                description:
                  "We believe in balanced nutrition based on whole foods, backed by science, not fads or extreme diets.",
              },
              {
                icon: <Users className="h-10 w-10 text-green-500" />,
                title: "Inclusive Approach",
                description:
                  "Food is personal. We embrace dietary preferences and restrictions with recipes for everyone.",
              },
              {
                icon: <Clock className="h-10 w-10 text-green-500" />,
                title: "Practical Solutions",
                description:
                  "Our tools are designed for real life—saving you time while making healthy eating achievable.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className={`bg-white p-6 rounded-xl shadow-md transform transition-all duration-700 ease-out ${
                  isVisible.values
                    ? "opacity-100 translate-y-0 rotate-0"
                    : "opacity-0 -translate-y-10 rotate-5"
                } hover:shadow-lg hover:-translate-y-1`}
                style={getStaggeredDelay(index)}
              >
                <div
                  className={`flex justify-center mb-4 transition-all duration-1000 ${
                    isVisible.values ? "scale-100" : "scale-0"
                  }`}
                  style={{ transitionDelay: `${600 + index * 200}ms` }}
                >
                  <div className="transform transition-all duration-500 hover:scale-110 hover:rotate-12">
                    {value.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center font-['Trebuchet_MS']">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-center font-['Tahoma']">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Team with card flip effect */}
      <div id="team" className="py-16 bg-white animate-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-12 transition-all duration-1000 ${fadeInUp(
              "team"
            )}`}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4 font-['Trebuchet_MS'] relative inline-block">
              Meet Our Team
              <span
                className={`absolute -bottom-2 left-0 right-0 h-1 bg-green-500 transition-all duration-1500 ease-out ${
                  isVisible.team ? "w-full" : "w-0"
                }`}
              ></span>
            </h2>
            <p className="max-w-3xl mx-auto text-gray-600 font-['Georgia']">
              Our diverse team brings together expertise in nutrition, culinary
              arts, and technology.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-7">
            {[
              {
                name: "shail",
                role: "Chief Nutritionist",
                bio: "MS in Nutrition, specializing in balanced meal planning for busy lifestyles.",
              },
              {
                name: "tirth",
                role: "Head Chef",
                bio: "Cul Institute graduate with 15 years of experience creating healthy dishes",
              },
              {
                name: "mayank",
                role: "Health Advisor",
                bio: "Board-certified physician focused on preventative health through nutrition.",
              },
              {
                name: "manthan",
                role: "Tech Lead",
                bio: "Software engineer passionate about making nutrition technology accessible.",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="perspective-1000"
                style={getStaggeredDelay(index)}
              >
                <div
                  className={`bg-white border border-gray-100 rounded-xl overflow-hidden shadow-md group hover:shadow-lg transition-all duration-500 transform ${
                    isVisible.team
                      ? "opacity-100 translate-y-0 rotate-0"
                      : "opacity-0 translate-y-20 rotateX-90"
                  }`}
                >
                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center transform transition-all duration-500 group-hover:scale-105 overflow-hidden">
                    <img
                      src={`/${member.name
                        .toLowerCase()
                        .split(" ")
                        .join("")}.jpg`}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-4 transform transition-all duration-500">
                    <h3 className="text-lg font-semibold text-gray-800 font-['Trebuchet_MS']">
                      {member.name}
                    </h3>
                    <p className="text-green-600 text-sm mb-2 font-['Verdana']">
                      {member.role}
                    </p>
                    <p className="text-gray-600 text-sm font-['Tahoma'] transform transition-all duration-500 group-hover:translate-y-0 translate-y-0 opacity-100 group-hover:opacity-100">
                      {member.bio}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section with counting animation */}
      <div
        id="stats"
        className="py-16 bg-gradient-to-br from-green-600 to-green-700 text-white animate-section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { id: "recipes", label: "Recipes" },
              { id: "users", label: "Active Users" },
              { id: "meals", label: "Meals Planned" },
              { id: "rating", label: "User Rating" },
            ].map((stat, index) => (
              <div
                key={index}
                className={`transition-all duration-700 ${scaleUp("stats")}`}
                style={getStaggeredDelay(index)}
              >
                <p className="text-3xl md:text-4xl font-bold mb-2 font-['Trebuchet_MS'] relative inline-block">
                  {count[stat.id] || "0"}
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-white transition-all duration-1000 ${
                      isVisible.stats ? "w-full" : "w-0"
                    }`}
                    style={{ transitionDelay: `${500 + index * 200}ms` }}
                  ></span>
                </p>
                <p className="text-green-100 font-['Verdana']">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section with button glow */}
      <div id="cta" className="py-16 bg-green-100 animate-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transition-all duration-1000 ${fadeInUp("cta")}`}>
            <h2 className="text-3xl font-bold text-gray-800 mb-4 font-['Trebuchet_MS'] relative inline-block">
              Ready to Transform Your Meal Planning?
              <span
                className={`absolute -bottom-2 left-0 right-0 h-1 bg-green-500 transition-all duration-1500 ease-out ${
                  isVisible.cta ? "w-full" : "w-0"
                }`}
              ></span>
            </h2>
            <p
              className={`max-w-3xl mx-auto text-gray-600 mb-8 font-['Georgia'] transition-all duration-1000 ${
                isVisible.cta
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              Join thousands of people who are saving time, reducing waste, and
              enjoying healthier meals.
            </p>
            <div
              className={`flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 transition-all duration-1000 ${
                isVisible.cta
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "600ms" }}
            >
              <Link
                to="/meal-planner"
                className="relative z-10 border border-green-500 text-green-500 px-4 py-2 rounded-md hover:bg-green-100 transition duration-300 flex items-center justify-center"
              >
                Generate Your Meal
              </Link>
              <span className="absolute top-0 left-0 right-0 bottom-0 bg-green-200 opacity-0 group-hover:opacity-50 transform scale-0 group-hover:scale-100 rounded-full transition-all duration-500 z-0"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

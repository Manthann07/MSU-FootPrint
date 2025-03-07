import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, UtensilsCrossed } from "lucide-react";
import "./Hero.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-16">
          {/* Left Section: Logo & Navbar Items */}
          <div className="flex items-center space-x-60">
            {/* Logo */}
            <div className="flex items-center">
              {/* <UtensilsCrossed className="h-2 w-2 text-green-600" /> */}
              <img src="./logo.png" alt="Your Photo" className="h-15 w-15 rounded-full" />
              <span className="ml-2 text-xl font-bold text-gray-800">
                NutriVista
              </span>
            </div>
          </div>

          {/* Center Section: Navbar Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/home" className="nav-link">Home</Link>
            <Link to="/meal-planner" className="nav-link">Meal Plans</Link>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/aihelper" className="nav-link">AI Assistance</Link>
            <Link to="/about" className="nav-link">About</Link>
          </div>

          {/* Right Section: Get Started Button */}
          <Link
            to="/get-started"
            className="get-started-btn bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 transition-colors duration-200 text-lg"
          >
            Get Started
          </Link>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            <Link
              to="/home"
              className="block px-3 py-2 text-gray-700 hover:text-green-600 font-medium"
            >
              Home
            </Link>
            <Link
              to="/meal-planner"
              className="block px-3 py-2 text-gray-700 hover:text-green-600 font-medium"
            >
              Meal Plans
            </Link>
            <Link
              to="/aihelper"
              className="block px-3 py-2 text-gray-700 hover:text-green-600 font-medium"
            >
              AI Helper
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 text-gray-700 hover:text-green-600 font-medium"
            >
              About
            </Link>
            <Link
              to="/get-started"
              className="block bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 transition-colors duration-200 text-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
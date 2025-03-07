import React from 'react';
import { UtensilsCrossed, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-3">
              <UtensilsCrossed className="h-6 w-6 text-green-400" />
              <span className="ml-2 text-lg font-bold"></span>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Simplifying meal planning for busy people.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-green-400 hover:text-green-300 transition-colors duration-200">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12.07c0-5.52-4.48-10-10-10s-10 4.48-10 10c0 5 3.66 9.15 8.44 9.9v-7.01H7.9v-2.9h2.54V9.93c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7.01C18.34 21.22 22 17.07 22 12.07z"></path></svg>
              </a>
              <a href="#" className="text-green-400 hover:text-green-300 transition-colors duration-200">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"></path></svg>
              </a>
              <a href="#" className="text-green-400 hover:text-green-300 transition-colors duration-200">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772c-.5.508-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.247-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.059-.976.045-1.505.207-1.858.344-.466.182-.8.398-1.15.748-.35.35-.566.684-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.055-.058 1.37-.058 4.04 0 2.67.01 2.986.058 4.04.045.976.207 1.505.344 1.858.182.466.399.8.748 1.15.35.35.684.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.04.058 2.67 0 2.986-.01 4.04-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.684.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.04 0-2.67-.01-2.986-.058-4.04-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 0 0-.748-1.15 3.098 3.098 0 0 0-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.055-.048-1.37-.058-4.04-.058zm0 3.063a5.135 5.135 0 1 1 0 10.27 5.135 5.135 0 0 1 0-10.27zm0 8.468a3.333 3.333 0 1 0 0-6.666 3.333 3.333 0 0 0 0 6.666zm6.538-8.671a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z"></path></svg>
              </a>
              <a href="#" className="text-green-400 hover:text-green-300 transition-colors duration-200">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path></svg>
              </a>
            </div>
          </div>
          
          {/* Quick Links - Optimized Spacing and Hover */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold mb-3 text-green-400">Quick Links</h3>
            <ul className="space-y-1">
              <li>
                <a href="#" className=" hover:text-green-300 transition-colors duration-200 inline-flex items-center py-1">
                  <span className="text-sm mr-2">•</span>
                  Home
                </a>
              </li>
              <li>
                <a href="meal-planner" className="text-green-400 hover:text-green-300 transition-colors duration-200 inline-flex items-center py-1">
                  <span className="text-sm mr-2">•</span>
                  Meal Plans
                </a>
              </li>
              <li>
                <a href="about" className="text-green-400 hover:text-green-300 transition-colors duration-200 inline-flex items-center py-1">
                  <span className="text-sm mr-2">•</span>
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-green-400 hover:text-green-300 transition-colors duration-200 inline-flex items-center py-1">
                  <span className="text-sm mr-2">•</span>
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-green-400 hover:text-green-300 transition-colors duration-200 inline-flex items-center py-1">
                  <span className="text-sm mr-2">•</span>
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-green-400">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-green-400 mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-300">123 Nutrition Ave, Healthy City</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" />
                <span className="text-gray-300">(555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" />
                <span className="text-gray-300">support@mealmaster.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-4 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} MealMaster. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-green-400 text-sm transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-green-400 text-sm transition-colors duration-200">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-green-400 text-sm transition-colors duration-200">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;  
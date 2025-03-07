import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NutritionHelper = () => {
  // Replace this with your actual API key
  // This approach exposes your API key in the client-side code, which is not ideal for production
  // For development/testing purposes only
  const API_KEY = "AIzaSyBklc71iuVgSkT6wc38suj3xdMH8f_9oMQ";
  
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const chatEndRef = useRef(null);
  const speechSynthesisRef = useRef(null);
  const recognitionRef = useRef(null);

  // Example questions that users can click on
  const exampleQuestions = [
    "How much protein should I eat daily?",
    "Are eggs healthy?",
    "Best foods for weight loss",
    "How many calories should I consume?",
    "Benefits of intermittent fasting"
  ];

  // Auto-scroll to bottom of chat when new messages appear
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Setup speech recognition on component mount
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
        // Auto-submit the voice query
        setTimeout(() => {
          handleSubmit(new Event('submit'));
        }, 500);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      console.log('Speech recognition not supported in this browser');
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // Add user message to chat history
    const userMessage = query.trim();
    setChatHistory(prev => [...prev, { type: 'user', content: userMessage }]);
    
    setIsLoading(true);
    setError('');
    setQuery('');
    
    try {
      // Use the hardcoded API key instead of environment variable
      const MODEL_NAME = "gemini-2.0-flash"; // or "gemini-1.5-flash" depending on what's available to you
      
      // The API endpoint (this is the standard one for Gemini)
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;
      
      // Prepare chat history context (limited to last 6 exchanges to avoid hitting token limits)
      const recentMessages = chatHistory.slice(-6);
      const contextMessages = recentMessages.map(msg => 
        `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      ).join('\n');
      
      // Create the prompt with instructions
      const promptData = {
        contents: [
          {
            parts: [
              {
                text: `You are a helpful nutrition assistant embedded in a nutrition planning website.
                      Provide short, direct answers about nutrition topics.
                      Keep responses under 3 sentences when possible.
                      Focus only on evidence-based nutrition information.
                      If you're unsure, say so rather than giving potentially incorrect advice.
                      
                      Previous conversation:
                      ${contextMessages}
                      
                      User question: ${userMessage}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 150
        }
      };
      
      // Make the API request using fetch
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(promptData)
      });
      
      // Handle API response
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to get response from Gemini API');
      }
      
      // Parse the response
      const data = await response.json();
      const generatedText = data.candidates[0]?.content?.parts[0]?.text || 'No response generated';
      
      // Add AI response to chat history
      setChatHistory(prev => [...prev, { type: 'assistant', content: generatedText }]);
      
      // If voice is enabled, speak the response
      if (voiceEnabled) {
        speakText(generatedText);
      }
    } catch (err) {
      console.error('Error with Gemini API:', err);
      setError(err.message || 'An error occurred while getting nutritional advice');
      // Add error to chat history
      setChatHistory(prev => [...prev, { 
        type: 'system', 
        content: 'Sorry, I encountered an error while processing your request. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (question) => {
    setQuery(question);
    // Auto-submit after clicking an example
    setTimeout(() => {
      handleSubmit(new Event('submit'));
    }, 300);
  };

  const clearChat = () => {
    setChatHistory([]);
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    
    // If turning off, stop any ongoing speech
    if (voiceEnabled) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Speech recognition error:', error);
      }
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech first
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      // Get voices and set a natural-sounding one if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Female') || 
        voice.name.includes('Google') || 
        voice.name.includes('Samantha')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      speechSynthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: { 
      repeat: Infinity, 
      duration: 1.5 
    }
  };

  // For background decorative elements
  const floatingAnimation = (delay = 0) => ({
    y: [0, -15, 0],
    rotate: [0, 5, 0, -5, 0],
    transition: {
      y: {
        repeat: Infinity,
        duration: 10 + Math.random() * 5,
        ease: "easeInOut",
        delay
      },
      rotate: {
        repeat: Infinity,
        duration: 12 + Math.random() * 6,
        ease: "easeInOut",
        delay
      }
    }
  });

  // Generate random positions for background elements
  const generateBackgroundElements = (count) => {
    const elements = [];
    for (let i = 0; i < count; i++) {
      elements.push({
        id: i,
        left: `${Math.random() * 90}%`,
        top: `${Math.random() * 90}%`,
        size: 20 + Math.random() * 60,
        delay: Math.random() * 2,
        type: Math.random() > 0.5 ? 'circle' : 'square'
      });
    }
    return elements;
  };

  const backgroundElements = generateBackgroundElements(15);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-green-50 to-green-100 overflow-hidden">
      {/* Animated background elements */}
      {backgroundElements.map((elem) => (
        <motion.div
          key={elem.id}
          className={`absolute opacity-10 ${
            elem.type === 'circle' 
              ? 'rounded-full bg-green-500' 
              : 'rotate-45 bg-green-600'
          }`}
          style={{
            left: elem.left,
            top: elem.top,
            width: elem.size,
            height: elem.size,
          }}
          animate={floatingAnimation(elem.delay)}
        />
      ))}
      
      {/* Top decoration with animated leaves */}
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-green-600 to-transparent opacity-20 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-green-800"
            style={{
              left: `${i * 12 + Math.random() * 5}%`,
              top: `-${Math.random() * 20}px`,
              fontSize: `${30 + Math.random() * 20}px`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
            animate={{
              y: [0, 8, 0],
              rotate: [`${Math.random() * 360}deg`, `${Math.random() * 360 + 40}deg`],
              transition: {
                y: { repeat: Infinity, duration: 3 + Math.random() * 2, ease: "easeInOut" },
                rotate: { repeat: Infinity, duration: 4 + Math.random() * 3, ease: "easeInOut" }
              }
            }}
          >
            🍃
          </motion.div>
        ))}
      </div>
      
      {/* Main content */}
      <div className="w-full min-h-screen p-4 md:p-8">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full h-screen flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-800 to-green-600 p-4 rounded-t-xl shadow-xl border-b border-green-900 flex justify-between items-center">
            <motion.div 
              className="flex items-center space-x-3"
              variants={itemVariants}
            >
              <motion.div 
                animate={isSpeaking || isListening ? pulseAnimation : {}}
                className="p-2 rounded-full bg-white bg-opacity-20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.728-2.728" />
                </svg>
              </motion.div>
              <h2 className="text-3xl font-bold text-white tracking-wide">Nutrition Assistant</h2>
            </motion.div>
            <div className="flex space-x-3">
              <motion.button
                onClick={toggleVoice}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-full transition-all duration-300 ${
                  voiceEnabled 
                    ? 'bg-white text-green-700 shadow-lg' 
                    : 'text-white hover:bg-white hover:bg-opacity-20'
                }`}
                variants={itemVariants}
                title={voiceEnabled ? "Turn off voice" : "Turn on voice"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </motion.button>
              <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-white p-2 rounded-full hover:bg-white hover:bg-opacity-20"
                variants={itemVariants}
              >
                {isExpanded ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                )}
              </motion.button>
            </div>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="flex-1 bg-white flex flex-col shadow-2xl rounded-b-xl overflow-hidden"
              >
                {/* Chat area */}
                <div className="flex-1 overflow-y-auto p-5 md:p-6 bg-gradient-to-b from-gray-50 to-white relative">
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'radial-gradient(circle, #22c55e 1px, transparent 1px)',
                      backgroundSize: '30px 30px'
                    }}></div>
                  </div>
                  
                  {chatHistory.length === 0 ? (
                    <motion.div 
                      className="flex flex-col items-center justify-center h-full text-gray-500"
                      variants={containerVariants}
                    >
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: -20 }}
                        animate={{ 
                          scale: 1, 
                          opacity: 1, 
                          y: 0,
                          transition: { type: "spring", stiffness: 100 }
                        }}
                        className="relative"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-green-300">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <motion.div
                          className="absolute -top-4 -right-4 -left-4 -bottom-4 rounded-full border-4 border-green-200 border-dashed"
                          animate={{
                            rotate: 360,
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 20,
                            ease: "linear"
                          }}
                        />
                      </motion.div>
                      <motion.div 
                        className="mt-6 text-center max-w-md"
                        variants={itemVariants}
                      >
                        <h3 className="text-xl font-semibold text-green-700 mb-2">Your Personal Nutrition Guide</h3>
                        <p className="mb-4">
                          Ask me anything about nutrition, diet plans, or healthy eating habits.
                        </p>
                        <p className="text-sm opacity-75">
                          Try using voice by clicking the microphone icon to speak your questions.
                        </p>
                      </motion.div>

                      {/* Quick start suggestions */}
                      <motion.div 
                        className="mt-8 bg-green-50 p-4 rounded-lg border border-green-100 max-w-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <h4 className="font-medium text-green-800 mb-2">Popular Topics:</h4>
                         <div className="flex flex-wrap gap-2 justify-center">
                          {["Protein sources", "Keto diet", "Weight management", "Vitamins", "Meal planning"].map((topic, i) => (
                            <motion.button
                              key={i}
                              className="bg-white px-3 py-1.5 rounded-lg text-green-700 border border-green-200 shadow-sm hover:bg-green-100"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleExampleClick(topic)}
                            >
                              {topic}
                            </motion.button>
                          ))}
                        </div> 
                      </motion.div>
                    </motion.div>
                  ) : (
                    <div className="space-y-5 relative z-10">
                      {chatHistory.map((message, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.4, type: "spring" }}
                          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          {message.type !== 'user' && (
                            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center mr-2 mt-1 shrink-0">
                              <span className="text-white text-sm font-bold">N</span>
                            </div>
                          )}
                          <div 
                            className={`max-w-[80%] p-4 rounded-xl shadow-sm ${
                              message.type === 'user' 
                                ? 'bg-green-600 text-white rounded-tr-none' 
                                : message.type === 'system'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
                            }`}
                          >
                            {message.content}
                            {message.type === 'assistant' && voiceEnabled && (
                              <motion.button
                                onClick={() => isSpeaking ? stopSpeaking() : speakText(message.content)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="ml-2 text-gray-400 hover:text-gray-600 inline-flex items-center"
                                title={isSpeaking ? "Stop speaking" : "Read aloud"}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  {isSpeaking ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                                  ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728" />
                                  )}
                                </svg>
                              </motion.button>
                            )}
                          </div>
                          {message.type === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-green-800 flex items-center justify-center ml-2 mt-1 shrink-0">
                              <span className="text-white text-sm font-bold">U</span>
                            </div>
                          )}
                        </motion.div>
                      ))}
                      {isLoading && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex justify-start"
                        >
                          <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center mr-2 mt-1 shrink-0">
                            <span className="text-white text-sm font-bold">N</span>
                          </div>
                          <div className="bg-white p-4 rounded-xl rounded-tl-none border border-gray-200 shadow-sm">
                            <div className="flex space-x-2">
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
                                className="w-2 h-2 bg-green-500 rounded-full"
                              />
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                                className="w-2 h-2 bg-green-500 rounded-full"
                              />
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
                                className="w-2 h-2 bg-green-500 rounded-full"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                      <div ref={chatEndRef} />
                    </div>
                  )}
                </div>

                {/* Input area */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <form onSubmit={handleSubmit} className="flex">
                    <motion.div className="flex-1 relative">
                      <motion.input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ask about nutrition, foods, or meal planning..."
                        disabled={isLoading || isListening}
                        className={`w-full p-4 pl-12 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base ${
                          isListening ? 'bg-green-50' : ''
                        }`}
                        whileFocus={{ scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                      <motion.button
                        type="button"
                        onClick={toggleListening}
                        disabled={isLoading}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        animate={isListening ? pulseAnimation : {}}
                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600 ${
                          isListening ? 'text-green-600' : ''
                        }`}
                        title={isListening ? "Stop listening" : "Start voice input"}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                      </motion.button>
                    </motion.div>
                    <motion.button 
                      type="submit" 
                      disabled={isLoading || isListening || !query.trim()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-6 py-4 rounded-r-lg text-white font-medium transition-colors ${
                        isLoading || isListening || !query.trim() ? 'bg-green-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {isLoading ? (
                        <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                      )}
                    </motion.button>
                  </form>

                  {/* Example questions */}
                  <motion.div 
                    className="mt-5"
                    variants={itemVariants}
                  >
                    <div className="flex flex-wrap gap-2 justify-center">
                      {exampleQuestions.map((question, index) => (
                        <motion.button
                          key={index}
                          onClick={() => handleExampleClick(question)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-green-50 px-3 py-1.5 rounded-lg text-green-700 border border-green-200 shadow-sm hover:bg-green-100"
                        >
                          {question}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default NutritionHelper;



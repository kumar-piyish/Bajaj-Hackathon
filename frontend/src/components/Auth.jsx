import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const Auth = ({ mode, setToken }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const url = mode === "login" ? "/token" : "/register";
    const fullUrl = `http://localhost:8000${url}`;
    const headers =
      mode === "login"
        ? { "Content-Type": "application/x-www-form-urlencoded" }
        : { "Content-Type": "application/json" };
    const body =
      mode === "login"
        ? new URLSearchParams({ username, password })
        : JSON.stringify({ username, email, password });

    try {
      const res = await fetch(fullUrl, {
        method: "POST",
        headers,
        body,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || err.error || res.statusText);
      }

      const data = await res.json();
      setToken(data.access_token);
      navigate("/");
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Insurance-related animations
  const insuranceVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900">
      {/* Left side - Auth Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md ">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
          >
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                  {mode === "login" ? "Welcome Back" : "Get Started"}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  {mode === "login"
                    ? "Sign in to your account"
                    : "Create your account today"}
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    htmlFor="username"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="Enter your username"
                    required
                  />
                </div>

                {mode === "register" && (
                  <div className="mb-4">
                    <label
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                )}

                <div className="mb-6">
                  <label
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : mode === "login" ? (
                    "Login"
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  {mode === "login"
                    ? "Don't have an account?"
                    : "Already have an account?"}
                  <button
                    onClick={() =>
                      navigate(mode === "login" ? "/signup" : "/login")
                    }
                    className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    {mode === "login" ? "Sign up" : "Login"}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Insurance Poster */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center p-8 relative overflow-hidden">
        {/* Full-cover background image */}
        <div className="absolute inset-0">
          <img
            src="/bg_2.png"
            alt="Insurance Background"
            className="w-full h-full object-cover rounded"
          />
          <div className="absolute inset-0 bg-black/30"></div>{" "}
          {/* Dark overlay for better text contrast */}
        </div>

        {/* Content container */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={insuranceVariants}
          className="relative z-10 text-white text-center w-full max-w-xl"
        >
          {/* Header with insurance-themed styling */}
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-6xl font-bold mb-4  tracking-tight">
              Secure Your Future
            </h2>
            <p className="text-xl text-gray-100">
              {mode === "login"
                ? "Your protection is our priority"
                : "Join thousands who trust us"}
            </p>
          </motion.div>

          {/* Insurance document animation */}
          <motion.div variants={itemVariants} className="mb-12">
            <div className="relative h-48 flex justify-center items-center">
              {/* Animated insurance document stack */}
              <motion.div
                className="absolute w-48 h-64 bg-white/90 rounded-lg shadow-2xl"
                initial={{ rotate: -5, y: 0 }}
                animate={{ rotate: [0, -5, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <div className="absolute inset-0 flex flex-col p-4">
                  <div className="h-4 bg-blue-600/80 rounded-full mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded-full mb-1 w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded-full mb-1 w-1/2"></div>
                </div>
              </motion.div>

              <motion.div
                className="absolute w-48 h-64 bg-white/80 rounded-lg shadow-xl"
                initial={{ rotate: 3, y: 10 }}
                animate={{ rotate: [0, 3, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 0.5,
                }}
              >
                <div className="absolute inset-0 flex flex-col p-4">
                  <div className="h-4 bg-green-600/80 rounded-full mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded-full mb-1 w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded-full mb-1 w-1/2"></div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Insurance benefits list */}
          <motion.div variants={itemVariants} className="mt-6">
            <p className="text-xl font-medium mb-8 text-gray-50">
              We Protect What Matters Most
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {[
                { icon: "🛡️", text: "Comprehensive Coverage" },
                { icon: "💰", text: "Affordable Rates" },
                { icon: "⏱️", text: "Quick Claims" },
                { icon: "📱", text: "24/7 Support" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white text-black backdrop-blur-sm p-3 rounded-lg"
                >
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="text-sm">{item.text}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

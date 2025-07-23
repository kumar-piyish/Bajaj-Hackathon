import { FiSun, FiMoon, FiPhone, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-3 shadow-md transition-colors duration-300  ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div 
          className="flex items-center space-x-2 cursor-pointer" 
          onClick={() => {
            navigate('/');
            setIsMobileMenuOpen(false);
          }}
        >
          <img 
            src={`${darkMode ? '/logo-light.png' : '/logo.png'}`} 
            alt="InsureAssist Logo" 
            className="w-10 h-10 md:w-12 md:h-12" 
          />
          <span className="text-xl md:text-2xl font-bold">InsureEase</span>
        </div>

        {/* Desktop*/}
        <div className="hidden md:flex items-center space-x-4">
          <button 
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${
              darkMode ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } cursor-pointer transition-colors`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
          
          <Link 
            to="/profile" 
            className={`p-2 rounded-full ${
              darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-colors`}
            aria-label="Profile"
          >
            <FiUser size={18} />
          </Link>
          
          <button 
            className={`flex items-center space-x-1 px-4 py-2 rounded-lg cursor-pointer ${
              darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
            } text-white transition-colors`}
          >
            <FiPhone size={16} />
            <span className="text-sm md:text-base">Contact</span>
          </button>
        </div>

        {/* Mobile*/}
        <button
          className="md:hidden p-2 rounded-full focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <FiX className={`text-2xl ${darkMode ? 'text-white' : 'text-gray-700'}`} />
          ) : (
            <FiMenu className={`text-2xl ${darkMode ? 'text-white' : 'text-gray-700'}`} />
          )}
        </button>
      </div>


      {isMobileMenuOpen && (
        <div 
          className={`md:hidden mt-2 pb-4 transition-all duration-300 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}
        >
          <div className="flex flex-col space-y-3 px-4">
            <button 
              onClick={toggleDarkMode}
              className={`flex items-center cursor-pointer space-x-3 p-3 rounded-lg ${
                darkMode ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } transition-colors`}
            >
              {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
              <span className="text-base">Toggle Theme</span>
            </button>
            
            <Link 
              to="/profile" 
              className={`flex items-center cursor-pointer space-x-3 p-3 rounded-lg ${
                darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } transition-colors`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FiUser size={18} />
              <span className="text-base">Profile</span>
            </Link>
            
            <button 
              className={`flex items-center cursor-pointer space-x-3 p-3 rounded-lg ${
                darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
              } text-white transition-colors`}
            >
              <FiPhone size={18} />
              <span className="text-base">Contact</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
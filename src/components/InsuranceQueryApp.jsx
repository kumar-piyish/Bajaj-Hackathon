import { useState, useRef, useEffect } from 'react';
import { FiSearch, FiUpload, FiSend, FiPhone, FiFileText, FiRefreshCw,FiClock } from 'react-icons/fi';
import QueryHistory from './QueryHistory';

const InsuranceQueryApp = ({ darkMode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [userQuery, setUserQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [activeTab, setActiveTab] = useState('query');
  const [queries, setQueries] = useState(() => {
    const saved = localStorage.getItem('insuranceQueries');
    return saved ? JSON.parse(saved) : [];
  });
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('insuranceQueries', JSON.stringify(queries));
  }, [queries]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocumentName(file.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userQuery.trim()) return;
    
    setIsLoading(true);
    setResponse(null);
    
    const newQuery = {
      text: userQuery,
      timestamp: new Date().toISOString(),
      document: documentName,
      response: null
    };
    
    setQueries(prev => [newQuery, ...prev]);
    
    setTimeout(() => {
      const apiResponse = {
        summary: "Based on your uploaded document and query, here's what we found:",
        details: [
          `Your insurance policy with ${searchQuery || 'your provider'} covers comprehensive protection.`,
          "Your deductible is $500 for collision and $100 for comprehensive.",
          "Policy renewal date: December 15, 2023.",
          "You have roadside assistance included in your plan."
        ],
        suggestions: [
          "Consider increasing your liability coverage for better protection.",
          "You might save 15% by bundling with home insurance."
        ]
      };
      
      setResponse(apiResponse);
      
      setQueries(prev => {
        const updated = [...prev];
        updated[0].response = apiResponse;
        return updated;
      });
      
      setIsLoading(false);
    }, 2000);
  };

  const handleSelectQuery = (query) => {
    setUserQuery(query.text);
    setDocumentName(query.document || '');
    setResponse(query.response);
    setActiveTab('query');
  };

  const handleDeleteQuery = (index) => {
    setQueries(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        
        <div className={`flex mb-6 rounded-lg p-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <button
            onClick={() => setActiveTab('query')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${activeTab === 'query' ? (darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900 shadow') : (darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-400')}`}
          >
            <div className="flex items-center justify-center space-x-2">
              <FiFileText />
              <span>New Query</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${activeTab === 'history' ? (darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900 shadow') : (darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-400')}`}
          >
            <div className="flex items-center justify-center space-x-2">
              <FiClock />
              <span>Query History</span>
            </div>
          </button>
        </div>

        {activeTab === 'query' ? (
          <>
            
            <div className={`p-6 rounded-xl shadow-lg mb-8 transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h1 className="text-2xl font-bold mb-6 text-center">Insurance Query Assistant</h1>
              
             

              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                <input
                  type="text"
                  placeholder="Insurance type and company name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                />
              </div>

              

              <div className="mb-6">
                <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Upload your insurance document
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-white border-gray-300 hover:bg-gray-50'} transition-colors`}
                  >
                    <FiUpload />
                    <span>Choose PDF</span>
                  </button>
                  <span className={`truncate ${documentName ? (darkMode ? 'text-gray-300' : 'text-gray-700') : (darkMode ? 'text-gray-500' : 'text-gray-400')}`}>
                    {documentName || 'No file selected'}
                  </span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".pdf"
                    className="hidden"
                  />
                </div>
                <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Upload your insurance policy document in PDF format
                </p>
              </div>

              

              <div className="mb-6">
                <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Enter your query
                </label>
                <div className="relative">
                  <textarea
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    placeholder="Ask questions about your coverage, claims, or policy details..."
                    rows="4"
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={!userQuery.trim() || isLoading}
                    className={`absolute right-3 bottom-3 p-2 rounded-full ${!userQuery.trim() || isLoading ? (darkMode ? 'bg-gray-600 text-gray-400' : 'bg-gray-200 text-gray-400') : (darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white')} transition-colors`}
                  >
                    {isLoading ? <FiRefreshCw className="animate-spin" /> : <FiSend />}
                  </button>
                </div>
              </div>
            </div>

            

            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-pulse flex space-x-2">
                  <div className={`w-3 h-3 rounded-full ${darkMode ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
                  <div className={`w-3 h-3 rounded-full ${darkMode ? 'bg-blue-400' : 'bg-blue-500'}`} style={{ animationDelay: '0.2s' }}></div>
                  <div className={`w-3 h-3 rounded-full ${darkMode ? 'bg-blue-400' : 'bg-blue-500'}`} style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}

            {response && !isLoading && (
              <div className={`p-6 rounded-xl shadow-lg mb-8 transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <span className={`w-2 h-2 rounded-full mr-2 ${darkMode ? 'bg-green-400' : 'bg-green-500'}`}></span>
                  Response
                </h2>
                
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Summary:</h3>
                  <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{response.summary}</p>
                  
                  <h3 className="font-semibold mb-2">Policy Details:</h3>
                  <ul className={`space-y-2 mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {response.details.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className={`inline-block w-1.5 h-1.5 rounded-full mt-2 mr-2 ${darkMode ? 'bg-blue-400' : 'bg-blue-500'}`}></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  
                  <h3 className="font-semibold mb-2">Suggestions:</h3>
                  <ul className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {response.suggestions.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className={`inline-block w-1.5 h-1.5 rounded-full mt-2 mr-2 ${darkMode ? 'bg-purple-400' : 'bg-purple-500'}`}></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                  <h4 className="font-medium mb-2">Was this response helpful?</h4>
                  <div className="flex space-x-3">
                    <button className={`px-3 py-1 rounded-md ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white transition-colors`}>
                      Yes
                    </button>
                    <button className={`px-3 py-1 rounded-md ${darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white transition-colors`}>
                      No
                    </button>
                    <button className={`px-3 py-1 rounded-md ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}>
                      Provide Feedback
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <QueryHistory 
            queries={queries}
            onSelectQuery={handleSelectQuery}
            onDeleteQuery={handleDeleteQuery}
            darkMode={darkMode}
          />
        )}

        

        <div className={`p-6 rounded-xl shadow-lg transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className={`p-4 rounded-lg flex flex-col items-center transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
              <span className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'}`}>
                <FiPhone size={20} />
              </span>
              <span>Contact Agent</span>
            </button>
            <button className={`p-4 rounded-lg flex flex-col items-center transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
              <span className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${darkMode ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600'}`}>
                <FiRefreshCw size={20} />
              </span>
              <span>Compare Policies</span>
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`p-4 rounded-lg flex flex-col items-center transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              <span className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${darkMode ? 'bg-green-600 text-white' : 'bg-green-100 text-green-600'}`}>
                <FiClock size={20} />
              </span>
              <span>View Past Queries</span>
            </button>
          </div>
        </div>
      </main>

      
      
      <footer className={`py-6 px-4 mt-12 transition-colors duration-300 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
        <div className="container mx-auto text-center">
          <p>© 2025 InsureEase. All rights reserved.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">FAQ</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default InsuranceQueryApp;
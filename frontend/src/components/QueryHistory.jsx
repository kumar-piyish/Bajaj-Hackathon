import { FiClock, FiSearch, FiX } from 'react-icons/fi';

const QueryHistory = ({ queries, onSelectQuery, onDeleteQuery, darkMode }) => {
  return (
    <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 mb-5 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <FiClock className="mr-2" />
        Past Queries
      </h2>
      
      {queries.length === 0 ? (
        <p className={`text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          No past queries found
        </p>
      ) : (
        <ul className="space-y-3">
          {queries.map((query, index) => (
            <li 
              key={index}
              className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <div 
                className="flex-1 truncate"
                onClick={() => onSelectQuery(query)}
              >
                <div className="flex items-center">
                  <FiSearch className={`mr-2 flex-shrink-0 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className="truncate">{query.text}</span>
                </div>
                <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {new Date(query.timestamp).toLocaleString()}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteQuery(index);
                }}
                className={`p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-200 text-gray-500'}`}
              >
                <FiX />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QueryHistory;
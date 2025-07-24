import { FiFileText, FiClock, FiUser, FiDownload, FiTrash2 } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const ProfilePage = ({ darkMode }) => {
  // Dummy data
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    memberSince: "January 2022"
  }

  const documents = [
    { name: "Health_Insurance_Policy.pdf", date: "2023-05-15", size: "2.4 MB" },
    { name: "Auto_Insurance_Coverage.pdf", date: "2023-03-22", size: "1.8 MB" },
    { name: "Home_Insurance_Details.pdf", date: "2023-01-10", size: "3.2 MB" }
  ]

  const pastQueries = [
    { query: "What's my deductible for auto insurance?", date: "2023-06-15" },
    { query: "Does my policy cover international travel?", date: "2023-05-28" },
    { query: "How to file a claim for water damage?", date: "2023-04-10" }
  ]

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl pt-[102px]">

      <div className={`p-6 rounded-xl shadow-lg mb-8 transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-6">
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{user.email}</p>
            <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Member since {user.memberSince}
            </p>
          </div>
        </div>
      </div>



      <div className={`p-6 rounded-xl shadow-lg mb-8 transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <FiFileText className="mr-2" />
          Your Documents
        </h2>
        
        {documents.length === 0 ? (
          <p className={`text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No documents uploaded yet
          </p>
        ) : (
          <div className="space-y-3">
            {documents.map((doc, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
              >
                <div className="flex items-center">
                  <FiFileText className={`mr-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Uploaded on {doc.date} • {doc.size}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-600 text-blue-400' : 'hover:bg-gray-200 text-blue-500'}`}>
                    <FiDownload />
                  </button>
                  <button className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-600 text-red-400' : 'hover:bg-gray-200 text-red-500'}`}>
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      

      
      <div className={`p-6 rounded-xl shadow-lg transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <FiClock className="mr-2" />
          Past Queries
        </h2>
        
        {pastQueries.length === 0 ? (
          <p className={`text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No past queries found
          </p>
        ) : (
          <div className="space-y-3">
            {pastQueries.map((query, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} transition-colors cursor-pointer`}
              >
                <div className="flex items-center">
                  <FiClock className={`mr-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <div>
                    <p className="font-medium">{query.query}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Asked on {query.date}
                    </p>
                  </div>
                </div>
                <Link 
                  to="/" 
                  className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-600 text-blue-400' : 'hover:bg-gray-200 text-blue-500'}`}
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default ProfilePage
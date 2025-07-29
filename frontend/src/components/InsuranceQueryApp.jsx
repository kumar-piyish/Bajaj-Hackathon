// src/components/InsuranceQueryApp.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
  FiUpload, FiSend, FiRefreshCw,
} from 'react-icons/fi';
import QueryHistory from './QueryHistory';
import ReactMarkdown from 'react-markdown';

const InsuranceQueryApp = ({ darkMode, token }) => {
  const [documentName, setDocumentName] = useState('');
  const [documentId, setDocumentId] = useState(null);
  const [userQuery, setUserQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [activeTab, setActiveTab] = useState('query');
  const [queries, setQueries] = useState(() => {
    const saved = localStorage.getItem('insuranceQueries');
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
  const savedDocId = localStorage.getItem('lastUploadedDocId');
  const savedDocName = localStorage.getItem('lastUploadedDocName');
  if (savedDocId) setDocumentId(savedDocId);
  if (savedDocName) setDocumentName(savedDocName);
}, []);

  const fileInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('insuranceQueries', JSON.stringify(queries));
  }, [queries]);

  const handlePDFUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setDocumentName(file.name);

    const form = new FormData();
    form.append('document', file);

    try {
      const res = await fetch('http://localhost:8000/upload-pdf', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data = await res.json();
      setDocumentId(data.document_id);
      setDocumentId(data.document_id);
localStorage.setItem('lastUploadedDocId', data.document_id);
localStorage.setItem('lastUploadedDocName', file.name);

    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload PDF');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userQuery.trim() || !documentId) {
      alert('Please upload a PDF and enter your query.');
      return;
    }
    setIsLoading(true);
    setResponse(null);

    try {
      const res = await fetch('http://localhost:8000/process-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ document_id: documentId, query: userQuery }),
      });
      const { answer, query_id } = await res.json();

      const apiResponse = {
        summary: answer,
        details: [],
        suggestions: [],
        queryId: query_id,
      };
      setResponse(apiResponse);

      const newQuery = {
        text: userQuery,
        document: documentName,
        response: apiResponse,
        timestamp: new Date().toISOString(),
      };
      setQueries(prev => [newQuery, ...prev]);
    } catch (err) {
      console.error('Query error:', err);
      alert('Failed to process query');
    } finally {
      setIsLoading(false);
    }
  };

  const sendFeedback = async (type) => {
     console.log("👍 Button clicked:", type);
    
    try {
      const res = await fetch("http://localhost:8000/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query_id: response.queryId,
          feedback: type,
        }),
      });
      const data = await res.json();
      alert(data.message);
    } catch (err) {
      console.error("Feedback error:", err);
      alert("Failed to send feedback");
    }
  };

  const handleSelectQuery = (q) => {
    setUserQuery(q.text);
    setDocumentName(q.document);
    setResponse(q.response);
    setActiveTab('query');
  };
  const handleDeleteQuery = (i) => {
    setQueries(prev => prev.filter((_, idx) => idx !== i));
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 pt-[72px] ${
      darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
    }`}>
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className={`flex mb-6 rounded-lg p-1 ${
          darkMode ? 'bg-gray-700' : 'bg-gray-200'
        }`}>
          <button
            onClick={() => setActiveTab('query')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab==='query'
                ? (darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900 shadow')
                : (darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-400')
            }`}
          >New Query</button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab==='history'
                ? (darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900 shadow')
                : (darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-400')
            }`}
          >History</button>
        </div>

        {activeTab==='query' ? (
          <>
            <div className={`p-6 rounded-xl shadow-lg mb-8 transition-colors duration-300 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h1 className="text-2xl font-bold mb-6 text-center">Insurance Query Assistant</h1>

              {/* PDF Upload */}
              <div className="mb-6">
                <label className={`block mb-2 font-medium ${darkMode?'text-gray-300':'text-gray-700'}`}>
                  Upload Policy PDF
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={()=>fileInputRef.current.click()}
                    className={`px-4 py-3 rounded-lg border ${
                      darkMode?'bg-gray-700 border-gray-600':'bg-white border-gray-300'
                    }`}
                  >Choose PDF</button>
                  <span>{documentName||'No file selected'}</span>
                  <input
                    type="file" accept="application/pdf"
                    ref={fileInputRef} onChange={handlePDFUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Query Input */}
              <div className="mb-6">
                <label className={`block mb-2 font-medium ${darkMode?'text-gray-300':'text-gray-700'}`}>
                  Enter Your Question
                </label>
                <div className="relative">
                  <textarea
                    rows="4"
                    value={userQuery}
                    onChange={e=>setUserQuery(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode?'bg-gray-700 border-gray-600 text-white':'bg-white border-gray-300'
                    }`}
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={!userQuery||!documentId||isLoading}
                    className={`absolute right-3 bottom-3 p-2 rounded-full ${
                      isLoading
                        ? (darkMode?'bg-gray-600 text-gray-400':'bg-gray-200 text-gray-400')
                        : (darkMode?'bg-blue-600 hover:bg-blue-700':'bg-blue-500 hover:bg-blue-600')
                    } text-white`}
                  >
                    {isLoading ? <FiRefreshCw className="animate-spin"/> : <FiSend/>}
                  </button>
                </div>
              </div>
            </div>

            {/* Response */}
            {response && !isLoading && (
              <div className={`p-6 rounded-xl shadow-lg mb-8 ${
                darkMode?'bg-gray-800':'bg-white'
              }`}>
                <h2 className="text-xl font-bold mb-4">Response</h2>
          <div className="markdown-body">
  <ReactMarkdown>{response.summary}</ReactMarkdown>
</div>



                <div className="flex gap-4 mt-4 text-2xl">
                  <button onClick={() => sendFeedback('up')}>👍</button>
                  <button onClick={() => sendFeedback('down')}>👎</button>
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
      </main>
    </div>
  );
};

export default InsuranceQueryApp;

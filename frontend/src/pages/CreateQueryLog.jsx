import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateQueryLog = () => {
  const navigate = useNavigate();

  // Form state
  const [conversationHistory, setConversationHistory] = useState([{ user: '', bot: '' }]);
  const [userQuestion, setUserQuestion] = useState('');
  const [botAnswer, setBotAnswer] = useState('');
  const [context, setContext] = useState({ location: '', userLanguage: '', sessionID: '' });
  
  const [error, setError] = useState(null);

  // Function to handle the submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Automatically calculate timestamp
    const timestamp = new Date().toISOString();

    // Payload structure
    const newQueryLog = {
      conversationHistory,
      userQuestion,
      BotAnswer: botAnswer,
      context: {
        ...context,
        timestamp, // Add the calculated timestamp to context
      },
    };

    try {
      await axios.post('http://localhost:5555/querylogs', newQueryLog);
      navigate('/'); // Redirect to home after successful creation
    } catch (err) {
      console.error(err);
      setError('Failed to create query log. Please try again.');
    }
  };

  // Handle adding new conversation history
  const handleAddConversation = () => {
    setConversationHistory([...conversationHistory, { user: '', bot: '' }]);
  };

  // Handle changes in the conversation history fields
  const handleConversationChange = (index, field, value) => {
    const updatedHistory = [...conversationHistory];
    updatedHistory[index][field] = value;
    setConversationHistory(updatedHistory);
  };

  // Handle context field change
  const handleContextChange = (field, value) => {
    setContext({ ...context, [field]: value });
  };

  // Handle Back button click to navigate to Home
  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Create New Query Log</h1>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* User Question */}
        <div>
          <label className="block font-semibold mb-1">User Question:</label>
          <input 
            type="text" 
            className="w-full p-2 border border-gray-300 rounded"
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)} 
            required
          />
        </div>

        {/* Bot Answer */}
        <div>
          <label className="block font-semibold mb-1">Bot Answer:</label>
          <input 
            type="text" 
            className="w-full p-2 border border-gray-300 rounded"
            value={botAnswer}
            onChange={(e) => setBotAnswer(e.target.value)} 
            required
          />
        </div>

        {/* Conversation History */}
        <div>
          <label className="block font-semibold mb-1">Conversation History:</label>
          {conversationHistory.map((entry, index) => (
            <div key={index} className="space-y-2 mb-2">
              <div>
                <input 
                  type="text" 
                  placeholder={`User input ${index + 1}`} 
                  value={entry.user}
                  onChange={(e) => handleConversationChange(index, 'user', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                  required
                />
              </div>
              <div>
                <input 
                  type="text" 
                  placeholder={`Bot response ${index + 1}`} 
                  value={entry.bot}
                  onChange={(e) => handleConversationChange(index, 'bot', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                  required
                />
              </div>
            </div>
          ))}
          <button 
            type="button" 
            onClick={handleAddConversation}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Add More Conversation
          </button>
        </div>

        {/* Context */}
        <div>
          <label className="block font-semibold mb-1">Context:</label>
          <div className="space-y-2">
            <input 
              type="text" 
              placeholder="Location" 
              value={context.location}
              onChange={(e) => handleContextChange('location', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <input 
              type="text" 
              placeholder="User Language" 
              value={context.userLanguage}
              onChange={(e) => handleContextChange('userLanguage', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <input 
              type="text" 
              placeholder="Session ID" 
              value={context.sessionID}
              onChange={(e) => handleContextChange('sessionID', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="bg-green-500 text-white py-2 px-4 rounded"
        >
          Create Query Log
        </button>

        {/* Back Button */}
        <button 
          type="button" 
          onClick={handleBackClick} 
          className="bg-gray-500 text-white py-2 px-4 rounded ml-4"
        >
          Back
        </button>
      </form>
    </div>
  );
};

export default CreateQueryLog;

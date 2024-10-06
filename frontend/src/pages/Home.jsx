import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';
import { MdOutlineAddBox } from 'react-icons/md';
import { MdOutlineCheckCircle } from 'react-icons/md'; // Import the evaluation icon

const Home = () => {
  const [queryLogs, setQueryLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5555/querylogs')
      .then((response) => {
        setQueryLogs(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  return (
    <div className='p-4 flex flex-col min-h-screen'>
      <h1 className='text-3xl my-8'>Query Log List</h1>

      {loading ? (
        <Spinner />
      ) : (
        <table className='w-full border-separate border-spacing-2 flex-grow'>
          <thead>
            <tr>
              <th className='border border-slate-600 rounded-md'>No</th>
              <th className='border border-slate-600 rounded-md'>Conversation History</th>
              <th className='border border-slate-600 rounded-md max-md:hidden'>User Question</th>
              <th className='border border-slate-600 rounded-md max-md:hidden'>Bot Answer</th>
              <th className='border border-slate-600 rounded-md max-md:hidden'>Context</th>
              <th className='border border-slate-600 rounded-md'>Actions</th> {/* Added Actions column */}
            </tr>
          </thead>
          <tbody>
            {queryLogs.map((queryLog, index) => (
              <tr key={queryLog._id} className='h-auto'>
                <td className='border border-slate-700 rounded-md text-center'>{index + 1}</td>

                {/* Render all conversation history */}
                <td className='border border-slate-700 rounded-md text-left'>
                  <ul className="list-disc ml-4">
                    {queryLog.conversationHistory.map((entry, idx) => (
                      <li key={idx}>
                        <strong>User:</strong> {entry.user} <br />
                        <strong>Bot:</strong> {entry.bot}
                      </li>
                    ))}
                  </ul>
                </td>

                <td className='border border-slate-700 rounded-md text-center'>
                  {queryLog.userQuestion}
                </td>
                <td className='border border-slate-700 rounded-md text-center'>
                  {queryLog.BotAnswer}
                </td>

                {/* Render context in a more structured way */}
                <td className='border border-slate-700 rounded-md'>
                  <div>
                    {Object.entries(queryLog.context).map(([key, value]) => (
                      <div key={key}>
                        <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
                      </div>
                    ))}
                  </div>
                </td>

                {/* Added Evaluate button */}
                <td className='border border-slate-700 rounded-md text-center'>
                  <Link to={`/querylog/evaluate/${queryLog._id}`}>
                    <button className='bg-green-500 text-white py-1 px-2 rounded-md flex items-center'>
                      <MdOutlineCheckCircle className='text-xl mr-1' />
                      Evaluate
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Button at the bottom */}
      <div className='flex justify-center mt-8'>
        <Link to='/querylog/create'>
          <button className='bg-blue-500 text-white py-2 px-4 rounded-md flex items-center'>
            <MdOutlineAddBox className='text-2xl mr-2' />
            Create Query Log
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;

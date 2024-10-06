import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const EvaluateLog = () => {
  const { id } = useParams(); // Get the query log ID from the URL
  const [loading, setLoading] = useState(true);
  const [queryLog, setQueryLog] = useState(null);
  const [evaluationResults, setEvaluationResults] = useState(null);
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const navigate = useNavigate();

  // Metrics options for the user to select
  const metricsOptions = [
    'Question Clarity',
    'Answer Relevance',
    'Grammar and Fluency',
    'Conciseness',
    'Contextual Understanding'
  ];

  // Fetch the specific query log data (from your Node.js backend)
  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5555/querylogs/evaluate/${id}`)
      .then((response) => {
        setQueryLog(response.data);  // Assumes the API responds with `data` object
        setLoading(false);
      })
      .catch((error) => {
        console.log('Error fetching the query log:', error);
        setLoading(false); // Even if there's an error, disable the spinner
      });
  }, [id]);

  // Handle checkbox changes for metrics
  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    setSelectedMetrics((prevSelected) =>
      prevSelected.includes(value)
        ? prevSelected.filter((metric) => metric !== value)
        : [...prevSelected, value]
    );
  };

  // Handle form submission and render evaluation results
  const handleSubmit = (event) => {
    event.preventDefault();

    // Submit the selected metrics to your API
    axios.post(`http://localhost:5555/querylogs/evaluate/${id}`, { metrics: selectedMetrics })
      .then(response => {
        console.log("Evaluation submitted successfully");
        setEvaluationResults(response.data.evaluationResults); // Store the evaluation results in state
      })
      .catch(error => {
        console.error("Error submitting the evaluation:", error);
      });
  };

  // If loading, show spinner
  if (loading) {
    return <Spinner />;
  }

  // Fallback content if the API response is empty
  if (!queryLog) {
    return (
      <div className="p-4">
        <h2 className="text-2xl mb-4">Error: No data found for this query log</h2>
      </div>
    );
  }

  // Prepare data for the chart if evaluation results are available
  const chartData = {
    labels: metricsOptions,
    datasets: [
      {
        label: 'Evaluation Scores',
        data: metricsOptions.map(metric => 
          evaluationResults && evaluationResults[metric]?.score !== "" 
            ? evaluationResults[metric]?.score 
            : 0 // Use 0 for metrics not evaluated
        ),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        }
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl my-4">Evaluate Query Log</h1>
      <h2 className="text-xl my-2">User Question: {queryLog.userQuestion || 'N/A'}</h2>
      <h2 className="text-xl my-2">Bot Answer: {queryLog.BotAnswer || 'N/A'}</h2>
      
      {/* Displaying context */}
      <h2 className="text-xl my-2">Context:</h2>
      <div className="mb-4">
        {queryLog.context ? (
          Object.entries(queryLog.context).map(([key, value]) => (
            <div key={key}>
              <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
            </div>
          ))
        ) : (
          <p>No context available</p>
        )}
      </div>

      {/* Metrics selection form */}
      <form onSubmit={handleSubmit}>
        <h2 className="text-lg my-2">Select Metrics for Evaluation:</h2>
        <div className="flex flex-col">
          {metricsOptions.map((metric) => (
            <label key={metric} className="flex items-center">
              <input
                type="checkbox"
                value={metric}
                checked={selectedMetrics.includes(metric)}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              {metric}
            </label>
          ))}
        </div>

        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md mt-4">
          Submit Evaluation
        </button>
      </form>

      {/* Render the chart if evaluation results are available */}
      {evaluationResults && (
        <div className="my-4">
          <h2 className="text-lg mb-2">Evaluation Results Chart:</h2>
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default EvaluateLog;

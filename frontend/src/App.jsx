import { useState, useEffect } from 'react';
// Import the API function
import { getItems, API_BASE_URL } from './api'; 

import './App.css'; 

function App() {
  const [data, setData] = useState(null); // State to hold fetched data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to handle the asynchronous data fetching
    const fetchApiData = async () => {
      try {
        const items = await getItems();
        setData(items);
        setError(null);
      } catch (err) {
        // If the fetch fails completely (e.g., DNS error or total server outage)
        setError("Failed to fetch data from API. Check server status or URL.");
        console.error("Fetching error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApiData();
  }, []); // Run only once after the component mounts

  return (
    <div className="App">
      <h1>Fullstack Application Status</h1>
      
      {loading && <p>Loading data from live backend ({API_BASE_URL})...</p>}
      {error && <p className="error" style={{color: 'red'}}>ERROR: {error}</p>}

      {/* Conditional rendering based on data status */}
      {!loading && data && data.length > 0 ? (
        <div className="data-display">
          <h2>✅ Backend Connection Successful!</h2>
          <p>Data received from the live Render API:</p>
          <ul>
            {data.map((item, index) => (
              <li key={index}>** Item {index + 1}: ** {item.title}</li>
            ))}
          </ul>
          <p>This confirms your **Frontend** is talking to your live **Render Backend**!</p>
        </div>
      ) : (
        !loading && !error && (
            <p>
                Backend is live, but returned an empty list of items. 
                <br/>
                (Check your database/code to ensure items are being created.)
            </p>
        )
      )}
      
      <hr />
      {/* Retain the original counter and logos for local development context */}
      <p>Local Vite Development Server is running. (No longer fetching data)</p>
    </div>
  );
}

export default App;
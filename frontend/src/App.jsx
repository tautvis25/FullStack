import { useState, useEffect } from 'react';
import { getItems, createItem } from './api'; // Import your API functions
import './App.css'; // Your CSS file (now contains Tailwind directives)

function App() {
  // State to hold the list of items fetched from the API
  const [items, setItems] = useState([]);
  
  // State for the new item form input
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  
  // State to handle loading and error messages
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- FUNCTION TO FETCH DATA ---
  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await getItems(); // Call the GET function from api.js
      setItems(data);
      setError(null);
    } catch (err) {
      console.error("API Fetch Error:", err);
      setError("Failed to fetch data from the API. Check the console for details.");
      setItems([]); // Clear items on error
    } finally {
      setLoading(false);
    }
  };

  // --- useEffect: Runs once on component mount to fetch data ---
  useEffect(() => {
    fetchItems();
  }, []); // The empty array [] ensures this runs only once

  // --- FUNCTION TO HANDLE FORM SUBMISSION ---
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the browser's default form submission
    
    // Simple validation
    if (!newItemTitle.trim()) {
      // NOTE: Using standard alert for quick feedback in the current context
      alert("Please enter a title.");
      return;
    }

    const newItem = {
      title: newItemTitle,
      description: newItemDescription || null, // FastAPI expects null for optional
    };

    try {
      await createItem(newItem); // Call the POST function from api.js
      setNewItemTitle('');       // Clear form fields
      setNewItemDescription('');
      
      // After successfully creating an item, refresh the list:
      await fetchItems(); 
    } catch (err) {
      console.error("API Create Error:", err);
      // NOTE: Using standard alert for quick feedback in the current context
      alert("Failed to create item. Check the console for API error details.");
    }
  };

  // --- JSX RENDER LOGIC (MODERNIZED WITH TAILWIND) ---

  // Error and Loading states are also styled to be prominent and centered
  if (loading) return <h1 className="text-2xl font-bold text-blue-600 text-center mt-10 p-4">Loading Items...</h1>;
  if (error) return <h1 className="text-2xl font-bold text-red-600 text-center mt-10 p-4">Error: {error}</h1>;

  return (
    // The main div ensures the page fills the screen and has a light background
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans"> 
      
      // THIS CARD is centered using max-w-3xl (max width) and mx-auto (auto margins)
      <div className="max-w-3xl mx-auto bg-white p-6 md:p-10 rounded-xl shadow-2xl">
        
        <header className="mb-8 border-b pb-4">
          <h1 className="text-4xl font-extrabold text-gray-900">Modern Todo List</h1>
          <p className="text-gray-500 mt-1">Tasks synced live with your Render Backend!</p>
        </header>

        // 1. NEW ITEM FORM (Modernized)
        <form onSubmit={handleSubmit} className="space-y-4 mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <input
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            type="text"
            placeholder="Task Title (e.g., Finish Deployment)"
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            required
          />
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 resize-none"
            placeholder="Detailed description (Optional)"
            value={newItemDescription}
            onChange={(e) => setNewItemDescription(e.target.value)}
          />
          <button 
            type="submit" 
            className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-200"
          >
            Add New Task
          </button>
        </form>

        <hr className="my-6 border-gray-200" />

        // 2. LIST DISPLAY (Modern Card Style)
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">{items.length} Items Found:</h2>
        {items.length === 0 ? (
          <p className="text-center text-gray-500 p-10 border border-dashed rounded-lg">
            No items in the database yet. Add one above!
          </p>
        ) : (
          <ul className="space-y-4">
            {items.map((item, index) => (
              <li key={item.id || index} className="p-4 bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
                <h3 className="text-xl font-bold text-gray-800 mb-1">{item.title}</h3>
                <p className="text-gray-600 italic">
                  {item.description || 'No description provided.'}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;

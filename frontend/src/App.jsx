import { useState, useEffect } from 'react';
import { getItems, createItem } from './api'; // Import your API functions
import './App.css'; // Your existing CSS file

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
      alert("Failed to create item. Check the console for API error details.");
    }
  };

  // --- JSX RENDER LOGIC ---
  if (loading) return <h1>Loading Items...</h1>;
  if (error) return <h1 style={{ color: 'red' }}>Error: {error}</h1>;

  return (
    <div className="app-container">
      <h1>My Fullstack Todo List</h1>

      {/* 1. NEW ITEM FORM */}
      <form onSubmit={handleSubmit} className="item-form">
        <input
          type="text"
          placeholder="New Item Title (Required)"
          value={newItemTitle}
          onChange={(e) => setNewItemTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description (Optional)"
          value={newItemDescription}
          onChange={(e) => setNewItemDescription(e.target.value)}
        />
        <button type="submit">Add Item</button>
      </form>

      <hr />

      {/* 2. LIST DISPLAY */}
      <h2>{items.length} Items Found:</h2>
      {items.length === 0 ? (
        <p>No items in the database yet. Add one above!</p>
      ) : (
        <ul className="item-list">
          {items.map((item, index) => (
            <li key={item.id || index} className="item-card">
              <h3>{item.title}</h3>
              <p>{item.description || 'No description provided.'}</p>
              {/* Note: The key should be item.id when your database provides real IDs */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
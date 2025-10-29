import axios from 'axios';


export const API_BASE_URL = 'https://fullstack-tgaa.onrender.com'; 

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Function to fetch the list of items from your FastAPI backend
export const getItems = async () => {
  try {
    // Assuming your FastAPI endpoint for reading items is located at /items
    const response = await api.get('/items'); 
    return response.data;
  } catch (error) {
    // Log the detailed error (this is where CORS errors will appear)
    console.error("Error fetching items:", error);
    // Return an empty array on failure
    return []; 
  }
};
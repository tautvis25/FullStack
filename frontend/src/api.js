import axios from 'axios';

// Ensure this URL is your LIVE Render URL!
const API_BASE_URL = 'https://fullstack-tgaa.onrender.com';

// 1. GET (Read all items)
export const getItems = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/items`);
        // We know this part works because of your previous test!
        return response.data;
    } catch (error) {
        console.error("Error fetching items:", error);
        throw error;
    }
};

// 2. POST (Create a new item)
// itemData should be an object like: { title: "New Item", description: "Details" }
export const createItem = async (itemData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/items`, itemData);
        // The backend returns the created item or a success message
        return response.data;
    } catch (error) {
        console.error("Error creating item:", error);
        throw error;
    }
};
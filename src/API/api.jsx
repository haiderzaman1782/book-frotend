import axios from "axios";

const API_URL = "http://localhost:8000/books"; // Your FastAPI backend

export const getRecommendations = async (bookId) => {
  try {
    const response = await axios.get(`${API_URL}/recommend/${bookId}`);
    return response.data.recommendations;
  } catch (err) {
    console.error("Error fetching recommendations:", err);
    return [];
  }
};

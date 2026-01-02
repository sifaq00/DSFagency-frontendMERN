import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    return null;
  }
};

export const getContents = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/contents`, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

export const createContent = async (token, newContent) => {
  try {
    const response = await axios.post(`${API_URL}/contents`, newContent, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  } catch (error) {
    console.error('Error creating content:', error);
  }
};

export const updateContent = async (token, id, updatedContent) => {
  try {
    const response = await axios.put(`${API_URL}/contents/${id}`, updatedContent, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  } catch (error) {
    console.error('Error updating content:', error);
  }
};

export const deleteContent = async (token, id) => {
  try {
    await axios.delete(`${API_URL}/contents/${id}`, { headers: { Authorization: `Bearer ${token}` } });
  } catch (error) {
    console.error('Error deleting content:', error);
  }
};

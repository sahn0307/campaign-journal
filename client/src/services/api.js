import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5555/api/v1', // Update with your Flask API URL
  withCredentials: true, // Include cookies in the requests
});

// User authentication
export const signup = (data) => api.post('/signup', data);
export const login = (data) => api.post('/login', data);
export const logout = () => api.delete('/logout');
export const checkSession = () => api.get('/check_session');

// Character endpoints
export const getCharacters = () => api.get('/characters');
export const getCharacterById = (id) => api.get(`/characters/${id}`);
export const createCharacter = (data) => api.post('/characters', data);
export const updateCharacter = (id, data) => api.patch(`/characters/${id}`, data);
export const deleteCharacter = (id) => api.delete(`/characters/${id}`);

// Campaign endpoints
export const getCampaigns = () => api.get('/campaigns');
export const getCampaignById = (id) => api.get(`/campaigns/${id}`);
export const createCampaign = (data) => api.post('/campaigns', data);
export const updateCampaign = (id, data) => api.patch(`/campaigns/${id}`, data);
export const deleteCampaign = (id) => api.delete(`/campaigns/${id}`);

// User profile endpoint
export const getUserProfile = () => api.get('/profile');
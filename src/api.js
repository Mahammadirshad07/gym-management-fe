import axios from 'axios';

// 1. Create a "client" that knows the backend URL
const API = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/', 
});

// 2. Define the functions we can call in our pages

// ADMIN FUNCTIONS
export const loginAdmin = (username, password) => API.post('admin-login/', { username, password });
export const deleteUser = (id) => API.delete(`admin/delete-user/${id}/`); // <-- ADDED THIS
export const createUser = (userData) => API.post('admin/create-user/', userData);
export const getAllUsers = () => API.get('admin/viewdetails/');
export const updateSubscription = (id, data) => API.put(`admin/update-user/${id}/`, data);

// USER FUNCTIONS
export const loginUser = (mobile) => API.post('users/login/', { mobile_number: mobile });
export const getUserDetails = (id) => API.get(`users/${id}/`);
export const updateWeight = (id, weight) => API.patch(`users/update-weight/${id}/`, { weight });

export default API;

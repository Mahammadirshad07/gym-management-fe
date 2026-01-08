import axios from 'axios';

// 1. Create a "client" that knows the backend URL
const API = axios.create({
    // REMOVED "django-admin" and the double slash "//"
    baseURL: 'https://gym-management-be-bai3.onrender.com/api/',
});

// ... rest of your functions stay the same
// ADMIN FUNCTIONS
export const loginAdmin = (username, password) => API.post('admin-login/', { username, password });
export const deleteUser = (id) => API.delete(`admin/delete-user/${id}/`);
export const createUser = (userData) => API.post('admin/create-user/', userData);
export const getAllUsers = () => API.get('admin/viewdetails/');
export const updateSubscription = (id, data) => API.put(`admin/update-user/${id}/`, data);

// USER FUNCTIONS
export const loginUser = (mobile) => API.post('users/login/', { mobile_number: mobile });
export const getUserDetails = (id) => API.get(`users/${id}/`);
export const updateWeight = (id, weight) => API.patch(`users/update-weight/${id}/`, { weight });

export default API;

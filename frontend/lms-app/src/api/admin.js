import API from './axios';

export const getUsers = (params) => API.get('/auth/admin/users/', { params });
export const updateUserRole = (id, role) => API.patch(`/auth/admin/users/${id}/`, { role });
export const updateUserStatus = (id, is_active) => API.patch(`/auth/admin/users/${id}/`, { is_active });

export const getAdminStats = () => API.get('/auth/admin/stats/');

export const getAdminCourses = (params) => API.get('/courses/admin/courses/', { params });
export const toggleCoursePublish = (id) => API.post(`/courses/admin/courses/${id}/toggle_publish/`);
export const deleteCourse = (id) => API.delete(`/courses/admin/courses/${id}/`);

// Category management
export const getCategories = () => API.get('/courses/categories/');
export const createCategory = (data) => API.post('/courses/categories/', data);
export const updateCategory = (id, data) => API.put(`/courses/categories/${id}/`, data);
export const deleteCategory = (id) => API.delete(`/courses/categories/${id}/`);

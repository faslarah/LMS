import API from './axios';

export const getCategories = () => API.get('/courses/categories/');
export const getCourses = (params) => API.get('/courses/', { params });
export const getCourse = (id) => API.get(`/courses/${id}/`);
export const createCourse = (data) => API.post('/courses/', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateCourse = (id, data) => API.put(`/courses/${id}/`, data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateCoursePartial = (id, data) => API.patch(`/courses/${id}/`, data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteCourse = (id) => API.delete(`/courses/${id}/`);

export const enrollCourse = (courseId) => API.post(`/courses/${courseId}/enroll/`);
export const getEnrollments = () => API.get('/courses/enrollments/');
export const getMyEnrollments = () => API.get('/courses/enrollments/');

export const toggleWishlist = (courseId) => API.post(`/courses/${courseId}/toggle_wishlist/`);
export const getWishlists = () => API.get('/courses/wishlists/');
export const submitReview = (data) => API.post('/courses/reviews/', data);
export const toggleSectionProgress = (courseId, sectionId) => API.post(`/courses/${courseId}/toggle_progress/`, { section_id: sectionId });

export const getDiscussions = (courseId) => API.get(`/courses/discussions/?course=${courseId}`);
export const createDiscussion = (courseId, data) => API.post('/courses/discussions/', { course: courseId, ...data });
export const replyDiscussion = (courseId, parentId, data) => API.post('/courses/discussions/', { course: courseId, parent: parentId, ...data });

export const getInstructors = () => API.get('/auth/instructors/');
export const getInstructor = (id) => API.get(`/auth/instructors/${id}/`);

// Curriculum Management
export const createSection = (data, onUploadProgress) => API.post('/courses/sections/', data, {
  headers: { 'Content-Type': 'multipart/form-data' },
  onUploadProgress
});
export const updateSection = (id, data, onUploadProgress) => API.patch(`/courses/sections/${id}/`, data, {
  headers: { 'Content-Type': 'multipart/form-data' },
  onUploadProgress
});
export const deleteSection = (id) => API.delete(`/courses/sections/${id}/`);

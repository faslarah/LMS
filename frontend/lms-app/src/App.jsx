import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import InstructorRoute from './components/InstructorRoute';
import AdminRoute from './components/AdminRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import CourseList from './pages/CourseList';
import CourseCreate from './pages/CourseCreate';
import CourseManage from './pages/CourseManage';

import Dashboard from './pages/Dashboard';
import CourseDetail from './pages/CourseDetail';
import InstructorsList from './pages/InstructorsList';
import InstructorProfile from './pages/InstructorProfile';
import AdminUsers from './pages/AdminUsers';
import AdminDashboard from './pages/AdminDashboard';
import AdminCourses from './pages/AdminCourses';
import AdminCategories from './pages/AdminCategories';
import Navbar from './components/Navbar';
import Layout from './components/Layout';

import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Landing from './pages/Landing';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes with Navbar */}
          <Route path="/" element={<><Navbar /><Landing /></>} />
          <Route path="/login" element={<><Navbar /><Login /></>} />
          <Route path="/register" element={<><Navbar /><Register /></>} />
          
          {/* Authenticated Routes with Sidebar Layout */}
          <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Layout><Profile /></Layout></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Layout><Settings /></Layout></PrivateRoute>} />
          <Route path="/courses" element={<PrivateRoute><Layout><CourseList /></Layout></PrivateRoute>} />
          <Route path="/courses/:id" element={<PrivateRoute><Layout><CourseDetail /></Layout></PrivateRoute>} />
          <Route path="/instructors" element={<PrivateRoute><Layout><InstructorsList /></Layout></PrivateRoute>} />
          <Route path="/instructors/:id" element={<PrivateRoute><Layout><InstructorProfile /></Layout></PrivateRoute>} />
          
          {/* Instructor Routes */}
          <Route path="/courses/create" element={<InstructorRoute><Layout><CourseCreate /></Layout></InstructorRoute>} />
          <Route path="/courses/:id/manage" element={<InstructorRoute><Layout><CourseManage /></Layout></InstructorRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><Layout><AdminDashboard /></Layout></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><Layout><AdminUsers /></Layout></AdminRoute>} />
          <Route path="/admin/courses" element={<AdminRoute><Layout><AdminCourses /></Layout></AdminRoute>} />
          <Route path="/admin/categories" element={<AdminRoute><Layout><AdminCategories /></Layout></AdminRoute>} />
          
          <Route path="*" element={<Navigate to="/courses" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import InstructorRoute from './components/InstructorRoute';
import AdminRoute from './components/AdminRoute';
import NonAdminRoute from './components/NonAdminRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import CourseList from './pages/CourseList';
import CourseCreate from './pages/CourseCreate';
import CourseManage from './pages/CourseManage';

import Dashboard from './pages/Dashboard';
import CourseDetail from './pages/CourseDetail';
import CoursePlayer from './pages/CoursePlayer';
import InstructorsList from './pages/InstructorsList';
import InstructorProfile from './pages/InstructorProfile';
import MyEnrollments from './pages/MyEnrollments';
import AdminUsers from './pages/AdminUsers';
import AdminDashboard from './pages/AdminDashboard';
import AdminHub from './pages/AdminHub';
import AdminCourses from './pages/AdminCourses';
import AdminCategories from './pages/AdminCategories';
import AdminSettings from './pages/AdminSettings';
import Navbar from './components/Navbar';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';

import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Landing from './pages/Landing';
import ApplyInstructor from './pages/ApplyInstructor';
import AdminInstructorApplications from './pages/AdminInstructorApplications';
import Certificate from './pages/Certificate';
import MyCertificates from './pages/MyCertificates';

function RoleBasedRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  return <Navigate to="/courses" replace />;
}

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
          <Route path="/dashboard" element={<NonAdminRoute><Layout><Dashboard /></Layout></NonAdminRoute>} />
          <Route path="/profile" element={<PrivateRoute><Layout><Profile /></Layout></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Layout><Settings /></Layout></PrivateRoute>} />
          <Route path="/courses" element={<NonAdminRoute><Layout><CourseList /></Layout></NonAdminRoute>} />
          <Route path="/courses/:id" element={<NonAdminRoute><Layout><CourseDetail /></Layout></NonAdminRoute>} />
          <Route path="/courses/:id/learn" element={<PrivateRoute><Layout><CoursePlayer /></Layout></PrivateRoute>} />
          <Route path="/enrollments" element={<NonAdminRoute><Layout><MyEnrollments /></Layout></NonAdminRoute>} />
          <Route path="/instructors" element={<NonAdminRoute><Layout><InstructorsList /></Layout></NonAdminRoute>} />
          <Route path="/instructors/:id" element={<NonAdminRoute><Layout><InstructorProfile /></Layout></NonAdminRoute>} />
          <Route path="/apply-instructor" element={<NonAdminRoute><Layout><ApplyInstructor /></Layout></NonAdminRoute>} />
          
          <Route path="/certificates" element={<PrivateRoute><Layout><MyCertificates /></Layout></PrivateRoute>} />
          <Route path="/certificates/:certificateId" element={<PrivateRoute><Certificate /></PrivateRoute>} />
          
          {/* Instructor Routes */}
          <Route path="/courses/create" element={<InstructorRoute><Layout><CourseCreate /></Layout></InstructorRoute>} />
          <Route path="/courses/:id/manage" element={<InstructorRoute><Layout><CourseManage /></Layout></InstructorRoute>} />

          {/* Admin Routes with AdminLayout (No Sidebar) */}
          <Route path="/admin" element={<AdminRoute><AdminLayout><AdminHub /></AdminLayout></AdminRoute>} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
          <Route path="/admin/courses" element={<AdminRoute><AdminLayout><AdminCourses /></AdminLayout></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminLayout><AdminUsers /></AdminLayout></AdminRoute>} />
          <Route path="/admin/applications" element={<AdminRoute><AdminLayout><AdminInstructorApplications /></AdminLayout></AdminRoute>} />
          <Route path="/admin/settings" element={<AdminRoute><AdminLayout><AdminSettings /></AdminLayout></AdminRoute>} />
          
          <Route path="*" element={<RoleBasedRedirect />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
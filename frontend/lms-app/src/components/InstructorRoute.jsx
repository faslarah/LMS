import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const InstructorRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  
  if (!user || (user.role !== 'instructor' && user.role !== 'admin')) {
    return <Navigate to="/courses" />;
  }
  
  return children;
};

export default InstructorRoute;

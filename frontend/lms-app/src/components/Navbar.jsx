import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '16px 40px', 
      backgroundColor: isLanding ? 'transparent' : 'var(--bg-secondary)', 
      borderBottom: isLanding ? 'none' : '1px solid var(--bg-tertiary)',
      position: isLanding ? 'absolute' : 'sticky',
      width: '100%',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <Link to="/" style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', textDecoration: 'none' }}>
          LMS<span style={{ color: 'var(--accent)' }}>Pro</span>
        </Link>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link to="/courses" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500 }}>All Courses</Link>
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {user ? (
          <>
            <Link to="/dashboard" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500 }}>Dashboard</Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                <div style={{ 
                  width: '36px', height: '36px', borderRadius: '50%', 
                  backgroundColor: 'var(--bg-tertiary)', display: 'flex', 
                  alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontWeight: 'bold' 
                }}>
                  {user.first_name?.[0]}
                </div>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {user.first_name} 
                  <span style={{ 
                    marginLeft: '8px', 
                    fontSize: '12px', 
                    padding: '2px 8px', 
                    borderRadius: '12px', 
                    backgroundColor: user.role === 'instructor' ? 'rgba(198, 241, 44, 0.2)' : 'var(--bg-tertiary)', 
                    color: user.role === 'instructor' ? 'var(--accent)' : 'var(--text-primary)',
                    textTransform: 'capitalize'
                  }}>
                    {user.role}
                  </span>
                </span>
              </Link>
            </div>
            <button onClick={handleLogout} style={{ 
              background: 'transparent', border: '1px solid var(--bg-tertiary)', 
              color: 'var(--text-secondary)', padding: '6px 16px', borderRadius: '4px', cursor: 'pointer' 
            }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500 }}>Login</Link>
            <Link to="/register" className="btn-primary" style={{ padding: '8px 20px', textDecoration: 'none', display: 'inline-block' }}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

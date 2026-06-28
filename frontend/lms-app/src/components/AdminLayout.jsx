import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

const IconGraduationCap = ({ size = 20, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21.42 10.922a2 2 0 0 1-.01 2.833l-7.11 7.15a2 2 0 0 1-2.81.01l-7.15-7.11a2 2 0 0 1 .01-2.83l7.11-7.15a2 2 0 0 1 2.81-.01z"/><path d="M22 10v6"/><path d="M6 15v4c0 1.5 2.5 3 6 3s6-1.5 6-3v-4"/></svg>
);

const IconBell = ({ size = 20, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
);

const IconArrowLeft = ({ size = 20, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
);

const IconSettings = ({ size = 20, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
);

const IconLogOut = ({ size = 20, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
);


const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const closeProfile = () => setProfileOpen(false);
    document.addEventListener('click', closeProfile);
    return () => document.removeEventListener('click', closeProfile);
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    window.location.href = '/login';
  };

  const isHub = location.pathname === '/admin' || location.pathname === '/admin/';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--bg-primary)' }}>
      {/* Topbar */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '16px 40px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        backgroundColor: 'rgba(10, 16, 32, 0.7)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        {/* Left Actions / Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--accent)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconGraduationCap size={20} color="#000" />
            </div>
            <span style={{ fontSize: '20px', fontWeight: '600', color: '#fff', letterSpacing: '0.5px' }}>
              SkillHub <span style={{ color: 'var(--text-secondary)', fontWeight: '400' }}>Admin</span>
            </span>
          </Link>

          {!isHub && (
            <>
              <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border)' }}></div>
              <Link to="/admin" style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                color: 'var(--text-secondary)', textDecoration: 'none',
                fontSize: '14px', fontWeight: '500', transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
                <IconArrowLeft size={16} /> Back to Hub
              </Link>
            </>
          )}
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--text-secondary)', 
            cursor: 'pointer',
            position: 'relative'
          }}>
            <IconBell size={20} />
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '8px',
              height: '8px',
              backgroundColor: 'var(--accent)',
              borderRadius: '50%'
            }}></div>
          </button>

          {user && (
            <div style={{ position: 'relative' }}>
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileOpen(!profileOpen);
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              >
                <div style={{ 
                  width: '32px', height: '32px', borderRadius: '50%', 
                  backgroundColor: 'var(--bg-tertiary)', display: 'flex', 
                  alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontWeight: 'bold', fontSize: '14px'
                }}>
                  {user.first_name?.[0]}
                </div>
              </div>

              {profileOpen && (
                <div style={{
                  position: 'absolute',
                  top: '40px',
                  right: '0',
                  width: '200px',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '8px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  zIndex: 101,
                  animation: 'fadeIn 0.2s ease'
                }}>
                  <Link to="/profile" style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px',
                    color: 'var(--text-primary)', textDecoration: 'none', borderRadius: '6px',
                    fontSize: '14px', fontWeight: '500', transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <IconSettings size={16} /> View Profile
                  </Link>
                  <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '4px 0' }} />
                  <button onClick={handleLogout} style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px',
                    color: '#ef4444', textDecoration: 'none', borderRadius: '6px',
                    fontSize: '14px', fontWeight: '500', transition: 'background 0.2s',
                    background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <IconLogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Main Content Area */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          {children}
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// --- Lucide Icons (SVG versions to avoid dependency issues) ---
const IconLayoutDashboard = ({ size = 20, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
);
const IconLibrary = ({ size = 20, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>
);
const IconCompass = ({ size = 20, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
);
const IconBookOpen = ({ size = 20, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
);
const IconClipboardList = ({ size = 20, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>
);
const IconAward = ({ size = 20, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
);
const IconTrendingUp = ({ size = 20, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
);
const IconUsers = ({ size = 20, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const IconMessageSquare = ({ size = 20, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);
const IconBell = ({ size = 20, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
);
const IconSettings = ({ size = 20, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
);
const IconHelpCircle = ({ size = 20, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
);
const IconChevronDown = ({ size = 20, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m6 9 6 6 6-6"/></svg>
);
const IconLogOut = ({ size = 20, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
);
const IconMenu = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
);
const IconGraduationCap = ({ size = 20, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21.42 10.922a2 2 0 0 1-.01 2.833l-7.11 7.15a2 2 0 0 1-2.81.01l-7.15-7.11a2 2 0 0 1 .01-2.83l7.11-7.15a2 2 0 0 1 2.81-.01z"/><path d="M22 10v6"/><path d="M6 15v4c0 1.5 2.5 3 6 3s6-1.5 6-3v-4"/></svg>
);
const IconFolder = ({ size = 20, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>
);
const IconShield = ({ size = 20, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-2 7-2 2.5 0 4.5 1 7 2a1 1 0 0 1 1 1z"/></svg>
);
const IconBriefcase = ({ size = 20, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
);


const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Close profile dropdown when clicking outside (simple implementation by closing on scroll/click elsewhere)
  useEffect(() => {
    const closeProfile = () => setProfileOpen(false);
    document.addEventListener('click', closeProfile);
    return () => document.removeEventListener('click', closeProfile);
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/dashboard' || path === '/admin') return location.pathname === path;
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const renderLink = (path, icon, label) => {
    const active = isActive(path);
    return (
      <Link 
        to={path} 
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 16px',
          margin: '4px 12px',
          borderRadius: '8px',
          textDecoration: 'none',
          color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
          backgroundColor: active ? 'rgba(198, 241, 44, 0.08)' : 'transparent',
          position: 'relative',
          transition: 'all 0.2s ease',
          fontWeight: active ? '600' : '500',
        }}
        onMouseEnter={(e) => {
          if (!active) {
            e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }
        }}
        onMouseLeave={(e) => {
          if (!active) {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }
        }}
      >
        {active && (
          <div style={{
            position: 'absolute',
            left: '-12px',
            top: '50%',
            transform: 'translateY(-50%)',
            height: '24px',
            width: '4px',
            backgroundColor: 'var(--accent)',
            borderRadius: '0 4px 4px 0'
          }} />
        )}
        <span style={{ 
          marginRight: collapsed ? '0' : '12px', 
          display: 'flex', 
          color: active ? 'var(--accent)' : 'inherit',
          transition: 'color 0.2s ease'
        }}>
          {icon}
        </span>
        {!collapsed && <span>{label}</span>}
      </Link>
    );
  };

  const renderSectionLabel = (label) => {
    if (collapsed) return <div style={{ height: '24px' }}></div>;
    return (
      <div style={{ 
        color: 'var(--text-secondary)', 
        fontSize: '11px', 
        fontWeight: '700', 
        letterSpacing: '0.5px',
        margin: '24px 12px 8px 24px',
        opacity: 0.7
      }}>
        {label}
      </div>
    );
  };

  return (
    <div style={{
      width: collapsed ? '80px' : '280px',
      height: '100vh',
      backgroundColor: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 100,
    }}>
      {/* Header / Logo */}
      <div style={{ 
        height: '72px', 
        display: 'flex', 
        alignItems: 'center', 
        padding: collapsed ? '0 16px' : '0 24px',
        justifyContent: collapsed ? 'center' : 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        {!collapsed && (
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--accent)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconGraduationCap size={20} color="#000" />
            </div>
            <span style={{ fontSize: '20px', fontWeight: '600', color: '#fff', letterSpacing: '0.5px' }}>
              SkillHub
            </span>
          </Link>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--text-secondary)', 
            cursor: 'pointer',
            display: 'flex',
            padding: '8px',
            borderRadius: '6px',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <IconMenu />
        </button>
      </div>

      {/* Navigation Links */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '24px', paddingTop: '16px' }} className="sidebar-scroll">
        
        {user?.role === 'admin' ? (
          <>
            {renderSectionLabel('ADMIN')}
            {renderLink('/admin', <IconLayoutDashboard />, 'Dashboard')}
            {renderLink('/admin/applications', <IconBriefcase />, 'Instructor Applications')}
            {renderLink('/admin/courses', <IconLibrary />, 'Manage Courses')}
            {renderLink('/admin/users', <IconShield />, 'Manage Users')}
            {renderLink('/admin/settings', <IconSettings />, 'Settings')}
          </>
        ) : (
          <>
            {renderSectionLabel('MAIN')}
            {renderLink('/dashboard', <IconLayoutDashboard />, 'Dashboard')}
            {renderLink('/courses', <IconLibrary />, 'All Courses')}
            {renderLink('/explore', <IconCompass />, 'Explore')}

            {user?.role === 'instructor' && (
              <>
                {renderSectionLabel('INSTRUCTOR')}
                {renderLink('/instructor/courses', <IconBriefcase />, 'My Courses')}
                {renderLink('/courses/create', <IconLibrary />, 'Create Course')}
              </>
            )}

            {user?.role === 'student' && (
              <>
                {renderSectionLabel('LEARNING')}
                {renderLink('/student/learning', <IconBookOpen />, 'My Learning')}
                {renderLink('/enrollments', <IconClipboardList />, 'My Enrollments')}
                {renderLink('/certificates', <IconAward />, 'Certificates')}
                {renderLink('/progress', <IconTrendingUp />, 'Progress')}
                {renderLink('/apply-instructor', <IconBriefcase />, 'Become an Instructor')}
              </>
            )}

            {(user?.role === 'student' || user?.role === 'instructor') && (
              <>
                {renderSectionLabel('COMMUNITY')}
                {renderLink('/instructors', <IconUsers />, 'Instructors')}
                {renderLink('/discussions', <IconMessageSquare />, 'Discussions')}
                {renderLink('/announcements', <IconBell />, 'Announcements')}
              </>
            )}

            {renderSectionLabel('ACCOUNT')}
            {renderLink('/settings', <IconSettings />, 'Settings')}
            {renderLink('/help', <IconHelpCircle />, 'Help & Support')}
          </>
        )}
      </div>

      {/* User Profile Bottom Area */}
      <div style={{ 
        padding: '16px', 
        borderTop: '1px solid rgba(255,255,255,0.05)',
        position: 'relative'
      }}>
        {/* Dropdown Menu */}
        {profileOpen && (
          <div style={{
            position: 'absolute',
            bottom: '80px',
            left: '16px',
            right: collapsed ? 'auto' : '16px',
            width: collapsed ? '200px' : 'auto',
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

        <div 
          onClick={(e) => {
            e.stopPropagation();
            setProfileOpen(!profileOpen);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px',
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'background 0.2s',
            justifyContent: collapsed ? 'center' : 'space-between',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '36px', height: '36px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--accent)', 
              color: '#000', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontWeight: 'bold',
              flexShrink: 0
            }}>
              {user?.first_name?.[0] || 'U'}
            </div>
            {!collapsed && (
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {user?.first_name} {user?.last_name}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                  {user?.role || 'Student'}
                </div>
              </div>
            )}
          </div>
          {!collapsed && <IconChevronDown size={16} color="var(--text-secondary)" />}
        </div>
      </div>

      <style>{`
        .sidebar-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: transparent;
          border-radius: 4px;
        }
        .sidebar-scroll:hover::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Sidebar;

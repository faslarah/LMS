import React from 'react';
import { useNavigate } from 'react-router-dom';

const IconLayoutDashboard = ({ size = 32, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
);

const IconBriefcase = ({ size = 32, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
);

const IconLibrary = ({ size = 32, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>
);

const IconShield = ({ size = 32, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-2 7-2 2.5 0 4.5 1 7 2a1 1 0 0 1 1 1z"/></svg>
);

const IconSettings = ({ size = 32, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
);


const AdminHub = () => {
  const navigate = useNavigate();

  const modules = [
    {
      title: 'Dashboard',
      description: 'Platform statistics and analytics',
      icon: <IconLayoutDashboard />,
      path: '/admin/dashboard',
      color: '#3B82F6',
      bg: 'rgba(59, 130, 246, 0.1)'
    },
    {
      title: 'Instructor Applications',
      description: 'Review and approve instructor requests',
      icon: <IconBriefcase />,
      path: '/admin/applications',
      color: '#EAB308',
      bg: 'rgba(234, 179, 8, 0.1)'
    },
    {
      title: 'Manage Courses',
      description: 'Manage courses, categories and approvals',
      icon: <IconLibrary />,
      path: '/admin/courses',
      color: '#10B981',
      bg: 'rgba(16, 185, 129, 0.1)'
    },
    {
      title: 'Manage Users',
      description: 'Manage students, instructors and admins',
      icon: <IconShield />,
      path: '/admin/users',
      color: '#8B5CF6',
      bg: 'rgba(139, 92, 246, 0.1)'
    },
    {
      title: 'Settings',
      description: 'Platform configuration and policies',
      icon: <IconSettings />,
      path: '/admin/settings',
      color: '#64748B',
      bg: 'rgba(100, 116, 139, 0.1)'
    }
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '40px' }}>
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '16px' }}>Admin Control Center</h1>
        <p style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>Select a module to manage your platform.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px'
      }}>
        {modules.map((mod, index) => (
          <div 
            key={index}
            className="card module-card"
            onClick={() => navigate(mod.path)}
            style={{
              padding: '32px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.05)'
            }}
          >
            <div style={{
              width: '64px', height: '64px',
              borderRadius: '16px',
              backgroundColor: mod.bg,
              color: mod.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
              transition: 'transform 0.3s ease'
            }} className="module-icon">
              {mod.icon}
            </div>
            
            <h3 style={{ fontSize: '20px', margin: '0 0 12px 0', color: 'var(--text-primary)' }}>{mod.title}</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
              {mod.description}
            </p>
            
            <div className="module-action" style={{
              marginTop: '24px',
              padding: '8px 24px',
              borderRadius: '24px',
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: '500',
              opacity: 0,
              transform: 'translateY(10px)',
              transition: 'all 0.3s ease'
            }}>
              Open Module →
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .module-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255,255,255,0.1) !important;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
          background-color: var(--bg-secondary) !important;
        }
        
        .module-card:hover .module-icon {
          transform: scale(1.1);
        }
        
        .module-card:hover .module-action {
          opacity: 1 !important;
          transform: translateY(0) !important;
          background-color: var(--accent) !important;
          color: #000 !important;
        }
      `}</style>
    </div>
  );
};

export default AdminHub;

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  
  // Preferences State
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('english');
  
  // Privacy State
  const [publicProfile, setPublicProfile] = useState(true);
  const [showActivity, setShowActivity] = useState(true);

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('preferences'); // preferences, privacy, security

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setMessage('Settings saved successfully!');
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }, 800);
  };

  const ToggleSwitch = ({ checked, onChange }) => (
    <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
      <input 
        type="checkbox" 
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ opacity: 0, width: 0, height: 0 }} 
      />
      <span style={{
        position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: checked ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
        transition: '.4s', borderRadius: '24px'
      }}>
        <span style={{
          position: 'absolute', content: '""', height: '16px', width: '16px',
          left: checked ? '28px' : '4px', bottom: '4px',
          backgroundColor: checked ? '#050816' : '#fff',
          transition: '.4s', borderRadius: '50%'
        }}></span>
      </span>
    </label>
  );

  const SettingRow = ({ title, description, control }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', padding: '16px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div>
        <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>{title}</div>
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{description}</div>
      </div>
      <div>{control}</div>
    </div>
  );

  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '36px', marginBottom: '32px' }}>Settings</h1>
      
      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        
        {/* Settings Sidebar Navigation */}
        <div className="glass-card" style={{ flex: '0 0 200px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            onClick={() => setActiveTab('preferences')}
            style={{ 
              background: activeTab === 'preferences' ? 'rgba(184, 255, 59, 0.1)' : 'transparent',
              color: activeTab === 'preferences' ? 'var(--accent)' : 'var(--text-secondary)',
              border: 'none', padding: '12px 16px', borderRadius: '8px', textAlign: 'left',
              fontWeight: activeTab === 'preferences' ? '600' : '500', cursor: 'pointer', transition: 'all 0.2s'
            }}>
            Preferences
          </button>
          <button 
            onClick={() => setActiveTab('privacy')}
            style={{ 
              background: activeTab === 'privacy' ? 'rgba(184, 255, 59, 0.1)' : 'transparent',
              color: activeTab === 'privacy' ? 'var(--accent)' : 'var(--text-secondary)',
              border: 'none', padding: '12px 16px', borderRadius: '8px', textAlign: 'left',
              fontWeight: activeTab === 'privacy' ? '600' : '500', cursor: 'pointer', transition: 'all 0.2s'
            }}>
            Privacy
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            style={{ 
              background: activeTab === 'security' ? 'rgba(184, 255, 59, 0.1)' : 'transparent',
              color: activeTab === 'security' ? 'var(--accent)' : 'var(--text-secondary)',
              border: 'none', padding: '12px 16px', borderRadius: '8px', textAlign: 'left',
              fontWeight: activeTab === 'security' ? '600' : '500', cursor: 'pointer', transition: 'all 0.2s'
            }}>
            Security
          </button>
        </div>

        {/* Settings Content Area */}
        <div style={{ flex: '1' }}>
          <form onSubmit={handleSave} className="glass-card animate-fade-in" style={{ padding: '32px', border: '1px solid rgba(184, 255, 59, 0.15)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            
            {activeTab === 'preferences' && (
              <>
                <h3 style={{ marginBottom: '24px', fontSize: '20px', color: 'var(--text-primary)' }}>Preferences</h3>
                
                <h4 style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>Appearance</h4>
                <SettingRow 
                  title="Theme" 
                  description="Choose your preferred color theme."
                  control={
                    <select className="input-field" value={theme} onChange={(e) => setTheme(e.target.value)} style={{ width: '120px' }}>
                      <option value="dark">Dark Mode</option>
                      <option value="light">Light Mode</option>
                      <option value="system">System</option>
                    </select>
                  }
                />
                <SettingRow 
                  title="Language" 
                  description="Select your preferred language."
                  control={
                    <select className="input-field" value={language} onChange={(e) => setLanguage(e.target.value)} style={{ width: '120px' }}>
                      <option value="english">English</option>
                      <option value="spanish">Spanish</option>
                      <option value="french">French</option>
                    </select>
                  }
                />

                <h4 style={{ marginTop: '32px', marginBottom: '16px', color: 'var(--text-secondary)' }}>Notifications</h4>
                <SettingRow 
                  title="Push Notifications" 
                  description="Receive alerts for course updates and messages."
                  control={<ToggleSwitch checked={notifications} onChange={setNotifications} />}
                />
                <SettingRow 
                  title="Email Updates" 
                  description="Weekly newsletters and promotional emails."
                  control={<ToggleSwitch checked={emailUpdates} onChange={setEmailUpdates} />}
                />
              </>
            )}

            {activeTab === 'privacy' && (
              <>
                <h3 style={{ marginBottom: '24px', fontSize: '20px', color: 'var(--text-primary)' }}>Privacy Settings</h3>
                <SettingRow 
                  title="Public Profile" 
                  description="Allow others to view your profile and achievements."
                  control={<ToggleSwitch checked={publicProfile} onChange={setPublicProfile} />}
                />
                <SettingRow 
                  title="Show Learning Activity" 
                  description="Display your recently completed courses on your profile."
                  control={<ToggleSwitch checked={showActivity} onChange={setShowActivity} />}
                />
              </>
            )}

            {activeTab === 'security' && (
              <>
                <h3 style={{ marginBottom: '24px', fontSize: '20px', color: 'var(--text-primary)' }}>Security & Password</h3>
                
                <div style={{ marginBottom: '24px' }}>
                  <label className="label">Current Password</label>
                  <input 
                    type="password" 
                    className="input-field" 
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                
                <div style={{ marginBottom: '32px' }}>
                  <label className="label">New Password</label>
                  <input 
                    type="password" 
                    className="input-field" 
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div style={{ padding: '16px', backgroundColor: 'rgba(255, 71, 87, 0.05)', border: '1px solid rgba(255, 71, 87, 0.2)', borderRadius: '8px' }}>
                  <h4 style={{ color: '#ff4757', marginBottom: '8px' }}>Danger Zone</h4>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button type="button" style={{ background: 'transparent', border: '1px solid #ff4757', color: '#ff4757', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Delete Account
                  </button>
                </div>
              </>
            )}
            
            {message && (
              <div style={{ marginTop: '24px', padding: '16px', borderRadius: '8px', backgroundColor: message.includes('success') ? 'rgba(184, 255, 59, 0.1)' : 'rgba(255, 71, 87, 0.1)', color: message.includes('success') ? 'var(--accent)' : '#ff4757', border: `1px solid ${message.includes('success') ? 'rgba(184, 255, 59, 0.3)' : 'rgba(255, 71, 87, 0.3)'}`, textAlign: 'center', fontWeight: '500' }}>
                {message}
              </div>
            )}

            <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn-primary" style={{ padding: '12px 32px' }} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;

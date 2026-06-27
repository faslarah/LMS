import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div>
      <div 
        style={{ 
          height: '100vh', 
          width: '100%',
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          padding: '0 20px',
          backgroundImage: 'linear-gradient(rgba(13, 13, 17, 0.7), rgba(13, 13, 17, 0.9)), url("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h1 
          style={{ 
            fontSize: '64px', 
            fontWeight: '700', 
            maxWidth: '800px', 
            marginBottom: '24px',
            color: '#ffffff',
            lineHeight: '1.2'
          }}
        >
          Learn skills that actually move you forward.
        </h1>
        <p 
          style={{ 
            fontSize: '20px', 
            color: 'var(--text-secondary)', 
            maxWidth: '600px', 
            marginBottom: '40px',
            lineHeight: '1.6'
          }}
        >
          Explore new skills, follow clear learning paths, and grow at your own pace without pressure.
        </p>
        <Link 
          to="/courses" 
          className="btn-primary" 
          style={{ 
            padding: '16px 40px', 
            fontSize: '18px', 
            borderRadius: '30px', 
            textDecoration: 'none',
            display: 'inline-block'
          }}
        >
          Explore Courses
        </Link>
      </div>
      
      <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '60px 20px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginBottom: '32px', fontWeight: '500' }}>
          Our learners work at leading companies
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px', flexWrap: 'wrap', opacity: 0.6 }}>
          <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>Google</span>
          <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>Spotify</span>
          <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>Meta</span>
          <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>Amazon</span>
        </div>
      </div>
    </div>
  );
};

export default Landing;

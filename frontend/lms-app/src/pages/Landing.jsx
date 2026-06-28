import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Hero Section */}
      <div 
        style={{ 
          minHeight: 'calc(100vh - 80px)', 
          width: '100%',
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          padding: '0 20px',
          background: 'radial-gradient(circle at 50% 50%, rgba(184, 255, 59, 0.08) 0%, var(--bg-primary) 70%)',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'url("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.1, zIndex: 0 }}></div>
        
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'inline-block', padding: '8px 16px', backgroundColor: 'rgba(184, 255, 59, 0.1)', border: '1px solid rgba(184, 255, 59, 0.2)', borderRadius: '24px', color: 'var(--accent)', fontWeight: '600', marginBottom: '24px', fontSize: '14px', letterSpacing: '0.5px' }}>
            🎉 Welcome to SkillHub
          </div>
          <h1 
            style={{ 
              fontSize: '64px', 
              fontWeight: '700', 
              marginBottom: '24px',
              color: '#ffffff',
              lineHeight: '1.1'
            }}
          >
            Master New Skills.<br/> 
            <span style={{ color: 'var(--accent)' }}>Build Your Future.</span>
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
            Explore expert-led courses, follow clear learning paths, and level up your career at your own pace without pressure.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
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
            <Link 
              to="/register" 
              className="btn-secondary" 
              style={{ 
                padding: '16px 40px', 
                fontSize: '18px', 
                borderRadius: '30px', 
                textDecoration: 'none',
                display: 'inline-block',
                backgroundColor: 'rgba(255,255,255,0.03)'
              }}
            >
              Join for Free
            </Link>
          </div>
        </div>
      </div>
      
      {/* Social Proof Section */}
      <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '60px 20px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '32px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>
          Our learners work at industry leaders
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '60px', flexWrap: 'wrap', opacity: 0.5 }}>
          <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>Google</span>
          <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>Spotify</span>
          <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>Meta</span>
          <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>Amazon</span>
        </div>
      </div>
      
      {/* Value Proposition */}
      <div style={{ padding: '100px 20px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '36px', marginBottom: '16px' }}>Why learn on <span style={{ color: 'var(--accent)' }}>SkillHub</span>?</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '18px', marginBottom: '60px', maxWidth: '600px', margin: '0 auto 60px' }}>Everything you need to master a new skill, all in one place.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          <div className="glass-card" style={{ padding: '40px 32px', textAlign: 'left' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(184, 255, 59, 0.1)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '24px' }}>
              📚
            </div>
            <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>Expert Content</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Learn from industry professionals with real-world experience and comprehensive curriculums.</p>
          </div>
          <div className="glass-card" style={{ padding: '40px 32px', textAlign: 'left' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(184, 255, 59, 0.1)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '24px' }}>
              ⚡
            </div>
            <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>Learn at Your Pace</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Lifetime access to courses means you can learn whenever and wherever it suits you best.</p>
          </div>
          <div className="glass-card" style={{ padding: '40px 32px', textAlign: 'left' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(184, 255, 59, 0.1)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '24px' }}>
              🏆
            </div>
            <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>Earn Certificates</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Prove your knowledge with completion certificates that you can share on your resume.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;

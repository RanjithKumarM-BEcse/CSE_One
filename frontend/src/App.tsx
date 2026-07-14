import { useState, useEffect } from 'react';
import './App.css';

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
}

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123'); // Default for mock auth
  const [error, setError] = useState('');

  const fetchProfile = async (currentToken: string) => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/iam/me', {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        logout();
      }
    } catch (e) {
      console.error(e);
      logout();
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile(token);
    }
  }, [token]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const res = await fetch('http://localhost:8000/api/v1/iam/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setToken(data.access_token);
        localStorage.setItem('token', data.access_token);
      } else {
        const errData = await res.json();
        setError(errData.detail || 'Login failed');
      }
    } catch (e) {
      setError('Cannot connect to server');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  if (user) {
    return (
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>CSE One Dashboard</h1>
          <button onClick={logout} className="logout-btn">Logout</button>
        </header>
        <main className="dashboard-main">
          <div className="card">
            <h2>Welcome, {user.full_name}</h2>
            <p><strong>Role:</strong> <span className={`role-badge role-${user.role}`}>{user.role}</span></p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
          
          <div className="card mt-4">
            <h3>Quick Actions</h3>
            {user.role === 'student' && <button className="action-btn">Apply Leave</button>}
            {user.role === 'professor' && <button className="action-btn">Take Attendance</button>}
            {user.role === 'faculty_advisor' && <button className="action-btn">Pending Leaves</button>}
            {user.role === 'admin' && <button className="action-btn">Manage Timetable</button>}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>CSE One</h1>
        <p className="subtitle">Smart Attendance & Academic Analytics</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={login} className="login-form">
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="e.g. admin@saec.ac.in"
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
            <small className="hint">Mock password is 'password123'</small>
          </div>
          <button type="submit" className="login-btn">Sign In</button>
        </form>

        <div className="mock-users">
          <h4>Try logging in with:</h4>
          <ul>
            <li onClick={() => setEmail('admin@saec.ac.in')}>admin@saec.ac.in (Admin)</li>
            <li onClick={() => setEmail('krishna@saec.ac.in')}>krishna@saec.ac.in (Professor)</li>
            <li onClick={() => setEmail('lakshmi@saec.ac.in')}>lakshmi@saec.ac.in (Faculty Advisor)</li>
            <li onClick={() => setEmail('student1@saec.ac.in')}>student1@saec.ac.in (Student)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;

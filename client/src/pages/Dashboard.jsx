import { useNavigate } from 'react-router-dom';
import useAuth from '../context/useAuth';

function Dashboard() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>Secure Auth</h1>
          <p>Authentication Dashboard</p>
        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      <main className="dashboard-content">
        <section className="welcome-card">
          <p className="dashboard-label">
            Welcome back
          </p>

          <h2>
            {user?.firstName} {user?.lastName}
          </h2>

          <p>{user?.email}</p>
        </section>

        <section className="dashboard-grid">
          <div className="info-card">
            <span>Account Role</span>
            <strong>{user?.role || 'USER'}</strong>
          </div>

          <div className="info-card">
            <span>Email Status</span>
            <strong>
              {user?.isEmailVerified
                ? 'Verified'
                : 'Not verified'}
            </strong>
          </div>

          <div className="info-card">
            <span>Account Status</span>
            <strong>Active</strong>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
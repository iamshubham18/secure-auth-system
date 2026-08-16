import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import useAuth from '../../context/useAuth';

function Login() {
  const navigate = useNavigate();
 const { login, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  //const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  setError('');

  try {
    await login(
      formData.email,
      formData.password
    );

    navigate('/dashboard');
  } catch (error) {
    const responseData = error.response?.data;

    if (responseData?.errors?.length) {
      const messages = responseData.errors
        .map((item) => item.message)
        .join(', ');

      setError(messages);
    } else {
      setError(
        responseData?.message ||
        'Login failed. Please check your credentials.'
      );
    }
  }
};

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your secure account"
    >
      <form onSubmit={handleSubmit} className="auth-form">

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="login-email">
            Email
          </label>

          <input
            id="login-email"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="login-password">
            Password
          </label>

          <input
            id="login-password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="auth-button"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="auth-footer">
        <button
          type="button"
          className="auth-link"
          onClick={() => navigate('/forgot-password')}
        >
          Forgot password?
        </button>
      </div>

      <div className="auth-footer">
        <span>Don't have an account?</span>

        <button
          type="button"
          className="auth-link"
          onClick={() => navigate('/register')}
        >
          Create account
        </button>
      </div>
    </AuthLayout>
  );
}

export default Login;
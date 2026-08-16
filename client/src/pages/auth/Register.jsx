import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import AuthLayout from '../../components/auth/AuthLayout';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/auth/register', formData);

      setSuccess(
        'Account created successfully. You can now sign in.'
      );

      setTimeout(() => {
        navigate('/login');
      }, 1500);
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
          'Registration failed. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Create your secure account"
    >
      <form onSubmit={handleSubmit} className="auth-form">

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {success && (
          <div className="auth-success">
            {success}
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">
              First name
            </label>

            <input
              id="firstName"
              type="text"
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">
              Last name
            </label>

            <input
              id="lastName"
              type="text"
              name="lastName"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="register-email">
            Email
          </label>

          <input
            id="register-email"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="register-password">
            Password
          </label>

          <input
            id="register-password"
            type="password"
            name="password"
            placeholder="Create a strong password"
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
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <div className="auth-footer">
        <span>Already have an account?</span>

        <button
          type="button"
          className="auth-link"
          onClick={() => navigate('/login')}
        >
          Sign in
        </button>
      </div>
    </AuthLayout>
  );
}

export default Register;
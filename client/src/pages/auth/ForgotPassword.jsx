import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import AuthLayout from '../../components/auth/AuthLayout';

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await api.post(
        '/auth/forgot-password',
        { email }
      );

      setSuccess(
        response.data?.message ||
        'Password reset request submitted successfully.'
      );
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
          'Unable to process your request. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="Enter your email to reset your password"
    >
      <form
        onSubmit={handleSubmit}
        className="auth-form"
      >
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

        <div className="form-group">
          <label htmlFor="forgot-email">
            Email
          </label>

          <input
            id="forgot-email"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="auth-button"
          disabled={loading}
        >
          {loading
            ? 'Sending...'
            : 'Send reset instructions'}
        </button>
      </form>

      <div className="auth-footer">
        <button
          type="button"
          className="auth-link"
          onClick={() => navigate('/login')}
        >
          Back to login
        </button>
      </div>
    </AuthLayout>
  );
}

export default ForgotPassword;
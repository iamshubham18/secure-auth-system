import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import AuthLayout from '../../components/auth/AuthLayout';

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (!token) {
      setError('Invalid or missing password reset token.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/reset-password', {
        token,
        password,
      });

      setSuccess(
        'Password reset successfully. Redirecting to login...'
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
          'Password reset failed. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Create a new password for your account"
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

        <div className="form-group">
          <label htmlFor="reset-password">
            New password
          </label>

          <input
            id="reset-password"
            type="password"
            placeholder="Enter your new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirm-password">
            Confirm password
          </label>

          <input
            id="confirm-password"
            type="password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="auth-button"
          disabled={loading}
        >
          {loading ? 'Resetting password...' : 'Reset password'}
        </button>
      </form>

      <div className="auth-footer">
        <span>Remember your password?</span>

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

export default ResetPassword;
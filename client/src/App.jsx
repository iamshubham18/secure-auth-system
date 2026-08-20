import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/auth/ForgotPassword';

import AuthProvider from './context/AuthProvider';
import ProtectedRoute from './routes/ProtectedRoute';
import ResetPassword from './pages/auth/ResetPassword';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/login" />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
  path="/reset-password"
  element={<ResetPassword />}
/>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
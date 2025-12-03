import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/authSlice';
import './Auth.css';

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const result = await dispatch(loginUser({
        email: values.email,
        password: values.password,
      }));
      
      if (result.type === 'auth/login/fulfilled') {
        const role = result.payload.role;
        navigate(role === 'admin' ? '/admin' : '/dashboard');
      }
    },
  });

  const handleDemoSignIn = async (role) => {
    const credentials = {
      email: role === 'admin' ? 'admin@votingapp.com' : 'user@votingapp.com',
      password: 'demo123',
    };
    const result = await dispatch(loginUser(credentials));
    if (result.type === 'auth/login/fulfilled') {
      navigate(role === 'admin' ? '/admin' : '/dashboard');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to your account</p>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={formik.handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              {...formik.getFieldProps('email')}
              className={`form-input ${formik.touched.email && formik.errors.email ? 'error' : ''}`}
              placeholder="Enter your email"
            />
            {formik.touched.email && formik.errors.email && (
              <span className="error-message">{formik.errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              {...formik.getFieldProps('password')}
              className={`form-input ${formik.touched.password && formik.errors.password ? 'error' : ''}`}
              placeholder="Enter your password"
            />
            {formik.touched.password && formik.errors.password && (
              <span className="error-message">{formik.errors.password}</span>
            )}
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="demo-section">
          <p className="demo-title">Try Demo Accounts:</p>
          <div className="demo-buttons">
            <button
              type="button"
              className="btn-demo"
              onClick={() => handleDemoSignIn('user')}
              disabled={loading}
            >
              Demo User
            </button>
            <button
              type="button"
              className="btn-demo btn-demo-admin"
              onClick={() => handleDemoSignIn('admin')}
              disabled={loading}
            >
              Demo Admin
            </button>
          </div>
        </div>

        <p className="auth-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;

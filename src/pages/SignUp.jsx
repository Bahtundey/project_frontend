import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '../store/authSlice';
import './Auth.css';

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
    role: Yup.string()
      .oneOf(['user', 'admin'])
      .required('Please select a role'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user',
    },
    validationSchema,
    onSubmit: async (values) => {
      const result = await dispatch(signupUser({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
      }));
      
      if (result.type === 'auth/signup/fulfilled') {
        const userRole = result.payload.role;
        navigate(userRole === 'admin' ? '/admin' : '/dashboard');
      }
    },
  });

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join VoteHub today</p>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={formik.handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              {...formik.getFieldProps('name')}
              className={`form-input ${formik.touched.name && formik.errors.name ? 'error' : ''}`}
              placeholder="Enter your full name"
            />
            {formik.touched.name && formik.errors.name && (
              <span className="error-message">{formik.errors.name}</span>
            )}
          </div>

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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              {...formik.getFieldProps('confirmPassword')}
              className={`form-input ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'error' : ''}`}
              placeholder="Confirm your password"
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <span className="error-message">{formik.errors.confirmPassword}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="role">I want to sign up as:</label>
            <select
              id="role"
              {...formik.getFieldProps('role')}
              className={`form-input ${formik.touched.role && formik.errors.role ? 'error' : ''}`}
            >
              <option value="user">Voter (User)</option>
              <option value="admin">Admin (Create Polls)</option>
            </select>
            {formik.touched.role && formik.errors.role && (
              <span className="error-message">{formik.errors.role}</span>
            )}
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;

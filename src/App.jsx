import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Landing from './pages/Landing'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import About from './pages/About'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'
import PollVoting from './pages/PollVoting'
import Results from './pages/Results'

import './App.css'

const ProtectedRoute = ({ children, isAuthenticated, isAdmin, requiredAdmin = false }) => {
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />
  }
  if (requiredAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}

const App = () => {
  const { isAuthenticated, isAdmin } = useSelector(state => state.auth)

  return (
    <div className="app">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignUp />} />
          <Route path="/signin" element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignIn />} />
          <Route path="/about" element={<About />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={isAdmin}>
                {isAdmin ? <Navigate to="/admin" /> : <UserDashboard />}
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={isAdmin} requiredAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/poll/:pollId"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={isAdmin}>
                <PollVoting />
              </ProtectedRoute>
            }
          />

          <Route
            path="/results/:pollId"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={isAdmin}>
                <Results />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App

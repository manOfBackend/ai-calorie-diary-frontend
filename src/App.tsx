// src/App.tsx

import React, { useEffect } from 'react';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import DiaryCreate from './pages/DiaryCreate';
import DiaryEntry from './pages/DiaryEntry';
import DiaryList from './pages/DiaryList';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuth } from './stores/authStore';

const App: React.FC = () => {
  const { checkAuth, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={isAuthenticated ? <Navigate to="/diary" /> : <Login />} />
          <Route
            path="register"
            element={isAuthenticated ? <Navigate to="/diary" /> : <Register />}
          />
          <Route path="diary" element={<ProtectedRoute />}>
            <Route index element={<DiaryList />} />
            <Route path="create" element={<DiaryCreate />} />
            <Route path=":id" element={<DiaryEntry />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;

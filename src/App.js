import './App.css';
import React, { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './Redux/store';
import AddPage from './Pages/Addpage';
import ViewPage from './Pages/Viewpage';
import LoginPage from './Pages/LoginPage';
import ProtectedRoute from './Pages/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

// Separate component to handle the timer logic
const AppContent = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    let logoutTimer;
    if (isAuthenticated) {
      const tenMinutes = 10 * 60 * 1000;
      
      // Set timer to logout after 10 minutes
      logoutTimer = setTimeout(() => {
        dispatch({ type: 'LOGOUT' });
        alert("Session expired after 10 minutes. Please login again.");
      }, tenMinutes);
    }
    return () => clearTimeout(logoutTimer);
  }, [isAuthenticated, dispatch]);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <ViewPage />
            </ProtectedRoute>
          } />

          <Route path="/add" element={
            <ProtectedRoute>
              <AddPage />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
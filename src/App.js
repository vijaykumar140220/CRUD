import './App.css';
import React from 'react';
import { Provider } from 'react-redux';
import store from './Redux/store';
import AddPage from './Pages/Addpage';
import ViewPage from './Pages/Viewpage';
import LoginPage from './Pages/LoginPage';
import ProtectedRoute from './Pages/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <BrowserRouter>
          <Routes>

            {/* ✅ Public Route */}
            <Route path="/login" element={<LoginPage />} />

            {/* ✅ Protected Routes */}
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

          </Routes>
        </BrowserRouter>

        <Toaster position="top-center" reverseOrder={false} />
      </div>
    </Provider>
  );
}

export default App;
import './App.css';
import React from 'react';
import { Provider } from 'react-redux';
import store from './Redux/store';
import AddPage from './Pages/Addpage';
import ViewPage from './Pages/Viewpage';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<ViewPage />} />
        <Route path="/add" element={<AddPage />} />
      </Routes>

    </BrowserRouter>
        <Toaster
  position="top-center"
  reverseOrder={false}
/>
      </div>
    </Provider>
  );
}

export default App;

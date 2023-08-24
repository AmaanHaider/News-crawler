import React from 'react';
import { Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ArticlePage from './pages/ArticlePage';


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/news/:id" element={<ArticlePage/>} />
      </Routes>
    </div>

  );
}

export default App;

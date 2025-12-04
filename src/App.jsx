import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { MyPage } from './pages/MyPage';
import { Itinerary } from './pages/Itinerary';
import { Planner } from './pages/Planner';
import { Footer } from './components/layout/Footer';

import { PamphletPage } from './pages/PamphletPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/itinerary/:destination" element={<Itinerary />} />
        <Route path="/pamphlet" element={<PamphletPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

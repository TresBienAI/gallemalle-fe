import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import Hero from './components/Hero'
import MainSearch from './components/MainSearch'
import DashboardGrid from './components/DashboardGrid'
import MapSection from './components/MapSection'
import Footer from './components/Footer'
import BottomNav from './components/BottomNav'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Pamphlet from './pages/Pamphlet'

function Home() {
  return (
    <main>
      <Hero />
      <MainSearch />
      <DashboardGrid />
      <MapSection />
    </main>
  )
}

function App() {
  const [isPcMode, setIsPcMode] = useState(false);

  useEffect(() => {
    if (isPcMode) {
      document.body.classList.add('pc-mode');
    } else {
      document.body.classList.remove('pc-mode');
    }
  }, [isPcMode]);

  const togglePcMode = () => {
    setIsPcMode(!isPcMode);
  };

  return (
    <Router>
      <div className="app">
        <Header isPcMode={isPcMode} onTogglePcMode={togglePcMode} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/pamphlet" element={<Pamphlet />} />
        </Routes>
        <Footer />
        <BottomNav />
      </div>
    </Router>
  )
}

export default App

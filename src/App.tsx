import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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
  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
        <Footer />
        <BottomNav />
      </div>
    </Router>
  )
}

export default App

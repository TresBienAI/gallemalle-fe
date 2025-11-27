import './App.css'
import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import Inspiration from './components/Inspiration'
import Footer from './components/Footer'
import BottomNav from './components/BottomNav'

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <Features />
        <Inspiration />
      </main>
      <Footer />
      <BottomNav />
    </div>
  )
}

export default App

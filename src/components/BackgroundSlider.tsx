import { useState, useEffect } from 'react'
import './BackgroundSlider.css'

const IMAGES = [
    'https://images.unsplash.com/photo-1538485399081-7191377e8241?q=80&w=2948&auto=format&fit=crop', // Seoul Tower
    'https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=2940&auto=format&fit=crop', // Gyeongbokgung
    'https://images.unsplash.com/photo-1546874177-9e664107314e?q=80&w=2938&auto=format&fit=crop', // Han River
    'https://images.unsplash.com/photo-1617541086271-fac09e3919dd?q=80&w=2938&auto=format&fit=crop', // City Night
]

function BackgroundSlider() {
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % IMAGES.length)
        }, 5000) // Change every 5 seconds

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="background-slider">
            {IMAGES.map((img, index) => (
                <div
                    key={index}
                    className={`bg-slide ${index === currentIndex ? 'active' : ''}`}
                    style={{ backgroundImage: `url(${img})` }}
                />
            ))}
            <div className="bg-overlay" />
        </div>
    )
}

export default BackgroundSlider

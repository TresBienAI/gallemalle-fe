import './Hero.css'

function Hero() {
    return (
        <section className="hero">
            <div className="hero-top">
                <div className="hero-text-group">
                    <h1 className="hero-title">
                        여행 갈래말래? 💬
                    </h1>
                    <p className="hero-subtitle">
                        여행 계획을 위한 AI 도구,<br />
                        지금 바로 사용해 보세요.
                    </p>
                </div>
                <div className="hero-image">
                    {/* Using a placeholder for the 3D airplane. In a real app, this would be a local asset. */}
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/2200/2200326.png"
                        alt="Airplane"
                        className="airplane-img"
                    />
                </div>
            </div>
        </section>
    )
}

export default Hero

import './Hero.css'

function Hero() {
    return (
        <section className="hero">
            <div className="hero-content">
                <h1 className="hero-title">
                    안녕, 난 <span className="highlight">갈래말래야</span>
                </h1>
                <p className="hero-subtitle">
                    취향과 예산을 말해줘, 완벽한 여행을 설계해줄게.
                </p>

                <div className="hero-search-box">
                    <div className="search-input-group">
                        <input
                            type="text"
                            placeholder="예: 12월에 따뜻한 나라로 3박 4일 여행 가고 싶어"
                        />
                    </div>
                    <button className="search-button">
                        <span className="send-icon">➤</span>
                    </button>
                </div>

                <div className="hero-tags">
                    <span>#겨울여행</span>
                    <span>#가성비</span>
                    <span>#호캉스</span>
                </div>
            </div>
        </section>
    )
}

export default Hero

import './Hero.css'

function Hero() {
    return (
        <section className="hero">
            <div className="hero-content">
                <h1 className="hero-title">
                    안녕! 난 <span className="highlight">갈래말래</span>야,<br />
                    너의 서울 여행 플래너.
                </h1>
                <p className="hero-subtitle">
                    스타일과 예산만 알려줘, 나머진 내가 다 할게.
                </p>

                <div className="hero-search-box">
                    <div className="search-input-group">
                        <label>어디로 떠나볼까?</label>
                        <input type="text" placeholder="서울의 핫플레이스..." />
                    </div>
                    <button className="search-button">
                        여행 시작하기
                    </button>
                </div>

                <p className="hero-easter-egg">
                    으아아아아아 애매하긴 해.. 근데 깃 푸시도 안티그래비티가 다 해줌
                </p>
            </div>
            <div className="hero-visual">
                {/* Placeholder for hero image or animation */}
                <div className="hero-circle"></div>
            </div>
        </section>
    )
}

export default Hero

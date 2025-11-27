import './Features.css'

function Features() {
    return (
        <section className="features">
            <div className="features-container">
                <div className="feature-card">
                    <div className="feature-icon">✨</div>
                    <h3>맞춤형 일정</h3>
                    <p>당신의 취향과 예산에 딱 맞는<br />서울 여행 코스를 제안합니다.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">💎</div>
                    <h3>숨겨진 명소</h3>
                    <p>현지인만 아는 서울의<br />보석 같은 장소를 발견하세요.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">💸</div>
                    <h3>최저가 예약</h3>
                    <p>AI가 찾아낸 최적의 가격으로<br />숙소와 액티비티를 예약하세요.</p>
                </div>
            </div>
        </section>
    )
}

export default Features

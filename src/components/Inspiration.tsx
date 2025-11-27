import './Inspiration.css'

function Inspiration() {
    const places = [
        { name: '북촌 한옥마을', desc: '전통과 현대의 조화', image: '🏯' },
        { name: '성수동 카페거리', desc: '힙한 감성의 성지', image: '☕️' },
        { name: '한강 공원', desc: '도심 속 힐링 피크닉', image: '🧺' },
        { name: '남산 타워', desc: '서울의 로맨틱한 야경', image: '🌃' },
    ]

    return (
        <section className="inspiration">
            <div className="inspiration-header">
                <h2>어디로 떠나볼까요?</h2>
                <p>서울의 가장 핫한 여행지를 둘러보세요.</p>
            </div>

            <div className="inspiration-grid">
                {places.map((place, index) => (
                    <div key={index} className="place-card">
                        <div className="place-image">{place.image}</div>
                        <div className="place-info">
                            <h3>{place.name}</h3>
                            <p>{place.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Inspiration

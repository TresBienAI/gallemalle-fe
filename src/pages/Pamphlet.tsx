import './Pamphlet.css'

function Pamphlet() {
    const events = [
        {
            year: '1557',
            title: '포르투갈 정착',
            desc: '포르투갈 상인들이 마카오에 정착하기 시작했습니다. 동서양 문화 교류의 시작점이 되었습니다.',
            image: 'https://images.unsplash.com/photo-1518182170546-0766aa6f6a56?q=80&w=2000&auto=format&fit=crop' // Placeholder
        },
        {
            year: '1602',
            title: '성 바울 성당 건설',
            desc: '아시아 최대의 가톨릭 성당이 건설되었습니다. 현재는 전면부만 남아 마카오의 상징이 되었습니다.',
            image: 'https://images.unsplash.com/photo-1552423315-996b2257db13?q=80&w=2000&auto=format&fit=crop' // Placeholder
        },
        {
            year: '1849',
            title: '아마 사원 확장',
            desc: '마카오라는 이름의 유래가 된 아마 사원이 현재의 모습을 갖추게 되었습니다.',
            image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2000&auto=format&fit=crop' // Placeholder
        },
        {
            year: '2005',
            title: '세계문화유산 등재',
            desc: '마카오 역사지구가 유네스코 세계문화유산으로 등재되었습니다.',
            image: 'https://images.unsplash.com/photo-1512753360436-63972de6f905?q=80&w=2000&auto=format&fit=crop' // Placeholder
        }
    ]

    return (
        <div className="pamphlet-container">
            <header className="pamphlet-header">
                <h1 className="pamphlet-title">Historic Centre of Macao</h1>
                <p className="pamphlet-subtitle">마카오 역사 지구 - 시간의 흐름을 따라서</p>
            </header>

            <div className="timeline-container">
                <div className="timeline-path"></div>

                {events.map((event, index) => (
                    <div key={index} className="timeline-item">
                        <div className="timeline-marker"></div>
                        <div className="timeline-content">
                            <span className="timeline-year">{event.year}</span>
                            <img src={event.image} alt={event.title} className="timeline-image" />
                            <h3 className="timeline-title">{event.title}</h3>
                            <p className="timeline-desc">{event.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Pamphlet

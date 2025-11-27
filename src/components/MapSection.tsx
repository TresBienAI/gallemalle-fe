import './MapSection.css'

function MapSection() {
    return (
        <div className="map-section">
            <h2 className="map-title">서울 여행, 어디로 갈까요? 🗺️</h2>
            <div className="map-container">
                <iframe
                    title="Seoul Map"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight={0}
                    marginWidth={0}
                    src="https://maps.google.com/maps?q=Seoul&t=&z=13&ie=UTF8&iwloc=&output=embed"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    )
}

export default MapSection

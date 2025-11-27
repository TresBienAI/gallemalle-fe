import './BottomNav.css'

function BottomNav() {
    return (
        <nav className="bottom-nav">
            <a href="#" className="nav-item active">
                <span className="nav-icon">🏠</span>
                <span className="nav-label">홈</span>
            </a>
            <a href="#" className="nav-item">
                <span className="nav-icon">🔍</span>
                <span className="nav-label">검색</span>
            </a>
            <a href="#" className="nav-item">
                <span className="nav-icon">❤️</span>
                <span className="nav-label">찜</span>
            </a>
            <a href="#" className="nav-item">
                <span className="nav-icon">👤</span>
                <span className="nav-label">마이</span>
            </a>
        </nav>
    )
}

export default BottomNav

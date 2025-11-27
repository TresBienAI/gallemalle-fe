import { NavLink } from 'react-router-dom'
import './BottomNav.css'

function BottomNav() {
    return (
        <nav className="bottom-nav">
            <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <span className="nav-icon">🏠</span>
                <span className="nav-label">홈</span>
            </NavLink>
            <NavLink to="/search" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <span className="nav-icon">🔍</span>
                <span className="nav-label">검색</span>
            </NavLink>
            <NavLink to="/wishlist" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <span className="nav-icon">❤️</span>
                <span className="nav-label">찜</span>
            </NavLink>
            <NavLink to="/login" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <span className="nav-icon">👤</span>
                <span className="nav-label">마이</span>
            </NavLink>
        </nav>
    )
}

export default BottomNav

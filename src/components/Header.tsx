import { Link } from 'react-router-dom'
import './Header.css'

function Header() {
    return (
        <header className="header">
            <div className="header-container">
                <div className="logo">
                    <Link to="/">갈래말래</Link>
                </div>
                <div className="header-actions">
                    <button className="icon-btn menu-btn">
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Header

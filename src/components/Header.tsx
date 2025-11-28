import { Link } from 'react-router-dom'
import './Header.css'

interface HeaderProps {
    isPcMode?: boolean;
    onTogglePcMode?: () => void;
}

function Header({ isPcMode, onTogglePcMode }: HeaderProps) {
    return (
        <header className="header">
            <div className="header-container">
                <div className="logo">
                    <Link to="/">갈래말래</Link>
                </div>
                <div className="header-actions">
                    {onTogglePcMode && (
                        <button className="btn-primary" onClick={onTogglePcMode} style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', backgroundColor: isPcMode ? '#000' : '#f0f0f0', color: isPcMode ? '#fff' : '#000' }}>
                            {isPcMode ? 'Mobile' : 'PC'}
                        </button>
                    )}
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

import './Header.css'

function Header() {
    return (
        <header className="header">
            <div className="header-container">
                <div className="logo">
                    <a href="/">갈래말래</a>
                </div>
                <div className="header-actions">
                    <button className="icon-btn">🔔</button>
                    <button className="icon-btn">🛒</button>
                </div>
            </div>
        </header>
    )
}

export default Header

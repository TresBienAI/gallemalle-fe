import './Header.css'

function Header() {
    return (
        <header className="header">
            <div className="header-container">
                <div className="logo">
                    <a href="/">갈래말래</a>
                </div>
                <nav className="nav">
                    <a href="#about">소개</a>
                    <a href="#blog">블로그</a>
                    <a href="#contact">문의</a>
                </nav>
                <div className="header-actions">
                    <button className="btn-primary">앱 다운로드</button>
                </div>
            </div>
        </header>
    )
}

export default Header

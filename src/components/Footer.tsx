import './Footer.css'

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-brand">
                    <h3>갈래말래</h3>
                    <p>서울 여행의 모든 것, AI와 함께하세요.</p>
                </div>
                <div className="footer-links">
                    <div className="footer-column">
                        <h4>회사</h4>
                        <a href="#">소개</a>
                        <a href="#">채용</a>
                        <a href="#">블로그</a>
                    </div>
                    <div className="footer-column">
                        <h4>지원</h4>
                        <a href="#">고객센터</a>
                        <a href="#">이용약관</a>
                        <a href="#">개인정보처리방침</a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© 2025 갈래말래 · TresBienAI. All rights reserved.</p>
            </div>
        </footer>
    )
}

export default Footer

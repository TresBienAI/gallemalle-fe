import { Link } from 'react-router-dom'
import './Auth.css'

function Login() {
    return (
        <div className="auth-container">
            <h1 className="auth-title">로그인</h1>
            <form className="auth-form">
                <div className="form-group">
                    <label htmlFor="email">이메일</label>
                    <input type="email" id="email" placeholder="example@email.com" />
                </div>
                <div className="form-group">
                    <label htmlFor="password">비밀번호</label>
                    <input type="password" id="password" placeholder="비밀번호를 입력하세요" />
                </div>
                <button type="submit" className="auth-button">로그인</button>
            </form>
            <div className="auth-links">
                <Link to="/signup">회원가입</Link>
                <span className="divider">|</span>
                <a href="#">비밀번호 찾기</a>
            </div>
            <div className="social-login">
                <p>SNS 계정으로 로그인</p>
                <div className="social-buttons">
                    <button className="social-btn kakao">K</button>
                    <button className="social-btn naver">N</button>
                    <button className="social-btn google">G</button>
                </div>
            </div>
        </div>
    )
}

export default Login

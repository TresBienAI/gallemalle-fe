import { Link } from 'react-router-dom'
import './Auth.css'

function Signup() {
    return (
        <div className="auth-container">
            <h1 className="auth-title">회원가입</h1>
            <form className="auth-form">
                <div className="form-group">
                    <label htmlFor="name">이름</label>
                    <input type="text" id="name" placeholder="홍길동" />
                </div>
                <div className="form-group">
                    <label htmlFor="email">이메일</label>
                    <input type="email" id="email" placeholder="example@email.com" />
                </div>
                <div className="form-group">
                    <label htmlFor="password">비밀번호</label>
                    <input type="password" id="password" placeholder="비밀번호를 입력하세요" />
                </div>
                <div className="form-group">
                    <label htmlFor="confirm-password">비밀번호 확인</label>
                    <input type="password" id="confirm-password" placeholder="비밀번호를 다시 입력하세요" />
                </div>
                <button type="submit" className="auth-button">가입하기</button>
            </form>
            <div className="auth-links">
                <span>이미 계정이 있으신가요?</span>
                <Link to="/login" className="link-highlight">로그인</Link>
            </div>
        </div>
    )
}

export default Signup

import './MainSearch.css'

function MainSearch() {
    return (
        <div className="main-search-container">
            <div className="main-search-box">
                <p className="search-label">어디로 떠나고 싶으신가요?</p>
                <div className="search-input-area">
                    {/* Hidden input or just a visual area as per design, but let's make it functional */}
                    <input type="text" className="search-input" />
                    <button className="send-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 2L11 13" stroke="#006D77" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#006D77" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MainSearch

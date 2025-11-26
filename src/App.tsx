import './App.css'

function App() {
  return (
    <div className="travel-app">
      <header className="travel-header">
        <h1 className="travel-title">갈래말래 · 서울 여행 플래너</h1>
        <p className="travel-subtitle">
          날짜, 인원, 분위기만 정하면
          <br />
          나머지는 AI가 채워주는 서울 여행 코스
        </p>
      </header>

      <main className="travel-main">
        <section className="travel-section">
          <h2>여행 기본 정보</h2>
          <div className="travel-form">
            <div className="travel-field">
              <label htmlFor="date">여행 날짜</label>
              <input id="date" type="date" />
            </div>

            <div className="travel-field">
              <label htmlFor="days">여행 일수</label>
              <select id="days" defaultValue="1">
                <option value="0.5">당일치기</option>
                <option value="1">1박 2일</option>
                <option value="2">2박 3일</option>
                <option value="3">3박 4일</option>
              </select>
            </div>

            <div className="travel-field">
              <label htmlFor="people">인원</label>
              <select id="people" defaultValue="2">
                <option value="1">1명</option>
                <option value="2">2명</option>
                <option value="3">3명</option>
                <option value="4">4명 이상</option>
              </select>
            </div>

            <div className="travel-field">
              <label htmlFor="mood">여행 분위기</label>
              <select id="mood" defaultValue="chill">
                <option value="chill">잔잔한 감성</option>
                <option value="food">먹방 위주</option>
                <option value="photo">사진 스팟</option>
                <option value="walk">걷기 좋은 코스</option>
              </select>
            </div>

            <div className="travel-field">
              <label htmlFor="memo">꼭 가고 싶은 곳 (선택)</label>
              <input
                id="memo"
                type="text"
                placeholder="예: 남산타워, 노들섬, 광화문 등"
              />
            </div>

            <button className="travel-button" type="button">
              ✨ 서울 여행 플랜 만들기 (UI만, 아직 동작 X)
            </button>
          </div>
        </section>

        <section className="travel-section">
          <h2>예시 일정</h2>
          <p className="travel-example-desc">
            실제 서비스에선 여기에 AI가 생성한 일정이 카드 형태로 들어갈 예정이에요.
          </p>

          <ul className="travel-example-list">
            <li>
              <strong>Day 1</strong> · 광화문 &amp; 경복궁 · 익선동 카페
            </li>
            <li>
              <strong>Day 2</strong> · 남산타워 전망 · 한강 노들섬 산책
            </li>
          </ul>
        </section>
      </main>

      <footer className="travel-footer">
        © 2025 갈래말래 · TresBienAI
      </footer>
    </div>
  )
}

export default App

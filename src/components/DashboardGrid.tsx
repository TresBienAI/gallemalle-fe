import { Link } from 'react-router-dom'
import './DashboardGrid.css'

function DashboardGrid() {
    const menuItems = [
        { id: 1, title: '채팅 history', icon: '💬', link: '/chat-history' },
        { id: 2, title: '팸플릿 history', icon: '🗺️', link: '/pamphlet-history' },
        { id: 3, title: '계획 history', icon: '📝', link: '/plan-history' },
        { id: 4, title: 'My page', icon: '👤', link: '/login' }, // Linking to login/mypage
    ]

    return (
        <div className="dashboard-grid">
            {menuItems.map((item) => (
                <Link to={item.link} key={item.id} className="dashboard-card">
                    <div className="card-icon-wrapper">
                        <span className="card-icon">{item.icon}</span>
                    </div>
                    <span className="card-title">{item.title}</span>
                </Link>
            ))}
        </div>
    )
}

export default DashboardGrid

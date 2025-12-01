import React from 'react';
import { Link } from 'react-router-dom';

export function Header() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    return (
        <header className="absolute top-0 left-0 w-full z-50 p-6 flex justify-between items-center">
            <Link to="/" className="text-white text-2xl font-bold tracking-tighter">
                TresVien
            </Link>
            <div className="flex gap-4 items-center">
                <Link to="/planner" className="text-white font-medium hover:opacity-80 transition-opacity">
                    플래너
                </Link>
                {isLoggedIn ? (
                    <Link to="/mypage" className="text-white font-medium hover:opacity-80 transition-opacity">
                        마이페이지
                    </Link>
                ) : (
                    <Link to="/login" className="text-white font-medium hover:opacity-80 transition-opacity">
                        로그인
                    </Link>
                )}
            </div>
        </header>
    );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';

export function MyPage() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        navigate('/');
        window.location.reload(); // Force reload to update Header
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            <Header />
            <div className="max-w-4xl mx-auto px-6 py-20">
                <h1 className="text-4xl font-bold mb-8">마이페이지</h1>
                <div className="bg-white/10 rounded-2xl p-8 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold">
                            T
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold">TresVien 회원님</h2>
                            <p className="text-gray-400">test@tresvien.com</p>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-6">
                        <h3 className="text-xl font-semibold mb-4">내 여행 일정</h3>
                        <p className="text-gray-400">저장된 여행 일정이 없습니다.</p>
                    </div>

                    <div className="border-t border-white/10 pt-6">
                        <Button
                            onClick={handleLogout}
                            className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/50"
                        >
                            로그아웃
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

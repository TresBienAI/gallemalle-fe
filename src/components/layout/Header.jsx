import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Globe, ChevronDown } from 'lucide-react';

export function Header() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const [isLangOpen, setIsLangOpen] = useState(false);
    const currentLang = localStorage.getItem('language') || 'KO';
    const dropdownRef = useRef(null);

    const languages = [
        { code: 'KO', label: '한국어' },
        { code: 'EN', label: 'English' },
        { code: 'CN', label: '中文' },
        { code: 'JP', label: '日本語' }
    ];

    const handleLangChange = (langCode) => {
        localStorage.setItem('language', langCode);
        window.dispatchEvent(new Event('storage'));
        window.location.reload();
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsLangOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <header className="absolute top-0 left-0 w-full z-50 p-6 flex justify-between items-center">
            <Link to="/" className="text-white text-2xl font-bold tracking-tighter">
                TresVien
            </Link>
            <div className="flex gap-4 items-center">
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsLangOpen(!isLangOpen)}
                        className="flex items-center gap-1 text-white/80 hover:text-white transition-colors text-sm font-medium mr-2"
                    >
                        <Globe className="w-4 h-4" />
                        {currentLang}
                        <ChevronDown className={`w-3 h-3 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isLangOpen && (
                        <div className="absolute top-full right-0 mt-2 w-24 bg-black/90 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-xl flex flex-col py-1">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => handleLangChange(lang.code)}
                                    className={`px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors ${currentLang === lang.code ? 'text-pink-400 font-bold' : 'text-gray-300'}`}
                                >
                                    {lang.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
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

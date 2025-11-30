import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { Search } from 'lucide-react';

export function Home() {
    const [destination, setDestination] = useState('');
    const [isChatMode, setIsChatMode] = useState(false);
    const [messages, setMessages] = useState([]);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (destination.trim()) {
            const newMessage = { text: destination, isUser: true };
            setMessages((prev) => [...prev, newMessage]);
            setDestination('');

            if (!isChatMode) {
                setIsChatMode(true);
                // Simulate initial AI response
                setTimeout(() => {
                    setMessages((prev) => [
                        ...prev,
                        {
                            text: `${newMessage.text} 여행을 계획 중이시군요! 어떤 스타일의 여행을 원하시나요?`,
                            isUser: false,
                            action: {
                                label: '여행 계획 생성하기',
                                onClick: () => navigate(`/itinerary/${encodeURIComponent(newMessage.text)}`)
                            }
                        },
                    ]);
                }, 1000);
            } else {
                // Simulate subsequent AI response
                setTimeout(() => {
                    setMessages((prev) => [
                        ...prev,
                        { text: "흥미롭네요! 더 자세히 알려주세요.", isUser: false },
                    ]);
                }, 1000);
            }
        }
    };

    const featuredDestinations = [
        { name: 'Bali', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80' },
        { name: 'Paris', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80' },
        { name: 'Tokyo', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80' },
        { name: 'New York', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80' },
    ];

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            <Header />

            {/* Hero Section */}
            <div className="relative h-screen flex flex-col justify-center items-center px-4 overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-60"
                        style={{
                            backgroundImage: "url('/korea_palace.jpg')",
                        }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 w-full max-w-3xl text-center space-y-8">
                    {!isChatMode ? (
                        <>
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
                                갈래말래!?
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-200 font-light">
                                나만의 여행 코스를 만들고 공유해보세요.
                            </p>
                        </>
                    ) : (
                        <div className="w-full h-[50vh] bg-black/40 backdrop-blur-md rounded-2xl p-6 overflow-y-auto mb-8 flex flex-col gap-4 border border-white/10">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex flex-col ${msg.isUser ? 'items-end' : 'items-start'}`}>
                                    <div
                                        className={`max-w-[80%] p-4 rounded-2xl text-left ${msg.isUser ? 'bg-white text-black rounded-tr-none' : 'bg-gray-800 text-white rounded-tl-none'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                    {msg.action && (
                                        <Button
                                            onClick={msg.action.onClick}
                                            className="mt-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
                                        >
                                            {msg.action.label}
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <form onSubmit={handleSearch} className="w-full relative">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                            <div className="relative flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-full p-2 transition-all focus-within:bg-white/20 focus-within:border-white/40">
                                <Search className="ml-4 text-gray-300 w-6 h-6" />
                                <input
                                    type="text"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    placeholder={isChatMode ? "메시지를 입력하세요..." : "어디로 떠나시나요? (예: 서울, 경주)"}
                                    className="w-full bg-transparent border-none text-white placeholder-gray-400 px-4 py-3 text-lg focus:outline-none focus:ring-0"
                                />
                                <Button
                                    type="submit"
                                    className="bg-white text-black hover:bg-gray-100 px-8"
                                >
                                    {isChatMode ? "전송" : "Go!"}
                                </Button>
                            </div>
                        </div>
                    </form>

                    {!isChatMode && (
                        <div className="pt-8 flex flex-wrap justify-center gap-4 text-sm text-gray-400">
                            <span>추천:</span>
                            {featuredDestinations.map((dest) => (
                                <button
                                    key={dest.name}
                                    onClick={() => navigate(`/itinerary/${dest.name}`)}
                                    className="hover:text-white underline underline-offset-4 transition-colors"
                                >
                                    {dest.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Featured Section */}
            {!isChatMode && (
                <div className="py-20 px-6 max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold mb-10 text-center">인기 여행지</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredDestinations.map((dest) => (
                            <div
                                key={dest.name}
                                onClick={() => navigate(`/itinerary/${dest.name}`)}
                                className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer"
                            >
                                <img
                                    src={dest.image}
                                    alt={dest.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                <div className="absolute bottom-6 left-6">
                                    <h3 className="text-2xl font-bold">{dest.name}</h3>
                                    <p className="text-gray-300 text-sm mt-1 group-hover:translate-x-2 transition-transform">일정 보기 &rarr;</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

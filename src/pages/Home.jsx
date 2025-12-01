import React, { useState, useEffect } from 'react';
import { travelService } from '../api/travelService';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { testBackendConnection } from '../api/testService';

export function Home() {
    const [destination, setDestination] = useState('');
    const [isChatMode, setIsChatMode] = useState(false);
    const [messages, setMessages] = useState([]);
    const navigate = useNavigate();
    const scrollContainerRef = React.useRef(null);
    const [backendDestinations, setBackendDestinations] = useState([]);

    // Local image mapping
    const destinationImages = {
        '서울': '/images/seoul.png',
        '부산': 'https://picsum.photos/800/800?random=1',
        '경주': 'https://picsum.photos/800/800?random=2',
        '제주': 'https://picsum.photos/800/800?random=3',
        '제주도': 'https://picsum.photos/800/800?random=3',
        '강릉': 'https://picsum.photos/800/800?random=4',
        '파리': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
        '뉴욕': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
        '발리': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    };

    const defaultImage = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80';

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const data = await travelService.getDestinations();
                if (data && data.destinations) {
                    setBackendDestinations(data.destinations);
                }
            } catch (error) {
                console.error("Failed to fetch destinations:", error);
                setBackendDestinations(['서울', '부산', '경주', '제주', '강릉', '파리', '뉴욕', '발리']);
            }
        };
        fetchDestinations();
    }, []);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const [threadId, setThreadId] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (destination.trim()) {
            const userMessage = destination;
            const newMessage = { text: userMessage, isUser: true };
            setMessages((prev) => [...prev, newMessage]);
            setDestination('');
            setIsChatMode(true);

            try {
                // Call backend API
                const response = await travelService.chat(userMessage, threadId);

                // Update thread_id if returned
                if (response.thread_id) {
                    setThreadId(response.thread_id);
                }

                // Add AI response to messages
                setMessages((prev) => [
                    ...prev,
                    { text: response.response, isUser: false }
                ]);

            } catch (error) {
                console.error("Chat API Error:", error);
                setMessages((prev) => [
                    ...prev,
                    { text: "죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.", isUser: false }
                ]);
            }
        }
    };

    const featuredDestinations = backendDestinations.map(name => ({
        name,
        image: destinationImages[name] || defaultImage
    }));

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            <Header />

            {/* Hero Section */}
            <div className="relative h-[80vh] flex flex-col justify-center items-center px-4 overflow-hidden">
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
                                    {isChatMode ? "Go!" : "Go!"}
                                </Button>
                            </div>
                        </div>
                    </form>

                    {!isChatMode && (
                        <div className="pt-2 flex flex-wrap justify-center gap-4 text-sm text-gray-400">
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
                            <button
                                onClick={async () => {
                                    try {
                                        const data = await testBackendConnection();
                                        alert('Backend Connected! ' + JSON.stringify(data));
                                    } catch (error) {
                                        alert('Connection Failed: ' + error.message);
                                    }
                                }}
                                className="text-red-500 hover:text-red-400 underline underline-offset-4 transition-colors"
                            >
                                Test Backend
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Featured Section */}
            {!isChatMode && (
                <div className="py-10 px-6 max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold mb-10 text-center">인기 여행지</h2>
                    <div
                        className="relative group/slider"
                    >
                        <button
                            onClick={() => scroll('left')}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm opacity-0 group-hover/slider:opacity-100 transition-opacity disabled:opacity-0 -ml-4"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm opacity-0 group-hover/slider:opacity-100 transition-opacity disabled:opacity-0 -mr-4"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                        <div
                            ref={scrollContainerRef}
                            className="flex overflow-x-auto pb-12 pt-4 px-10 snap-x snap-mandatory scrollbar-hide"
                        >
                            {featuredDestinations.map((dest) => (
                                <div
                                    key={dest.name}
                                    onClick={() => navigate(`/itinerary/${dest.name}`)}
                                    className="group relative w-[160px] md:w-[220px] aspect-square rounded-2xl overflow-hidden cursor-pointer snap-center flex-shrink-0 -ml-6 first:ml-0 transition-all duration-300 hover:scale-110 hover:z-50 hover:shadow-2xl"
                                >
                                    <img
                                        src={dest.image}
                                        alt={dest.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                    <div className="absolute bottom-6 left-6">
                                        <h3 className="text-3xl font-bold mb-2">{dest.name}</h3>
                                        <p className="text-gray-300 text-sm flex items-center gap-1 group-hover:translate-x-2 transition-transform">
                                            일정 보기 <ChevronRight className="w-4 h-4" />
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

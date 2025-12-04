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
        '부산': 'https://picsum.photos/800/800?random=10',
        '제주': 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=800&q=80',
        '제주도': 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=800&q=80',
        '경주': 'https://images.unsplash.com/photo-1583248369069-9d91f1640fe6?auto=format&fit=crop&w=800&q=80',
        '강릉': 'https://images.unsplash.com/photo-1629163330223-c183571735a1?auto=format&fit=crop&w=800&q=80',
        '전주': 'https://picsum.photos/800/800?random=11',
        '속초': 'https://picsum.photos/800/800?random=12',
        '양양': 'https://picsum.photos/800/800?random=13',
        '파리': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
        '뉴욕': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
    };

    const defaultImage = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80';

    useEffect(() => {
        const fetchDestinations = async () => {
            // Desired list of featured destinations
            const desiredDestinations = ['서울', '부산', '제주도', '경주', '강릉', '전주', '속초', '양양'];
            setBackendDestinations(desiredDestinations);
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

    // Helper to parse chat response into structured itinerary
    const parseItinerary = (text) => {
        try {
            const lines = text.split('\n');
            let days = 1;
            const schedule = {};
            let currentDay = 1;

            // Try to find duration
            if (text.includes('당일')) days = 1;
            else {
                const nightDayMatch = text.match(/(\d+)박\s*(\d+)일/);
                if (nightDayMatch) days = parseInt(nightDayMatch[2]);
            }

            // Parse schedule
            lines.forEach(line => {
                const trimmedLine = line.trim();
                if (!trimmedLine) return;

                // Check for day header (e.g., "1일차", "Day 1", "첫째 날")
                const dayMatch = trimmedLine.match(/(\d+)일차|Day\s*(\d+)|(\d+)일째/);
                if (dayMatch) {
                    currentDay = parseInt(dayMatch[1] || dayMatch[2] || dayMatch[3]);
                    if (!schedule[currentDay]) schedule[currentDay] = [];
                    return; // Skip header line
                }

                // Check for activity
                // Supports:
                // - 10:00 장소 설명
                // 1. 10:00 장소 설명
                // - 오전 10:00 ~ 11:00 장소 설명
                // Fallback: 1. 장소 (No time)
                const activityRegex = /^(?:[-*•]|\d+\.)?\s*((?:오전|오후)?\s*\d{1,2}:\d{2}(?:[~-]\s*(?:오전|오후)?\s*\d{1,2}:\d{2})?)\s+(.*)/;
                let activityMatch = trimmedLine.match(activityRegex);

                // Fallback for list items without time (e.g., "1. 경복궁", "- 남산타워")
                if (!activityMatch) {
                    const listRegex = /^(?:[-*•]|\d+\.)\s+(.*)/;
                    const listMatch = trimmedLine.match(listRegex);
                    if (listMatch) {
                        activityMatch = [listMatch[0], '추천', listMatch[1]];
                    }
                }

                if (activityMatch) {
                    const time = activityMatch[1].trim();
                    const rest = activityMatch[2].trim();

                    // Simple heuristic: First word is place, rest is description
                    // Unless there's a colon or specific separator
                    let place = rest;
                    let description = '';

                    const firstSpaceIndex = rest.indexOf(' ');
                    if (firstSpaceIndex > 0) {
                        place = rest.substring(0, firstSpaceIndex);
                        description = rest.substring(firstSpaceIndex + 1).trim();
                    }

                    // If place is too long (likely a sentence), treat whole thing as description or title
                    if (place.length > 15 && description.length === 0) {
                        // Keep as place (title)
                    }

                    if (!schedule[currentDay]) schedule[currentDay] = [];
                    schedule[currentDay].push({ time, place, description });
                }
            });

            return { days, schedule };
        } catch (e) {
            console.error("Parsing failed", e);
            return null;
        }
    };

    const chatContainerRef = React.useRef(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

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

                const aiResponseText = response.response;
                let action = null;

                // Check if response looks like an itinerary
                const parsedData = parseItinerary(aiResponseText);

                // Prioritize structured plan_data from backend if available
                if (response.plan_data) {
                    action = {
                        label: '일정표 보기',
                        onClick: () => navigate(`/itinerary/${encodeURIComponent(userMessage)}`, {
                            state: { itineraryData: response.plan_data }
                        })
                    };
                } else if (parsedData && Object.keys(parsedData.schedule).length > 0) {
                    // Fallback to text parsing
                    action = {
                        label: '일정표 보기',
                        onClick: () => navigate(`/itinerary/${encodeURIComponent(userMessage)}`, {
                            state: { itineraryData: parsedData }
                        })
                    };
                }

                // Add AI response to messages
                setMessages((prev) => [
                    ...prev,
                    {
                        text: aiResponseText,
                        isUser: false,
                        action: action
                    }
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
                        <div
                            ref={chatContainerRef}
                            className="w-full h-[50vh] bg-black/40 backdrop-blur-md rounded-2xl p-6 overflow-y-auto mb-8 flex flex-col gap-4 border border-white/10 scroll-smooth"
                        >
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
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-opacity -ml-4"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-opacity -mr-4"
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

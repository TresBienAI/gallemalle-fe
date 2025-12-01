import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { MapPin, Calendar, Share, Star, Clock, FileImage } from 'lucide-react';

export function Itinerary() {
    const { destination } = useParams();
    const [loading, setLoading] = useState(true);

    // Parse duration from destination string
    const parseDuration = (text) => {
        const decoded = decodeURIComponent(text || '');

        // Handle "당일" or "당일치기"
        if (decoded.includes('당일')) return 1;

        // Handle "N박 M일" pattern (e.g., 9박 10일 -> 10)
        const nightDayMatch = decoded.match(/(\d+)박\s*(\d+)일/);
        if (nightDayMatch) {
            return parseInt(nightDayMatch[2], 10);
        }

        // Handle "N일" pattern (e.g., 5일 -> 5)
        const dayMatch = decoded.match(/(\d+)일/);
        if (dayMatch) {
            return parseInt(dayMatch[1], 10);
        }

        return 3; // Default to 3 days
    };

    const days = parseDuration(destination);
    const itineraryDays = Array.from({ length: days }, (_, i) => i + 1);

    useEffect(() => {
        // Simulate API call
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, [destination]);

    const [showPamphlet, setShowPamphlet] = useState(false);

    const handleGeneratePamphlet = () => {
        alert(`${destination} 여행 팸플릿을 생성 중입니다...\n(잠시만 기다려주세요)`);
        setTimeout(() => {
            setShowPamphlet(true);
        }, 1000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
                <p className="text-xl animate-pulse">{destination} 여행을 계획하는 중입니다...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            <Header />

            {/* Pamphlet Modal */}
            {showPamphlet && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setShowPamphlet(false)}>
                    <div className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setShowPamphlet(false)}
                            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors z-10"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                        <img
                            src="/pamphlet_sample.png"
                            alt="Travel Pamphlet"
                            className="w-auto max-h-[70vh] mx-auto object-contain"
                        />
                        <div className="p-6 bg-white text-black text-center">
                            <h3 className="text-2xl font-bold mb-2">{destination} 여행 팸플릿</h3>
                            <p className="text-gray-600">나만의 맞춤형 여행 코스가 완성되었습니다!</p>
                            <Button
                                className="mt-4 bg-black text-white hover:bg-gray-800 w-full"
                                onClick={() => setShowPamphlet(false)}
                            >
                                닫기
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hero */}
            <div className="relative h-[60vh] overflow-hidden group">
                <img
                    src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1920&q=80"
                    alt={destination}
                    className="w-full h-full object-cover opacity-60 transition-transform duration-[20s] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/60"></div>
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                            <div>
                                <h1 className="text-6xl md:text-8xl font-black tracking-tighter capitalize mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                    {destination}
                                </h1>
                                <div className="flex gap-6 text-lg text-gray-300">
                                    <span className="flex items-center gap-2"><Calendar className="w-5 h-5 text-pink-500" /> {days}일 코스</span>
                                </div>
                            </div>
                            <Button
                                onClick={handleGeneratePamphlet}
                                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md flex items-center gap-3 px-8 py-4 rounded-full transition-all hover:scale-105 shadow-xl group/btn"
                            >
                                <FileImage className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                                <span className="font-semibold">팸플릿 생성</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-12">
                {/* Itinerary Timeline */}
                <div className="flex-1 space-y-16">
                    {itineraryDays.map((day) => (
                        <div key={day} className="relative pl-10 border-l-2 border-white/10">
                            <div className="absolute -left-[13px] top-0 w-7 h-7 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-500/30">
                                {day}
                            </div>
                            <h3 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                                {day}일차: 탐험 및 문화 체험
                            </h3>

                            <div className="space-y-6">
                                <div className="group bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 shadow-lg">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-yellow-500/20 rounded-xl text-yellow-400">
                                                <Clock className="w-5 h-5" />
                                            </div>
                                            <h4 className="text-xl font-bold">오전 활동</h4>
                                        </div>
                                        <span className="text-sm text-gray-400 font-mono">09:00 AM</span>
                                    </div>
                                    <p className="text-gray-300 leading-relaxed pl-14">
                                        상징적인 랜드마크를 방문하고 현지 문화를 체험하세요. 전통 조식으로 하루를 시작합니다.
                                    </p>
                                </div>

                                <div className="group bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 shadow-lg">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-orange-500/20 rounded-xl text-orange-400">
                                                <Clock className="w-5 h-5" />
                                            </div>
                                            <h4 className="text-xl font-bold">오후 모험</h4>
                                        </div>
                                        <span className="text-sm text-gray-400 font-mono">02:00 PM</span>
                                    </div>
                                    <p className="text-gray-300 leading-relaxed pl-14">
                                        도시의 숨겨진 명소를 탐험하세요. 가이드 투어를 하거나 활기찬 거리를 거닐어보세요.
                                    </p>
                                </div>

                                <div className="group bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 shadow-lg">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-500/20 rounded-xl text-blue-400">
                                                <Clock className="w-5 h-5" />
                                            </div>
                                            <h4 className="text-xl font-bold">저녁 식사</h4>
                                        </div>
                                        <span className="text-sm text-gray-400 font-mono">07:00 PM</span>
                                    </div>
                                    <p className="text-gray-300 leading-relaxed pl-14">
                                        파노라마 전망이 있는 최고급 레스토랑에서 석양과 함께 저녁 식사를 즐기세요.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sidebar */}
                <div className="w-full md:w-96 space-y-8">
                    {/* Map */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden h-80 md:sticky md:top-24 shadow-2xl">
                        <iframe
                            width="100%"
                            height="100%"
                            id="gmap_canvas"
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(destination)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                            frameBorder="0"
                            scrolling="no"
                            marginHeight="0"
                            marginWidth="0"
                            className="grayscale contrast-125 opacity-80 hover:opacity-100 transition-opacity"
                        ></iframe>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl md:sticky md:top-[26rem] shadow-2xl">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                            여행 요약
                        </h3>
                        <div className="space-y-6 text-gray-300">
                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-2xl">
                                <span>기간</span>
                                <span className="text-white font-bold">{days}일</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-2xl">
                                <span>예산</span>
                                <span className="text-white font-bold">$$$</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-2xl">
                                <span>여행객</span>
                                <span className="text-white font-bold">성인 2명</span>
                            </div>
                            <hr className="border-white/10" />
                            <Button className="w-full bg-white text-black hover:bg-gray-200 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-white/20 transition-all">
                                호텔 예약하기
                            </Button>
                            <Button className="w-full bg-transparent border border-white/20 hover:bg-white/10 py-4 rounded-xl text-gray-300 hover:text-white transition-all">
                                <Share className="w-5 h-5 mr-2 inline" /> 일정 공유하기
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

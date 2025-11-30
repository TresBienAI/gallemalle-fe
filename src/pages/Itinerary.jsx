import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { MapPin, Calendar, Share, Star, Clock, FileImage } from 'lucide-react';

export function Itinerary() {
    const { destination } = useParams();
    const [loading, setLoading] = useState(true);

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
                            className="w-full h-auto"
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
            <div className="relative h-[50vh]">
                <img
                    src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1920&q=80"
                    alt={destination}
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50"></div>
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex items-center gap-4 mb-4">
                            <h1 className="text-5xl md:text-7xl font-bold capitalize">{destination}</h1>
                            <Button
                                onClick={handleGeneratePamphlet}
                                className="bg-white/20 hover:bg-white/30 text-white border border-white/50 backdrop-blur-sm flex items-center gap-2 px-4 py-2 rounded-full transition-all"
                            >
                                <FileImage className="w-5 h-5" />
                                팸플릿
                            </Button>
                        </div>
                        <div className="flex gap-4 text-gray-300">
                            <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> 5일</span>
                            <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> 아시아</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-12">
                {/* Itinerary Timeline */}
                <div className="flex-1 space-y-12">
                    {[1, 2, 3, 4, 5].map((day) => (
                        <div key={day} className="relative pl-8 border-l border-white/20">
                            <div className="absolute -left-3 top-0 w-6 h-6 bg-white rounded-full flex items-center justify-center text-black font-bold text-xs">
                                {day}
                            </div>
                            <h3 className="text-2xl font-bold mb-6">{day}일차: 탐험 및 문화 체험</h3>

                            <div className="space-y-6">
                                <div className="bg-white/5 p-6 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-xl font-semibold">오전 활동</h4>
                                        <span className="text-sm text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> 09:00 AM</span>
                                    </div>
                                    <p className="text-gray-400">상징적인 랜드마크를 방문하고 현지 문화를 체험하세요. 전통 조식으로 하루를 시작합니다.</p>
                                </div>

                                <div className="bg-white/5 p-6 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-xl font-semibold">오후 모험</h4>
                                        <span className="text-sm text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> 02:00 PM</span>
                                    </div>
                                    <p className="text-gray-400">도시의 숨겨진 명소를 탐험하세요. 가이드 투어를 하거나 활기찬 거리를 거닐어보세요.</p>
                                </div>

                                <div className="bg-white/5 p-6 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-xl font-semibold">저녁 식사</h4>
                                        <span className="text-sm text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> 07:00 PM</span>
                                    </div>
                                    <p className="text-gray-400">파노라마 전망이 있는 최고급 레스토랑에서 석양과 함께 저녁 식사를 즐기세요.</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sidebar */}
                <div className="w-full md:w-80 space-y-6">
                    {/* Map */}
                    <div className="bg-white/10 rounded-2xl overflow-hidden h-64 sticky top-24">
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

                    <div className="bg-white/10 p-6 rounded-2xl sticky top-[22rem]">
                        <h3 className="text-xl font-bold mb-4">여행 요약</h3>
                        <div className="space-y-4 text-sm text-gray-300">
                            <div className="flex justify-between">
                                <span>기간</span>
                                <span className="text-white">5일</span>
                            </div>
                            <div className="flex justify-between">
                                <span>예산</span>
                                <span className="text-white">$$$</span>
                            </div>
                            <div className="flex justify-between">
                                <span>여행객</span>
                                <span className="text-white">성인 2명</span>
                            </div>
                            <hr className="border-white/10" />
                            <Button className="w-full bg-white text-black hover:bg-gray-200">
                                호텔 예약하기
                            </Button>
                            <Button className="w-full bg-transparent border border-white/20 hover:bg-white/10">
                                <Share className="w-4 h-4 mr-2 inline" /> 일정 공유하기
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Calendar as CalendarIcon } from 'lucide-react';

export function MyPage() {
    const navigate = useNavigate();
    const [savedItineraries, setSavedItineraries] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('savedItineraries') || '[]');
        setSavedItineraries(saved);
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            const newSaved = savedItineraries.filter(item => item.id !== id);
            localStorage.setItem('savedItineraries', JSON.stringify(newSaved));
            setSavedItineraries(newSaved);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        navigate('/');
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            <Header />
            <style>{`
                .react-calendar {
                    background-color: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 1rem;
                    color: white;
                    font-family: inherit;
                    width: 100%;
                    max-width: 100%;
                }
                .react-calendar__navigation button {
                    color: white;
                    min-width: 44px;
                    background: none;
                    font-size: 1.1rem;
                    font-weight: bold;
                }
                .react-calendar__navigation button:enabled:hover,
                .react-calendar__navigation button:enabled:focus {
                    background-color: rgba(255, 255, 255, 0.1);
                    border-radius: 0.5rem;
                }
                .react-calendar__month-view__weekdays {
                    text-transform: uppercase;
                    font-weight: bold;
                    font-size: 0.8rem;
                    color: #9ca3af;
                }
                .react-calendar__tile {
                    color: white;
                    padding: 1rem 0.5rem;
                    background: none;
                    border-radius: 0.5rem;
                }
                .react-calendar__tile:enabled:hover,
                .react-calendar__tile:enabled:focus {
                    background-color: rgba(255, 255, 255, 0.1);
                }
                .react-calendar__tile--now {
                    background: rgba(236, 72, 153, 0.2) !important;
                    color: #f472b6 !important;
                }
                .react-calendar__tile--active {
                    background: linear-gradient(to bottom right, #ec4899, #9333ea) !important;
                    color: white !important;
                }
                .react-calendar__month-view__days__day--neighboringMonth {
                    color: #4b5563;
                }
            `}</style>
            <div className="max-w-6xl mx-auto px-6 py-24 flex flex-col lg:flex-row gap-12">

                {/* Left Column: Profile & Calendar */}
                <div className="lg:w-1/3 space-y-8">
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                                T
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">TresVien 회원님</h2>
                                <p className="text-gray-400 text-sm">test@tresvien.com</p>
                            </div>
                        </div>
                        <Button
                            onClick={handleLogout}
                            className="w-full bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20"
                        >
                            로그아웃
                        </Button>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5 text-pink-500" />
                            여행 캘린더
                        </h3>
                        <Calendar
                            onChange={setSelectedDate}
                            value={selectedDate}
                            formatDay={(locale, date) => date.getDate()}
                            className="shadow-xl"
                        />
                    </div>
                </div>

                {/* Right Column: Itinerary List (Independent) */}
                <div className="lg:w-2/3">
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm min-h-[600px]">
                        <h3 className="text-2xl font-bold mb-8">내 여행 일정</h3>

                        {savedItineraries.length === 0 ? (
                            <p className="text-gray-400">저장된 여행 일정이 없습니다.</p>
                        ) : (
                            <div className="grid gap-4">
                                {savedItineraries.map((item) => (
                                    <div key={item.id} className="bg-white/5 p-4 rounded-xl flex justify-between items-center hover:bg-white/10 transition-colors">
                                        <div>
                                            <h4 className="font-bold text-lg">{item.destination} 여행</h4>
                                            <p className="text-sm text-gray-400">{item.days}일 코스 • {item.date} 저장됨</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => navigate(`/itinerary/${item.destination}`, { state: { itineraryData: item.data } })}
                                                className="bg-white/10 hover:bg-white/20 text-sm px-4 py-2"
                                            >
                                                보기
                                            </Button>
                                            <Button
                                                onClick={() => handleDelete(item.id)}
                                                className="bg-red-500/10 text-red-500 hover:bg-red-500/20 text-sm px-4 py-2"
                                            >
                                                삭제
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

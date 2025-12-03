import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { MapPin, Calendar, Share, Star, Clock, FileImage } from 'lucide-react';

export function Itinerary() {
    const { destination } = useParams();
    const location = useLocation();
    const [loading, setLoading] = useState(true);

    // Get dynamic data from chat if available
    const dynamicItinerary = location.state?.itineraryData;

    // Parse duration from destination string (Fallback)
    const parseDuration = (text) => {
        const decoded = decodeURIComponent(text || '');
        if (decoded.includes('당일')) return 1;
        const nightDayMatch = decoded.match(/(\d+)박\s*(\d+)일/);
        if (nightDayMatch) return parseInt(nightDayMatch[2], 10);
        const dayMatch = decoded.match(/(\d+)일/);
        if (dayMatch) return parseInt(dayMatch[1], 10);
        return 3;
    };

    // Normalize data from Chat or API
    const { days, schedule } = React.useMemo(() => {
        if (!dynamicItinerary) {
            // Fallback for static/url-based access
            const d = parseDuration(destination);
            return {
                days: d,
                schedule: null
            };
        }

        // Case 1: API Response (Array of days)
        if (Array.isArray(dynamicItinerary.itinerary)) {
            const sched = {};
            dynamicItinerary.itinerary.forEach(dayPlan => {
                sched[dayPlan.day] = dayPlan.schedule.map(item => ({
                    time: item.start_time,
                    place: item.place.name,
                    description: item.place.description
                }));
            });
            return {
                days: dynamicItinerary.duration_days,
                schedule: sched
            };
        }

        // Case 2: Chat Response (Object with schedule key)
        return {
            days: dynamicItinerary.days,
            schedule: dynamicItinerary.schedule
        };
    }, [dynamicItinerary, destination]);

    const itineraryDays = schedule
        ? Object.keys(schedule).map(d => parseInt(d))
        : Array.from({ length: days }, (_, i) => i + 1);

    useEffect(() => {
        // Simulate API call
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, [destination]);

    const [showPamphlet, setShowPamphlet] = useState(false);

    // Hotel Update State
    const [showHotelModal, setShowHotelModal] = useState(false);
    const [updatingHotel, setUpdatingHotel] = useState(false);
    const [currentSchedule, setCurrentSchedule] = useState(null);

    // Place Replacement State
    const [showPlaceModal, setShowPlaceModal] = useState(false);
    const [replacingPlace, setReplacingPlace] = useState(false);
    const [selectedPlaceToReplace, setSelectedPlaceToReplace] = useState(null);
    const [selectedDayForReplace, setSelectedDayForReplace] = useState(null);

    // Update local schedule when dynamicItinerary changes
    useEffect(() => {
        if (schedule) {
            setCurrentSchedule(schedule);
        }
    }, [schedule]);

    const handleGeneratePamphlet = () => {
        alert(`${destination} 여행 팸플릿을 생성 중입니다...\n(잠시만 기다려주세요)`);
        setTimeout(() => {
            setShowPamphlet(true);
        }, 1000);
    };

    // Hotel Options (Mock)
    const hotelOptions = [
        { name: '신라호텔', latitude: 37.556, longitude: 127.005 },
        { name: '롯데호텔 서울', latitude: 37.565, longitude: 126.981 },
        { name: '포시즌스 호텔', latitude: 37.570, longitude: 126.975 },
        { name: '시그니엘 서울', latitude: 37.512, longitude: 127.102 },
        { name: '웨스틴 조선', latitude: 37.564, longitude: 126.980 }
    ];

    const handleUpdateHotel = async (newHotel) => {
        setUpdatingHotel(true);
        try {
            // Collect all currently selected places to keep them
            const allPlaces = [];
            Object.values(currentSchedule).forEach(daySchedule => {
                daySchedule.forEach(item => {
                    allPlaces.push({
                        name: item.place,
                        description: item.description,
                        // Add other fields if available in item, or backend handles it
                    });
                });
            });

            const result = await import('../api/travelService').then(m => m.travelService.updateHotel({
                destination,
                duration_days: days,
                selected_places: allPlaces, // This might need refinement based on backend expectation
                new_hotel: newHotel
            }));

            // Update schedule with new result
            const newSched = {};
            result.itinerary.forEach(dayPlan => {
                newSched[dayPlan.day] = dayPlan.schedule.map(item => ({
                    time: item.start_time,
                    place: item.place.name,
                    description: item.place.description
                }));
            });
            setCurrentSchedule(newSched);
            setShowHotelModal(false);
            alert('숙소가 변경되고 일정이 재계산되었습니다!');
        } catch (error) {
            console.error('Failed to update hotel:', error);
            alert('숙소 변경에 실패했습니다.');
        } finally {
            setUpdatingHotel(false);
        }
    };

    // Place Replacement Options (Mock - ideally dynamic based on type)
    const replacementOptions = [
        { name: '남산타워', type: 'attraction', description: '서울의 랜드마크, 전망대' },
        { name: '익선동 한옥거리', type: 'culture', description: '트렌디한 한옥 카페와 맛집' },
        { name: '더현대 서울', type: 'shopping', description: '최신 트렌드 쇼핑몰' },
        { name: '청계천', type: 'nature', description: '도심 속 휴식 공간' },
        { name: '국립중앙박물관', type: 'museum', description: '한국의 역사와 문화' }
    ];

    const handleReplacePlace = async (newPlace) => {
        setReplacingPlace(true);
        try {
            // Flatten current schedule to find all places
            const allPlaces = [];
            Object.values(currentSchedule).forEach(daySchedule => {
                daySchedule.forEach(item => {
                    allPlaces.push({
                        name: item.place,
                        // Add mock lat/lon if needed by backend, or backend handles lookup
                        latitude: 0,
                        longitude: 0
                    });
                });
            });

            const result = await import('../api/travelService').then(m => m.travelService.replacePlace({
                day: selectedDayForReplace,
                old_place: { name: selectedPlaceToReplace.place },
                new_place: { ...newPlace, latitude: 0, longitude: 0 }, // Backend needs lat/lon
                all_places: allPlaces,
                duration_days: days
            }));

            // Update only the specific day's schedule
            const updatedDaySchedule = result.updated_itinerary[selectedDayForReplace - 1].schedule.map(item => ({
                time: item.start_time,
                place: item.place.name,
                description: item.place.description
            }));

            setCurrentSchedule(prev => ({
                ...prev,
                [selectedDayForReplace]: updatedDaySchedule
            }));

            setShowPlaceModal(false);
            alert('장소가 교체되었습니다!');
        } catch (error) {
            console.error('Failed to replace place:', error);
            alert('장소 교체에 실패했습니다.');
        } finally {
            setReplacingPlace(false);
        }
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
                                {day}일차: {dynamicItinerary ? '여행 코스' : '탐험 및 문화 체험'}
                            </h3>

                            <div className="space-y-6">
                                {currentSchedule ? (
                                    // Dynamic Schedule Rendering
                                    currentSchedule[day]?.map((activity, idx) => (
                                        <div key={idx} className="group bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 shadow-lg relative">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-pink-500/20 rounded-xl text-pink-400">
                                                        <Clock className="w-5 h-5" />
                                                    </div>
                                                    <h4 className="text-xl font-bold">{activity.place}</h4>
                                                </div>
                                                <span className="text-sm text-gray-400 font-mono">{activity.time}</span>
                                            </div>
                                            <p className="text-gray-300 leading-relaxed pl-14 mb-4">
                                                {activity.description}
                                            </p>

                                            {/* Replace Button (Visible on Hover) */}
                                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => {
                                                        setSelectedPlaceToReplace(activity);
                                                        setSelectedDayForReplace(day);
                                                        setShowPlaceModal(true);
                                                    }}
                                                    className="bg-white/10 hover:bg-white/20 text-xs px-3 py-1 rounded-full border border-white/20 backdrop-blur-md"
                                                >
                                                    🔄 교체
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    // Fallback Static Schedule
                                    <>
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
                                        {/* ... (keep other static items if needed, or just replace all) */}
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sidebar */}
                <div className="w-full md:w-96">
                    <div className="md:sticky md:top-24 space-y-8">
                        {/* Map */}
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden h-80 shadow-2xl">
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

                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
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
                                <Button className="w-full bg-white text-black hover:bg-gray-200 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-white/20 transition-all"
                                    onClick={() => setShowHotelModal(true)}
                                >
                                    호텔 변경하기
                                </Button>
                                <Button className="w-full bg-transparent border border-white/20 hover:bg-white/10 py-4 rounded-xl text-gray-300 hover:text-white transition-all">
                                    <Share className="w-5 h-5 mr-2 inline" /> 일정 공유하기
                                </Button>
                                <Button
                                    onClick={() => {
                                        if (!dynamicItinerary) {
                                            alert('저장할 일정이 없습니다.');
                                            return;
                                        }

                                        const savedItineraries = JSON.parse(localStorage.getItem('savedItineraries') || '[]');
                                        const newItinerary = {
                                            id: Date.now(),
                                            destination: destination,
                                            date: new Date().toLocaleDateString(),
                                            data: dynamicItinerary,
                                            days: days
                                        };

                                        localStorage.setItem('savedItineraries', JSON.stringify([...savedItineraries, newItinerary]));
                                        alert('일정이 마이페이지에 저장되었습니다!');
                                    }}
                                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90 py-4 rounded-xl font-bold text-lg shadow-lg transition-all"
                                >
                                    <Star className="w-5 h-5 mr-2 inline" /> 일정 저장하기
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hotel Change Modal */}
            {showHotelModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setShowHotelModal(false)}>
                    <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold mb-4 text-white">숙소 변경</h3>
                        <p className="text-gray-400 mb-6 text-sm">숙소를 변경하면 최적 경로가 다시 계산됩니다.</p>

                        <div className="space-y-3">
                            {hotelOptions.map((hotel, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleUpdateHotel(hotel)}
                                    disabled={updatingHotel}
                                    className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex justify-between items-center group"
                                >
                                    <span className="font-bold text-white group-hover:text-pink-400 transition-colors">{hotel.name}</span>
                                    {updatingHotel && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>}
                                </button>
                            ))}
                        </div>

                        <Button
                            className="mt-6 w-full bg-transparent border border-white/20 text-gray-400 hover:text-white py-3"
                            onClick={() => setShowHotelModal(false)}
                        >
                            취소
                        </Button>
                    </div>
                </div>
            )}

            {/* Place Replace Modal */}
            {showPlaceModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setShowPlaceModal(false)}>
                    <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold mb-2 text-white">장소 교체</h3>
                        <p className="text-gray-400 mb-6 text-sm">
                            <span className="text-pink-400 font-bold">{selectedPlaceToReplace?.place}</span> 대신 갈 곳을 선택하세요.
                        </p>

                        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                            {replacementOptions.map((place, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleReplacePlace(place)}
                                    disabled={replacingPlace}
                                    className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group"
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-bold text-white group-hover:text-purple-400 transition-colors">{place.name}</span>
                                        <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-400">{place.type}</span>
                                    </div>
                                    <p className="text-xs text-gray-500">{place.description}</p>
                                </button>
                            ))}
                        </div>

                        <Button
                            className="mt-6 w-full bg-transparent border border-white/20 text-gray-400 hover:text-white py-3"
                            onClick={() => setShowPlaceModal(false)}
                        >
                            취소
                        </Button>
                    </div>
                </div>
            )}
        </div >
    );
}

import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { MapPin, Calendar, Share, Star, Clock, FileImage, Navigation, Bus, Footprints, Car, Bike, X } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to update map view bounds
function ChangeView({ bounds }) {
    const map = useMap();
    useEffect(() => {
        if (bounds && bounds.length > 0) {
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [bounds, map]);
    return null;
}

function TravelModeSelector({ distanceKm, initialMode, initialTimeMin, start, end }) {
    const [selectedMode, setSelectedMode] = useState(initialMode || 'walk');

    // Estimate time based on mode and distance
    const estimatedTime = React.useMemo(() => {
        if (!distanceKm) return 0;

        // Speeds in km/h
        const speeds = {
            walk: 4,
            bike: 15,
            bus: 20, // Average city bus speed including stops
            car: 30  // Average city driving speed
        };

        // Base time in minutes
        let time = (distanceKm / speeds[selectedMode]) * 60;

        // Add penalties/buffers
        if (selectedMode === 'bus') time += 10; // Wait time
        if (selectedMode === 'car') time += 5;  // Parking/Traffic buffer

        // If it's the initial mode provided by backend, use that exact time
        if (selectedMode === initialMode && initialTimeMin) {
            return initialTimeMin;
        }

        return Math.round(time);
    }, [distanceKm, selectedMode, initialMode, initialTimeMin]);

    const modes = [
        { id: 'walk', icon: Footprints, label: '도보' },
        { id: 'bike', icon: Bike, label: '자전거' },
        { id: 'bus', icon: Bus, label: '대중교통' },
        { id: 'car', icon: Car, label: '자동차' },
    ];

    const handleGoClick = (e) => {
        e.stopPropagation();

        // For Uber (car), we only strictly need the destination (end)
        // For Naver Map, we need both start and end
        if (selectedMode !== 'car' && (!start || !end)) {
            alert('출발지 또는 도착지 정보가 부족합니다.');
            return;
        }

        if (selectedMode === 'car') {
            if (!end) {
                alert('도착지 정보가 부족합니다.');
                return;
            }

            // Uber Universal Link
            // https://developer.uber.com/docs/riders/ride-requests/tutorials/deep-links/introduction
            let uberUrl = `https://m.uber.com/ul/?action=setPickup&dropoff[latitude]=${end.lat}&dropoff[longitude]=${end.lng}&dropoff[nickname]=${encodeURIComponent(end.name)}`;

            if (start) {
                uberUrl += `&pickup[latitude]=${start.lat}&pickup[longitude]=${start.lng}&pickup[nickname]=${encodeURIComponent(start.name)}`;
            } else {
                uberUrl += `&pickup=my_location`;
            }

            window.open(uberUrl, '_blank');
            return;
        }

        // Map internal modes to Naver Map modes
        const naverModes = {
            walk: 'walk',
            bike: 'bicycle',
            bus: 'transit',
            car: 'driving'
        };

        const mode = naverModes[selectedMode] || 'walk';
        const url = `https://map.naver.com/v5/directions/${start.lng},${start.lat},${encodeURIComponent(start.name)}/${end.lng},${end.lat},${encodeURIComponent(end.name)}/${mode}`;

        window.open(url, '_blank');
    };

    return (
        <div className="ml-12 mb-6 flex items-center gap-4 text-sm bg-white/5 p-2 rounded-2xl border border-white/5 w-fit backdrop-blur-md">
            <div className="flex gap-1 bg-black/20 p-1 rounded-xl">
                {modes.map((mode) => (
                    <button
                        key={mode.id}
                        onClick={() => setSelectedMode(mode.id)}
                        className={`p-2 rounded-lg transition-all ${selectedMode === mode.id
                            ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg'
                            : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                            }`}
                        title={mode.label}
                    >
                        <mode.icon className="w-4 h-4" />
                    </button>
                ))}
            </div>
            <div className="flex items-center gap-3 pr-4 border-r border-white/10 mr-2">
                <span className="font-mono text-lg font-bold text-pink-400">
                    {estimatedTime}<span className="text-xs text-gray-400 ml-1">분</span>
                </span>
                <span className="text-gray-700">|</span>
                <span className="text-gray-400 text-xs">{distanceKm}km</span>
            </div>
            <button
                onClick={handleGoClick}
                className="bg-white text-black hover:bg-gray-200 px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 transition-colors"
            >
                GO! <Navigation className="w-3 h-3" />
            </button>
        </div>
    );
}

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
                    description: item.place.description,
                    type: item.place.type || 'attraction',
                    latitude: item.place.latitude || 0,
                    longitude: item.place.longitude || 0,
                    image_url: item.place.image_url,
                    category: item.place.category,
                    travel_from_previous: item.travel_from_previous
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

    // State for currently selected day to show on map
    const [selectedDay, setSelectedDay] = useState(1);

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

    // Share Modal State
    const [showShareModal, setShowShareModal] = useState(false);

    // Large Map State
    const [showLargeMap, setShowLargeMap] = useState(false);

    // Update local schedule when dynamicItinerary changes
    useEffect(() => {
        if (schedule) {
            setCurrentSchedule(schedule);
        }
    }, [schedule]);

    const navigate = useNavigate();

    const handleGeneratePamphlet = () => {
        navigate('/pamphlet', {
            state: {
                destination,
                days,
                budget: location.state?.budget,
                travelers: location.state?.travelers,
                duration: days,
                itineraryData: dynamicItinerary || { schedule: currentSchedule }
            }
        });
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
                        type: item.type || 'attraction',
                        latitude: item.latitude || 0,
                        longitude: item.longitude || 0
                    });
                });
            });

            const result = await import('../api/travelService').then(m => m.travelService.updateHotel({
                destination,
                duration_days: days,
                selected_places: allPlaces,
                new_hotel: newHotel,
                travel_styles: location.state?.styles || [],
                requirements: location.state?.requirements || []
            }));

            // Update schedule with new result
            const newSched = {};
            result.itinerary.forEach(dayPlan => {
                newSched[dayPlan.day] = dayPlan.schedule.map(item => ({
                    time: item.start_time,
                    place: item.place.name,
                    description: item.place.description,
                    type: item.place.type || 'attraction',
                    latitude: item.place.latitude || 0,
                    longitude: item.place.longitude || 0,
                    image_url: item.place.image_url,
                    category: item.place.category,
                    travel_from_previous: item.travel_from_previous
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
        { name: '남산타워', type: 'attraction', description: '서울의 랜드마크, 전망대', image_url: 'https://images.unsplash.com/photo-1604975999077-ad6379979350?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: ['랜드마크', '전망대'] },
        { name: '익선동 한옥거리', type: 'culture', description: '트렌디한 한옥 카페와 맛집', image_url: 'https://images.unsplash.com/photo-1604362610191-031201509312?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: ['한옥', '카페', '맛집'] },
        { name: '더현대 서울', type: 'shopping', description: '최신 트렌드 쇼핑몰', image_url: 'https://images.unsplash.com/photo-1620792196720-31278144211a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: ['쇼핑', '백화점'] },
        { name: '청계천', type: 'nature', description: '도심 속 휴식 공간', image_url: 'https://images.unsplash.com/photo-1582234302560-f002d9635f28?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: ['자연', '산책'] },
        { name: '국립중앙박물관', type: 'museum', description: '한국의 역사와 문화', image_url: 'https://images.unsplash.com/photo-1604362610191-031201509312?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: ['박물관', '역사', '문화'] }
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
                        description: item.description,
                        type: item.type || 'attraction',
                        latitude: item.latitude || 0,
                        longitude: item.longitude || 0
                    });
                });
            });

            const result = await import('../api/travelService').then(m => m.travelService.replacePlace({
                day: selectedDayForReplace,
                old_place: {
                    name: selectedPlaceToReplace.place,
                    latitude: selectedPlaceToReplace.latitude || 0,
                    longitude: selectedPlaceToReplace.longitude || 0
                },
                new_place: { ...newPlace, latitude: 0, longitude: 0 }, // Backend needs lat/lon
                all_places: allPlaces,
                duration_days: days
            }));

            // Update only the specific day's schedule
            const updatedDaySchedule = result.updated_itinerary[selectedDayForReplace - 1].schedule.map(item => ({
                time: item.start_time,
                place: item.place.name,
                description: item.place.description,
                type: item.place.type || 'attraction',
                latitude: item.place.latitude || 0,
                longitude: item.place.longitude || 0,
                image_url: item.place.image_url,
                category: item.place.category,
                travel_from_previous: item.travel_from_previous
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

    // Prepare Map Data for Selected Day
    const mapData = React.useMemo(() => {
        if (!currentSchedule || !currentSchedule[selectedDay]) return { positions: [], bounds: [] };

        const daySchedule = currentSchedule[selectedDay];
        const positions = daySchedule
            .filter(item => item.latitude && item.longitude)
            .map(item => ({
                lat: item.latitude,
                lng: item.longitude,
                name: item.place,
                type: item.type
            }));

        const bounds = positions.map(p => [p.lat, p.lng]);
        return { positions, bounds };
    }, [currentSchedule, selectedDay]);

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
            <div className="relative h-[40vh] overflow-hidden group">
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
                                <h1 className="text-5xl md:text-7xl font-black tracking-tighter capitalize mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
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
            <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
                {/* Itinerary Timeline */}
                <div className="flex-1 space-y-16">
                    {itineraryDays.map((day) => (
                        <div key={day} className="relative pl-10 border-l-2 border-white/10" onClick={() => setSelectedDay(day)}>
                            <div className={`absolute -left-[13px] top-0 w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg transition-all cursor-pointer ${selectedDay === day ? 'bg-gradient-to-br from-pink-500 to-purple-600 scale-125' : 'bg-gray-700 hover:bg-gray-600'}`}>
                                {day}
                            </div>
                            <h3 className={`text-3xl font-bold mb-8 transition-colors cursor-pointer ${selectedDay === day ? 'text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400' : 'text-gray-600 hover:text-gray-400'}`}>
                                {day}일차: {dynamicItinerary ? '여행 코스' : '탐험 및 문화 체험'}
                            </h3>

                            <div className={`space-y-6 ${selectedDay === day ? 'opacity-100' : 'opacity-50 grayscale hover:opacity-80 hover:grayscale-0 transition-all'}`}>
                                {currentSchedule ? (
                                    // Dynamic Schedule Rendering
                                    currentSchedule[day]?.map((activity, idx) => (
                                        <div key={idx} className="relative">
                                            {/* Travel Connector Info */}
                                            {/* Travel Connector Info */}
                                            {activity.travel_from_previous && (
                                                <TravelModeSelector
                                                    distanceKm={activity.travel_from_previous.distance_km}
                                                    initialMode={activity.travel_from_previous.mode}
                                                    initialTimeMin={activity.travel_from_previous.time_minutes}
                                                    start={idx > 0 ? {
                                                        name: currentSchedule[day][idx - 1].place,
                                                        lat: currentSchedule[day][idx - 1].latitude,
                                                        lng: currentSchedule[day][idx - 1].longitude
                                                    } : null}
                                                    end={{
                                                        name: activity.place,
                                                        lat: activity.latitude,
                                                        lng: activity.longitude
                                                    }}
                                                />
                                            )}

                                            <div className="group bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 shadow-lg relative overflow-hidden">
                                                {/* Background Image Gradient Overlay */}
                                                {activity.image_url && (
                                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
                                                        <img src={activity.image_url} alt="" className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/80"></div>
                                                    </div>
                                                )}

                                                <div className="relative z-10 flex gap-6">
                                                    {/* Time & Icon */}
                                                    <div className="flex flex-col items-center gap-2 min-w-[60px]">
                                                        <div className="p-3 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-2xl text-pink-400 border border-pink-500/20">
                                                            <Clock className="w-6 h-6" />
                                                        </div>
                                                        <span className="text-xs font-mono text-gray-400">{activity.time}</span>
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <h4 className="text-xl font-bold text-white mb-1">{activity.place}</h4>
                                                                <div className="flex flex-wrap gap-2 mb-3">
                                                                    {activity.category?.slice(0, 3).map((cat, i) => (
                                                                        <span key={i} className="text-[10px] px-2 py-1 bg-white/10 rounded-full text-gray-300">
                                                                            #{cat}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            {/* Replace Button */}
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedPlaceToReplace(activity);
                                                                    setSelectedDayForReplace(day);
                                                                    setShowPlaceModal(true);
                                                                }}
                                                                className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 hover:bg-white/20 text-xs px-3 py-1 rounded-full border border-white/20 backdrop-blur-md"
                                                            >
                                                                🔄 교체
                                                            </button>
                                                        </div>
                                                        <p className="text-gray-400 text-sm leading-relaxed">
                                                            {activity.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    // Fallback Static Schedule
                                    <div className="p-8 text-center text-gray-500">
                                        일정을 불러오는 중입니다...
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sidebar (Map & Summary) */}
                <div className="w-full lg:w-[450px]">
                    <div className="lg:sticky lg:top-24 space-y-8">
                        {/* Interactive Map */}
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden h-[500px] shadow-2xl relative z-0">
                            <MapContainer
                                center={[37.5665, 126.9780]}
                                zoom={12}
                                style={{ height: '100%', width: '100%' }}
                                className="z-0"
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                />
                                <ChangeView bounds={mapData.bounds} />

                                {/* Route Line */}
                                {mapData.positions.length > 1 && (
                                    <Polyline
                                        positions={mapData.positions.map(p => [p.lat, p.lng])}
                                        color="#ec4899" // Pink-500
                                        weight={4}
                                        opacity={0.7}
                                        dashArray="10, 10"
                                    />
                                )}

                                {/* Markers */}
                                {mapData.positions.map((pos, idx) => (
                                    <Marker key={idx} position={[pos.lat, pos.lng]}>
                                        <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent={false}>
                                            <div className="font-bold text-sm">{pos.name}</div>
                                            <div className="text-xs text-gray-500 capitalize">{pos.type}</div>
                                        </Tooltip>
                                        <Popup className="text-black">
                                            <div className="font-bold">{idx + 1}. {pos.name}</div>
                                            <div className="text-xs text-gray-600 capitalize">{pos.type}</div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>

                            {/* Map Overlay Controls */}
                            <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 z-[400]">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="font-bold text-sm">Day {selectedDay} 루트</h4>
                                        <p className="text-xs text-gray-400">{mapData.positions.length}개 장소 방문</p>
                                    </div>
                                    <Button
                                        size="sm"
                                        className="bg-white text-black hover:bg-gray-200 text-xs h-8"
                                        onClick={() => setShowLargeMap(true)}
                                    >
                                        크게 보기
                                    </Button>
                                </div>
                            </div>
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
                                    <span className="text-white font-bold">{location.state?.budget || '미정'}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white/5 rounded-2xl">
                                    <span>여행객</span>
                                    <span className="text-white font-bold">성인 {location.state?.travelers || 2}명</span>
                                </div>
                                <hr className="border-white/10" />
                                <Button className="w-full bg-white text-black hover:bg-gray-200 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-white/20 transition-all"
                                    onClick={() => setShowHotelModal(true)}
                                >
                                    호텔 변경하기
                                </Button>
                                <Button
                                    className="w-full bg-transparent border border-white/20 hover:bg-white/10 py-4 rounded-xl text-gray-300 hover:text-white transition-all"
                                    onClick={() => setShowShareModal(true)}
                                >
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
            {/* Share Modal */}
            {showShareModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setShowShareModal(false)}>
                    <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold mb-6 text-white">일정 공유하기</h3>

                        <div className="space-y-4">
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    alert('링크가 복사되었습니다!');
                                    setShowShareModal(false);
                                }}
                                className="w-full bg-white text-black hover:bg-gray-200 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                            >
                                <Users className="w-5 h-5" /> 친구 초대하기 (링크 복사)
                            </button>

                            <button
                                onClick={() => {
                                    alert('카카오톡 공유 기능은 준비 중입니다.\n(링크 복사를 이용해주세요)');
                                }}
                                className="w-full bg-[#FEE500] text-[#000000] hover:opacity-90 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-opacity"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.707 4.8 4.27 6.054-.188.702-.682 2.545-.78 2.94-.122.49.178.483.376.351.265-.176 2.924-1.986 3.386-2.296.564.08 1.144.122 1.748.122 4.97 0 9-3.185 9-7.115S16.97 3 12 3z" /></svg>
                                카카오톡 공유하기
                            </button>
                        </div>

                        <button
                            className="mt-6 text-gray-500 hover:text-white text-sm underline"
                            onClick={() => setShowShareModal(false)}
                        >
                            닫기
                        </button>
                    </div>
                </div>
            )}
            {/* Large Map Modal */}
            {showLargeMap && (
                <div className="fixed inset-0 z-[200] bg-black/90 flex flex-col">
                    <div className="p-4 flex justify-between items-center bg-black/50 backdrop-blur-md border-b border-white/10">
                        <h3 className="text-xl font-bold text-white">지도 크게 보기</h3>
                        <button
                            onClick={() => setShowLargeMap(false)}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="flex-1 relative">
                        <MapContainer
                            center={[37.5665, 126.9780]}
                            zoom={12}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            />
                            <ChangeView bounds={mapData.bounds} />

                            {/* Route Line */}
                            {mapData.positions.length > 1 && (
                                <Polyline
                                    positions={mapData.positions.map(p => [p.lat, p.lng])}
                                    color="#ec4899" // Pink-500
                                    weight={4}
                                    opacity={0.7}
                                    dashArray="10, 10"
                                />
                            )}

                            {/* Markers */}
                            {mapData.positions.map((pos, idx) => (
                                <Marker key={idx} position={[pos.lat, pos.lng]}>
                                    <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent={false}>
                                        <div className="font-bold text-sm">{pos.name}</div>
                                        <div className="text-xs text-gray-500 capitalize">{pos.type}</div>
                                    </Tooltip>
                                    <Popup className="text-black">
                                        <div className="font-bold">{idx + 1}. {pos.name}</div>
                                        <div className="text-xs text-gray-600 capitalize">{pos.type}</div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </div>
            )}
        </div >
    );
}

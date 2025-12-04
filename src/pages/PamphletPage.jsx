import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, Users, ArrowLeft, Clock, Map as MapIcon } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export function PamphletPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { itineraryData, budget, duration, travelers, destination } = location.state || {};

    if (!itineraryData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">데이터가 없습니다.</h2>
                    <button
                        onClick={() => navigate('/')}
                        className="text-blue-600 hover:underline"
                    >
                        홈으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    // Normalize schedule data
    const schedule = React.useMemo(() => {
        if (Array.isArray(itineraryData.itinerary)) {
            const sched = {};
            itineraryData.itinerary.forEach(dayPlan => {
                sched[dayPlan.day] = dayPlan.schedule;
            });
            return sched;
        }
        return itineraryData.schedule || {};
    }, [itineraryData]);

    const days = Object.keys(schedule).sort((a, b) => parseInt(a) - parseInt(b));

    // Collect all positions for map bounds
    const allPositions = React.useMemo(() => {
        const positions = [];
        Object.values(schedule).forEach(dayItems => {
            dayItems.forEach(item => {
                if (item.place?.latitude && item.place?.longitude) {
                    positions.push([item.place.latitude, item.place.longitude]);
                } else if (item.latitude && item.longitude) {
                    positions.push([item.latitude, item.longitude]);
                }
            });
        });
        return positions;
    }, [schedule]);

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            {/* Navigation Bar (No-print) */}
            <div className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center bg-white/80 backdrop-blur-sm border-b border-gray-200 z-50 print:hidden">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" /> 돌아가기
                </button>
                <div className="flex gap-4">
                    <button
                        onClick={() => window.open('https://www.instagram.com/', '_blank')}
                        className="bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white px-4 py-2 rounded-full hover:opacity-90 transition-opacity font-bold text-sm flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                        Instagram 공유
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors font-bold text-sm"
                    >
                        PDF로 저장 / 인쇄
                    </button>
                </div>
            </div>

            {/* Pamphlet Content */}
            <div className="max-w-[210mm] mx-auto bg-white shadow-2xl min-h-screen my-8 print:m-0 print:shadow-none print:w-full print:max-w-none overflow-hidden">

                {/* Hero Header */}
                <div className="relative h-[300px] w-full overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1920&q=80"
                        alt={destination}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full p-8 text-white">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-sm tracking-[0.5em] uppercase mb-2 opacity-80">Travel Itinerary</p>
                                <h1 className="text-6xl font-black tracking-tight">{destination}</h1>
                            </div>
                            <div className="flex gap-6 text-sm font-medium opacity-90">
                                <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {duration} Days</span>
                                <span className="flex items-center gap-2"><Users className="w-4 h-4" /> {travelers || '2'} Travelers</span>
                                <span className="flex items-center gap-2"><DollarSign className="w-4 h-4" /> {budget || 'TBD'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    {/* Map Strip */}
                    <div className="mb-8 h-[150px] w-full bg-gray-100 rounded-xl overflow-hidden border border-gray-200 grayscale print:grayscale-0">
                        <MapContainer
                            bounds={allPositions.length > 0 ? allPositions : [[37.5665, 126.9780]]}
                            zoom={10}
                            style={{ height: '100%', width: '100%' }}
                            zoomControl={false}
                            attributionControl={false}
                            dragging={false}
                            scrollWheelZoom={false}
                        >
                            <TileLayer
                                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                            />
                            {allPositions.map((pos, idx) => (
                                <Marker key={idx} position={pos} />
                            ))}
                            {allPositions.length > 1 && (
                                <Polyline positions={allPositions} color="#000" weight={2} dashArray="5, 5" />
                            )}
                        </MapContainer>
                    </div>

                    {/* Grid Layout for Days */}
                    <div className="grid grid-cols-2 gap-8">
                        {days.map((day) => (
                            <div key={day} className="break-inside-avoid mb-4">
                                <div className="flex items-center gap-3 mb-4 border-b-2 border-black pb-2">
                                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg">
                                        {day}
                                    </div>
                                    <h3 className="text-xl font-bold uppercase tracking-wide">Day {day}</h3>
                                </div>

                                <div className="space-y-4">
                                    {schedule[day]?.map((item, idx) => (
                                        <div key={idx} className="flex gap-3 group">
                                            {/* Time Column */}
                                            <div className="w-12 pt-1 text-right">
                                                <span className="text-xs font-bold text-gray-400 font-mono block">
                                                    {item.time || item.start_time}
                                                </span>
                                            </div>

                                            {/* Content Card */}
                                            <div className="flex-1 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 hover:border-gray-300 transition-colors">
                                                <div className="flex">
                                                    {/* Image (Small Square) */}
                                                    {(item.place?.image_url || item.image_url) && (
                                                        <div className="w-20 h-20 flex-shrink-0">
                                                            <img
                                                                src={item.place?.image_url || item.image_url}
                                                                alt=""
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    )}

                                                    <div className="p-3 flex-1 min-w-0">
                                                        <h4 className="font-bold text-sm text-gray-900 truncate">
                                                            {item.place?.name || item.place}
                                                        </h4>
                                                        <div className="flex flex-wrap gap-1 mt-1 mb-1">
                                                            {(item.place?.category || item.category || []).slice(0, 2).map((cat, i) => (
                                                                <span key={i} className="text-[9px] uppercase tracking-wider bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-500">
                                                                    {cat}
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <p className="text-xs text-gray-500 line-clamp-2 leading-snug">
                                                            {item.place?.description || item.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-8 pt-6 border-t border-gray-100 text-center text-gray-400 text-[10px] uppercase tracking-widest pb-8">
                    Designed by GalleMalle AI Planner
                </footer>
            </div>
        </div>
    );
}

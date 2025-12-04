import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, Users, ArrowLeft, Clock, Map as MapIcon } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
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
        <div className="min-h-screen bg-[#f5f5f0] text-gray-900 font-serif">
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
                        onClick={() => window.print()}
                        className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors font-sans text-sm font-bold"
                    >
                        PDF로 저장 / 인쇄
                    </button>
                </div>
            </div>

            {/* Pamphlet Content */}
            <div className="max-w-[210mm] mx-auto bg-white shadow-2xl min-h-screen my-8 p-12 print:m-0 print:shadow-none print:w-full print:max-w-none">

                {/* Header Section */}
                <header className="text-center border-b-4 border-double border-gray-800 pb-8 mb-12">
                    <div className="text-sm tracking-[0.3em] text-gray-500 uppercase mb-4">Travel Itinerary</div>
                    <h1 className="text-6xl font-bold mb-6 text-gray-900">{destination}</h1>
                    <div className="flex justify-center gap-8 text-sm font-sans text-gray-600">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{duration} Days</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{travelers || '성인 2명'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            <span>{budget || 'Budget TBD'}</span>
                        </div>
                    </div>
                </header>

                {/* Map Section */}
                <div className="mb-12 h-[300px] w-full bg-gray-100 rounded-xl overflow-hidden border border-gray-200 grayscale hover:grayscale-0 transition-all duration-500 print:grayscale-0">
                    <MapContainer
                        bounds={allPositions.length > 0 ? allPositions : [[37.5665, 126.9780]]}
                        zoom={10}
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={false}
                        attributionControl={false}
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

                {/* Timeline Section */}
                <div className="space-y-12">
                    {days.map((day) => (
                        <div key={day} className="break-inside-avoid">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-xl font-bold font-sans">
                                    {day}
                                </div>
                                <h3 className="text-2xl font-bold border-b-2 border-gray-200 flex-1 pb-2">Day {day}</h3>
                            </div>

                            <div className="pl-6 border-l border-gray-300 ml-6 space-y-8">
                                {schedule[day]?.map((item, idx) => (
                                    <div key={idx} className="relative pl-8">
                                        <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 bg-gray-400 rounded-full ring-4 ring-white"></div>
                                        <div className="flex gap-4 items-start">
                                            <div className="min-w-[80px] font-sans text-sm text-gray-500 pt-1">
                                                {item.time || item.start_time}
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold text-gray-900 mb-1">
                                                    {item.place?.name || item.place}
                                                </h4>
                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                    {item.place?.description || item.description}
                                                </p>
                                                {(item.place?.category || item.category) && (
                                                    <div className="flex gap-2 mt-2">
                                                        {(item.place?.category || item.category || []).slice(0, 3).map((cat, i) => (
                                                            <span key={i} className="text-[10px] uppercase tracking-wider bg-gray-100 px-2 py-1 rounded text-gray-500">
                                                                {cat}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-gray-400 text-sm font-sans">
                    <p>Created with GalleMalle AI Planner</p>
                </footer>
            </div>
        </div>
    );
}

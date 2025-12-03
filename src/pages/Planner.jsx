import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { travelService } from '../api/travelService';
import { MapPin, Calendar, DollarSign, Compass, FileText, Loader2 } from 'lucide-react';

export function Planner() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        destination: '',
        duration: 2,
        budget: '',
        styles: [],
        requirements: ''
    });

    const travelStyles = [
        { id: 'healing', label: '🌿 힐링', value: '힐링' },
        { id: 'food', label: '🍽️ 맛집', value: '맛집' },
        { id: 'activity', label: '🏄 액티비티', value: '액티비티' },
        { id: 'culture', label: '🏯 역사/문화', value: '역사/문화' },
        { id: 'photo', label: '📸 인생샷', value: '인생샷' },
        { id: 'shopping', label: '🛍️ 쇼핑', value: '쇼핑' },
    ];

    const handleStyleToggle = (style) => {
        setFormData(prev => {
            const styles = prev.styles.includes(style)
                ? prev.styles.filter(s => s !== style)
                : [...prev.styles, style];
            return { ...prev, styles };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Prepare data for API
            const apiData = {
                destination: formData.destination,
                duration_days: parseInt(formData.duration),
                budget: formData.budget,
                travel_styles: formData.styles,
                requirements: formData.requirements ? [formData.requirements] : []
            };

            const result = await travelService.createTravelPlan(apiData);

            // Navigate to Itinerary page with result
            navigate(`/itinerary/${encodeURIComponent(formData.destination)}`, {
                state: { itineraryData: result.data }
            });

        } catch (error) {
            console.error("Plan generation failed:", error);
            alert("일정 생성에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            <Header />

            <div className="max-w-3xl mx-auto px-6 py-20">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
                        나만의 여행 플래너
                    </h1>
                    <p className="text-gray-400 text-lg">
                        원하는 조건을 입력하면 AI가 완벽한 코스를 설계해드립니다.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl shadow-2xl">

                    {/* Destination */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-lg font-semibold text-gray-200">
                            <MapPin className="w-5 h-5 text-pink-500" /> 여행지
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="어디로 떠나시나요? (예: 부산, 제주도)"
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
                            value={formData.destination}
                            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                        />
                    </div>

                    {/* Duration & Budget */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-lg font-semibold text-gray-200">
                                <Calendar className="w-5 h-5 text-purple-500" /> 기간 (일)
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="10"
                                required
                                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-lg font-semibold text-gray-200">
                                <DollarSign className="w-5 h-5 text-green-500" /> 예산
                            </label>
                            <input
                                type="text"
                                placeholder="예: 30만원, 50만원"
                                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                                value={formData.budget}
                                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Travel Styles */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-lg font-semibold text-gray-200">
                            <Compass className="w-5 h-5 text-blue-500" /> 여행 스타일
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {travelStyles.map((style) => (
                                <button
                                    key={style.id}
                                    type="button"
                                    onClick={() => handleStyleToggle(style.value)}
                                    className={`p-3 rounded-xl border transition-all duration-200 ${formData.styles.includes(style.value)
                                        ? 'bg-gradient-to-r from-pink-500/20 to-purple-600/20 border-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.3)]'
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/30'
                                        }`}
                                >
                                    {style.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Requirements */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-lg font-semibold text-gray-200">
                            <FileText className="w-5 h-5 text-yellow-500" /> 추가 요청사항
                        </label>
                        <textarea
                            rows="3"
                            placeholder="특별히 원하시는 점이 있다면 적어주세요. (예: 아이와 함께 가요, 걷는 건 싫어요)"
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition-colors resize-none"
                            value={formData.requirements}
                            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                        />
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 transition-opacity rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                AI가 여행 계획을 짜고 있어요...
                            </>
                        ) : (
                            '✨ 맞춤형 일정 생성하기'
                        )}
                    </Button>

                </form>
            </div>
        </div>
    );
}

import React from 'react';

const MissionSection = () => {
    return (
        <section className="section-padding bg-gray-50">
            <div className="container flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1">
                    <div className="text-sm font-bold text-gray-500 mb-2 tracking-widest uppercase">Our Mission</div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                        로컬과 여행의 가치를 높이는<br />좋은 경험을 소개합니다.
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed mb-8">
                        우리의 목표는 모두가 매일 세상을 더 즐겁게 탐험할 수 있도록 좋은 영감을 불어넣어 주는 것입니다.
                        전세계 크리에이터의 로컬 큐레이션을 제공하며 그 목표를 이뤄나가고 있습니다.
                    </p>
                    <a href="#" className="btn btn-outline">
                        회사 소개
                    </a>
                </div>
                <div className="flex-1 h-[400px] rounded-2xl w-full overflow-hidden relative">
                    <img
                        src="/mission.png"
                        alt="Mission"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                </div>
            </div>
        </section>
    );
};

export default MissionSection;

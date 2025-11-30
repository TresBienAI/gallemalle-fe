import React from 'react';

const StatsSection = () => {
    return (
        <section className="section-padding bg-black text-white">
            <div className="container flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="flex-1">
                    <h2 className="text-4xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                        누적 투자금액<br />$4.1M
                    </h2>
                </div>
                <div className="flex-1">
                    <p className="text-xl md:text-2xl leading-relaxed text-gray-300 mb-8">
                        여행은 언제나 매력적이지만 그 과정은 시작부터 어렵죠.
                        세상엔 신뢰하기 어려운 정보가 넘쳐나고 내 취향에 맞는 곳을 찾기란 너무 어렵습니다.
                        그래서 우리는 바텀-업으로 그 경험을 새롭게 정의하려 합니다.
                    </p>
                    <a href="#" className="btn bg-white text-black hover:bg-gray-200">
                        Download App
                    </a>
                </div>
            </div>
        </section>
    );
};

export default StatsSection;

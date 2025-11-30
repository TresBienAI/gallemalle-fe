import React from 'react';

const PartnersSection = () => {
    const partners = [
        "Google", "Samsung", "Hyundai", "Airbnb", "Nike", "Adidas"
    ];

    return (
        <section className="section-padding bg-white">
            <div className="container text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">글로벌 1위 기업들의 선택</h2>
                <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
                    브랜드의 메시지가 세상에 전달될 수 있도록 돕습니다. 가치있는 경험을 만들어내길 원하는 파트너사와 함께 하고 있습니다.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center opacity-60">
                    {partners.map((partner, index) => (
                        <div key={index} className="text-xl font-bold text-gray-400">
                            {partner}
                        </div>
                    ))}
                </div>

                <div className="mt-12">
                    <a href="#" className="text-black font-semibold border-b border-black pb-1 hover:opacity-70 transition-opacity">
                        파트너십 문의하기
                    </a>
                </div>
            </div>
        </section>
    );
};

export default PartnersSection;

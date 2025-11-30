import React from 'react';

const CurationSection = () => {
    const curations = [
        { title: "Hidden Cafes in Seoul", author: "Jane Doe", image: "bg-red-100" },
        { title: "Best Photo Spots", author: "John Smith", image: "bg-blue-100" },
        { title: "Local Food Guide", author: "Alice Kim", image: "bg-green-100" },
    ];

    return (
        <section className="section-padding bg-white">
            <div className="container">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">매일 새로운 로컬 큐레이션</h2>
                    <p className="text-gray-600 text-lg">
                        건축가, 여행작가, 포토그래퍼 등 로컬 큐레이터의 감도높은 공간 콘텐츠로<br />
                        일상을 더 다채롭게 만드는 플랫폼
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {curations.map((item, index) => (
                        <div key={index} className="group cursor-pointer">
                            <div className="aspect-[4/5] rounded-2xl mb-4 overflow-hidden relative">
                                <img
                                    src={index === 0 ? "/curation-1.png" : index === 1 ? "/mission.png" : "/curation-1.png"}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                            <p className="text-sm text-gray-500">Curated by {item.author}</p>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-16">
                    <a href="#" className="btn btn-primary px-8 py-3">
                        앱 다운로드
                    </a>
                </div>
            </div>
        </section>
    );
};

export default CurationSection;

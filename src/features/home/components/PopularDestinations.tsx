const destinations = [
    {
        name: 'Ho Chi Minh City',
        image:
            'https://tse3.mm.bing.net/th/id/OIP.P6_bRuk5FiwvGpocAdFG5wHaEO?rs=1&pid=ImgDetMain',
    },
    {
        name: 'Da Nang',
        image:
            'https://besthuecitytour.com/wp-content/uploads/2020/09/Things-To-Do-In-Da-Nang-Best-Hue-City-Tour-Travel-1-1536x1023.jpg',
    },
    {
        name: 'Hoi An',
        image:
            'https://th.bing.com/th/id/OIP.GiZEhmyfOaZgRMsV76Eq_AHaE8?rs=1&pid=ImgDetMain',
    },
]

export default function PopularDestinations() {
    return (
        <section className="max-w-6xl mx-auto px-6 mt-20">
            <h2 className="text-3xl font-bold mb-8">
                Popular destinations in Vietnam
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {destinations.map((item) => (
                    <div
                        key={item.name}
                        className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer shadow-lg"
                    >
                        {/* Image */}
                        <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                        {/* Text */}
                        <div className="absolute bottom-4 left-4 z-10">
                            <h3 className="text-white text-2xl font-bold drop-shadow">
                                {item.name}
                            </h3>
                            <p className="text-white/80 text-sm">
                                Explore stays & experiences
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

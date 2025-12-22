export default function HeroSection() {
    return (
        <section
            className="relative bg-cover bg-center bg-no-repeat py-32"
            style={{
                backgroundImage: 'url("/src/assets/images/property-banner.webp")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed',
                imageRendering: 'auto',
            }}
        >
            {/* Increased blur effect */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-md"></div>

            <div className="relative max-w-6xl mx-auto px-4 z-10 text-white">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
                    Find your perfect stay
                </h1>
                <p className="text-xl md:text-2xl max-w-2xl">
                    Discover and book amazing accommodations around the world
                </p>
            </div>
        </section>
    );
}
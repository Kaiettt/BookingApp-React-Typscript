import type { Property } from '@/features/property/types/property/property.type'
import PropertyCard from '@/features/property/components/PropertyCard'

interface Props {
    properties: Property[]
}

export default function FeaturedStays({ properties }: Props) {
    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-14">
                    <h2 className="text-4xl font-bold text-gray-900 mb-3">
                        Featured stays
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Handpicked accommodations loved by travelers around the world
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {properties.map((property) => (
                        <PropertyCard
                            key={property.id}
                            property={property}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

import type { Property } from '@/features/property/types/property/property.type'
import { Heart, Star, MapPin } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toSlug } from '@/util/slug-conversion.util'
import { buildAndStorePropertySearchParams } from '../util/build-param.util'

interface Props {
    property: Property
}

export default function PropertyCard({ property }: Props) {
    const [isFavorite, setIsFavorite] = useState(false)
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const handleViewPropertyDetail = () => {
        const slug = toSlug(property.name)
        buildAndStorePropertySearchParams(searchParams, property.id)
        navigate(`/property/${slug}`)
    }

    return (
        <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
            {/* Image */}
            <div className="relative h-64 overflow-hidden">
                <img
                    src={property.mediaUrl}
                    alt={property.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                {/* Favorite */}
                <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="absolute top-4 right-4 p-2 bg-white/90 rounded-full backdrop-blur hover:scale-105 transition"
                >
                    <Heart
                        className={`w-5 h-5 ${isFavorite
                            ? 'fill-red-500 text-red-500'
                            : 'text-gray-700'
                            }`}
                    />
                </button>

                {/* Type badge */}
                <span className="absolute top-4 left-4 bg-white/90 text-xs font-semibold px-3 py-1 rounded-full">
                    {property.type}
                </span>
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Title + rating */}
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                            {property.name}
                        </h3>

                        <div className="flex items-center text-gray-600 text-sm mt-1">
                            <MapPin className="w-4 h-4 mr-1" />
                            {property.address.city}, {property.address.country}
                        </div>
                    </div>

                    {property.avgRating && (
                        <div className="flex items-center gap-1 bg-blue-600 text-white px-2.5 py-1 rounded-lg text-sm font-semibold">
                            <Star className="w-4 h-4 fill-white" />
                            {property.avgRating.toFixed(1)}
                        </div>
                    )}
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mt-4">
                    {property.amenities.slice(0, 3).map((a) => (
                        <span
                            key={a.id}
                            className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                        >
                            {a.name}
                        </span>
                    ))}

                    {property.amenities.length > 3 && (
                        <span className="text-xs text-gray-500 self-center">
                            +{property.amenities.length - 3} more
                        </span>
                    )}
                </div>

                {/* Price + CTA */}
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                    <div>
                        <p className="text-sm text-gray-500">Starting from</p>
                        <p className="text-xl font-bold text-gray-900">
                            ${property.minPrice}
                            <span className="text-sm font-normal text-gray-500">
                                {' '} / night
                            </span>
                        </p>
                    </div>

                    <button onClick={handleViewPropertyDetail} className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition">
                        View details
                    </button>
                </div>
            </div>
        </div>
    )
}

import {
    Wifi,
    Dumbbell,
    Coffee,
    Waves,
    ParkingSquare,
    CheckCircle
} from "lucide-react"
import type { JSX } from "react";

interface Props {
    amenities: { id: number; name: string }[]
}

const amenityIcons: Record<string, JSX.Element> = {
    "Free WiFi": <Wifi className="w-4 h-4" />,
    "Pool": <Waves className="w-4 h-4" />,
    "Gym": <Dumbbell className="w-4 h-4" />,
    "Breakfast included": <Coffee className="w-4 h-4" />,
    "Parking": <ParkingSquare className="w-4 h-4" />
}

export default function PropertyAmenities({ amenities }: Props) {
    if (!amenities.length) return null

    return (
        <section>
            <h3 className="text-lg font-semibold mb-4">Amenities</h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {amenities.map(a => (
                    <div
                        key={a.id}
                        className="flex items-center gap-2 px-4 py-3
                                   bg-gray-50 border rounded-lg text-sm
                                   hover:bg-gray-100 transition"
                    >
                        <span className="text-gray-600">
                            {amenityIcons[a.name] ?? (
                                <CheckCircle className="w-4 h-4" />
                            )}
                        </span>

                        <span className="text-gray-800">{a.name}</span>
                    </div>
                ))}
            </div>
        </section>
    )
}

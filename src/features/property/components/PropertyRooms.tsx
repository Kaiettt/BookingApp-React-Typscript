import { useState } from 'react';
import { User, Bed, Utensils } from 'lucide-react';
import { RoomAmenities } from './RoomAmenities';
import { RoomFacilities } from './RoomFacilities';

interface Props {
    roomTypes: any[];
}

export default function PropertyRooms({ roomTypes }: Props) {
    const [selectedRooms, setSelectedRooms] = useState<{ [key: string]: { [key: string]: number } }>({});
    const [selectedRatePlans, setSelectedRatePlans] = useState<{ [key: string]: string }>({});

    if (!roomTypes.length) return null;

    const handleRoomSelect = (roomId: string, ratePlanId: string, count: number) => {
        setSelectedRooms(prev => ({
            ...prev,
            [roomId]: {
                ...(prev[roomId] || {}),
                [ratePlanId]: count
            }
        }));
    };

    const getSelectedRoomCount = (roomId: string, ratePlanId: string) => {
        return selectedRooms[roomId]?.[ratePlanId] || 1;
    };

    const handleReserve = (roomTypeId: string, ratePlanId: string) => {
        console.log(`Reserving ${selectedRooms[roomTypeId]?.[ratePlanId] || 1} room(s) with rate plan ${ratePlanId}`);
    };
    return (
        <section className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Available rooms</h2>

            <div className="overflow-x-auto w-full">
                <table className="w-full min-w-full table-auto divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-8 py-4 text-sm font-medium text-gray-700 uppercase tracking-wider w-[28%]">Room type</th>
                            <th className="px-6 py-4 text-sm font-medium text-gray-700 uppercase tracking-wider w-[12%]">Guests</th>
                            <th className="px-6 py-4 text-sm font-medium text-gray-700 uppercase tracking-wider w-[20%]">Price for 1 night</th>
                            <th className="px-6 py-4 text-sm font-medium text-gray-700 uppercase tracking-wider w-[25%]">Your choices</th>
                            <th className="px-6 py-4 text-sm font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200 w-[10%]">Rooms</th>
                            <th className="px-6 py-4 text-sm font-medium text-gray-700 uppercase tracking-wider w-[15%] text-center">Reserve</th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {roomTypes.flatMap((room) =>
                            room.ratePlans.map((ratePlan: any, index: number) => (
                                <tr key={`${room.id}-${ratePlan.id}`}>
                                    {/* Room info */}
                                    {index === 0 && (
                                        <td rowSpan={room.ratePlans.length} className="px-8 py-6 border-r border-gray-200">
                                            <div className="space-y-2">
                                                <h3 className="font-semibold text-gray-900">{room.name}</h3>
                                                <p className="text-sm text-green-600">We have {room.availableRooms} left</p>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Bed className="h-4 w-4 mr-1" />
                                                    {room.bedType}
                                                </div>

                                                {/* Room Amenities */}
                                                <RoomAmenities amenities={room.roomAmenities} />

                                                {/* Room Facilities */}
                                                <RoomFacilities facilities={room.roomFacilities} />

                                            </div>
                                        </td>
                                    )}

                                    {/* Guests */}
                                    <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200">
                                        <div className="flex items-center">
                                            <User className="h-5 w-5 text-gray-400 mr-1" />
                                            <span className="text-sm text-gray-900">
                                                {room.maxAdults} {room.maxAdults > 1 ? 'Adults' : 'Adult'}
                                                {room.maxChildren > 0 && `, ${room.maxChildren} ${room.maxChildren > 1 ? 'Children' : 'Child'}`}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Price */}
                                    <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200">
                                        <div className="text-right">
                                            <div className="text-sm line-through text-gray-400">${ratePlan.originalPrice}</div>
                                            <div className="text-lg font-bold text-gray-900">${ratePlan.price}</div>
                                            <div className="text-xs text-green-600">10% off</div>
                                            <div className="text-xs text-gray-500 mt-1">Includes taxes and fees</div>
                                        </div>
                                    </td>

                                    {/* Your choices / perks */}
                                    <td className="px-6 py-4 border-r border-gray-200">
                                        <div className="space-y-2">
                                            <div className="font-medium text-gray-900">{ratePlan.name}</div>
                                            <div className="text-sm text-gray-600">
                                                {ratePlan.prepaymentType === 'DEPOSIT' ? 'Deposit required' : 'Full payment required'}
                                            </div>
                                            {ratePlan.perks && ratePlan.perks.length > 0 && (
                                                <ul className="mt-2 space-y-1 text-xs text-green-600">
                                                    {ratePlan.perks.map((perk: any) => (
                                                        <li key={perk.id} className="flex items-center">
                                                            <Utensils className="h-4 w-4 mr-1.5 flex-shrink-0" />
                                                            {perk.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </td>

                                    {/* Select rooms */}
                                    <td className="px-6 py-4 border-r border-gray-200">
                                        <div className="flex items-center gap-2 justify-end">
                                            <span className="text-sm text-gray-600">Rooms:</span>
                                            <select
                                                className="border rounded p-2 text-sm w-20"
                                                value={getSelectedRoomCount(room.id, ratePlan.id)}
                                                onChange={(e) =>
                                                    handleRoomSelect(room.id, ratePlan.id, parseInt(e.target.value))
                                                }
                                            >
                                                {[...Array(room.availableRooms > 5 ? 5 : room.availableRooms)].map((_, i) => (
                                                    <option key={i + 1} value={i + 1}>
                                                        {i + 1}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </td>

                                    {/* Reserve button */}
                                    {index === 0 ? (
                                        <td rowSpan={room.ratePlans.length} className="px-6 py-6">
                                            <div className="flex flex-col items-center space-y-2 px-4">
                                                <button
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap w-full"
                                                    onClick={() =>
                                                        handleReserve(
                                                            room.id,
                                                            Object.keys(selectedRooms[room.id] || {})[0]
                                                        )
                                                    }
                                                >
                                                    I'll reserve
                                                </button>
                                                <div className="text-xs text-gray-500 text-center">
                                                    You won't be charged yet
                                                </div>
                                            </div>
                                        </td>
                                    ) : null}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );



}

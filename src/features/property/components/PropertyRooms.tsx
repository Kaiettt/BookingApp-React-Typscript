import { useState } from 'react';
import { User, Bed, Utensils } from 'lucide-react';
import { RoomAmenities } from './RoomAmenities';
import { RoomFacilities } from './RoomFacilities';
import { useNavigate } from 'react-router-dom';
import type { RoomType } from '@/features/room/room-type.type';
import type { Reservation } from '@/features/booking/types/type';
import { useHoldRooms } from '../hooks/useHoldRooms.hooks';

interface Props {
    roomTypes: RoomType[];
    availability: {
        checkIn: string;
        checkOut: string;
        adults: number;
        children: number;
    };
}

interface SelectedRooms {
    [roomId: number]: {
        [ratePlanId: number]: number;
    };
}

export default function PropertyRooms({ roomTypes, availability }: Props) {
    const navigate = useNavigate();
    const [selectedRooms, setSelectedRooms] = useState<SelectedRooms>({});
    const { holdRooms, isLoading, error: holdError } = useHoldRooms();
    if (!roomTypes || roomTypes.length === 0) return null;

    const getSelectedRoomCount = (roomId: number, ratePlanId: number): number => {
        return selectedRooms[roomId]?.[ratePlanId] ?? 0;
    };

    const handleRoomChange = (roomId: number, ratePlanId: number, value: string) => {
        const numValue = Number(value);
        setSelectedRooms(prev => {
            const newState = { ...prev };

            if (numValue > 0) {
                if (!newState[roomId]) newState[roomId] = {};
                newState[roomId][ratePlanId] = numValue;
            } else {
                if (newState[roomId]) {
                    delete newState[roomId][ratePlanId];
                    if (Object.keys(newState[roomId]).length === 0) {
                        delete newState[roomId];
                    }
                }
            }

            return newState;
        });
    };

    const handleReserve = async () => {
        const reservations: Reservation[] = [];

        // Data preparation
        for (const [roomIdStr, ratePlans] of Object.entries(selectedRooms)) {
            const roomId = Number(roomIdStr);
            const room = roomTypes.find(r => r.id === roomId);
            if (!room) continue;

            for (const [ratePlanIdStr, quantity] of Object.entries<number>(ratePlans)) {
                const ratePlanId = Number(ratePlanIdStr);
                if (quantity <= 0) continue;

                const ratePlan = room.ratePlans.find(rp => rp.id === ratePlanId);
                if (!ratePlan) continue;

                reservations.push({
                    roomId,
                    roomType: room.name,
                    ratePlanId,
                    ratePlanName: ratePlan.name,
                    quantity,
                    price: ratePlan.price
                });
            }
        }

        if (reservations.length === 0) {
            alert('Please select at least 1 room');
            return;
        }

        try {
            // 2. Await the holdRooms function from the hook
            await holdRooms(reservations, availability);

            // 3. Only if the call succeeds, save to storage and navigate
            localStorage.setItem('selectedRooms', JSON.stringify(reservations));
            localStorage.setItem('stay-info', JSON.stringify(availability));

            navigate("/confirm-booking");
        } catch (err) {
            // Error is already handled/set by the hook's internal state
            console.error("Reservation failed:", err);
        }
    };
    return (
        <section className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Available rooms</h2>
            <div className="overflow-x-auto w-full">
                <table className="w-full min-w-full table-auto divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-8 py-4 w-[30%]">Room type</th>
                            <th className="px-6 py-4 w-[15%]">Guests</th>
                            <th className="px-6 py-4 w-[20%]">Price</th>
                            <th className="px-6 py-4 w-[25%]">Your choices</th>
                            <th className="px-6 py-4 w-[10%]">Rooms</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {roomTypes.flatMap(room =>
                            room.ratePlans.map((ratePlan, index) => (
                                <tr key={`${room.id}-${ratePlan.id}`}>
                                    {index === 0 && (
                                        <td rowSpan={room.ratePlans.length} className="px-8 py-6 border-r border-gray-100">
                                            <div className="space-y-4">
                                                <div>
                                                    <h3 className="text-lg font-bold">{room.name}</h3>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <Bed className="h-4 w-4 mr-2" />
                                                        {room.bedType}
                                                    </div>
                                                </div>
                                                <RoomAmenities amenities={room.roomAmenities} />
                                                <RoomFacilities facilities={room.roomFacilities} />
                                            </div>
                                        </td>
                                    )}
                                    <td className="px-6 py-4 border-r">
                                        <User className="inline h-5 w-5 mr-1 text-gray-400" />
                                        {room.maxAdults} Adult
                                        {room.maxChildren > 0 && `, ${room.maxChildren} Child`}
                                    </td>
                                    <td className="px-6 py-4 border-r text-right">
                                        <div className="text-lg font-bold">{ratePlan.price}$</div>
                                    </td>
                                    <td className="px-6 py-4 border-r">
                                        <div className="font-medium">{ratePlan.name}</div>
                                        {ratePlan.perks?.map(perk => (
                                            <div key={perk.id} className="flex text-xs text-green-600">
                                                <Utensils className="h-4 w-4 mr-1" />
                                                {perk.name}
                                            </div>
                                        ))}
                                    </td>
                                    <td className="px-6 py-4 border-r">
                                        <input
                                            type="number"
                                            min={0}
                                            value={getSelectedRoomCount(room.id, ratePlan.id) || ''}
                                            placeholder="0"
                                            onChange={e => handleRoomChange(room.id, ratePlan.id, e.target.value)}
                                            className="border rounded p-2 w-20 text-right"
                                        />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-end mt-6">
                <button
                    onClick={handleReserve}
                    disabled={isLoading}
                    className={`flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </>
                    ) : (
                        "I'll reserve"
                    )}
                </button>
            </div>
            <p className="text-sm text-gray-500 mt-3 text-right">You won't be charged yet</p>
        </section>
    );
}

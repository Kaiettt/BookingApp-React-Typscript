import { Search, Calendar, MapPin, User, Users } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar() {
    const navigate = useNavigate();
    const [destination, setDestination] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [showGuestSelector, setShowGuestSelector] = useState(false);

    const today = new Date().toISOString().split('T')[0];
    const totalGuests = adults + children;

    const handleGuestClick = () => {
        setShowGuestSelector(!showGuestSelector);
    };

    const handleSearch = () => {
        if (!destination) return

        navigate({
            pathname: '/search',
            search: new URLSearchParams({
                city: destination,
                checkingDate: checkIn || new Date().toISOString().split('T')[0],
                checkoutDate: checkOut || new Date(Date.now() + 86400000).toISOString().split('T')[0],
                adults: adults.toString(),
                children: children.toString(),
                page: '0', // Backend uses 0-based page indexing
                size: '10',
            }).toString(),
        })
    }

    return (
        <div className="-mt-10 z-10 relative">
            <div className="max-w-6xl mx-auto px-4">
                <div className="bg-white rounded-xl shadow-xl p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Destination */}
                    <div className="relative md:col-span-4">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            placeholder="Where are you going?"
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Check-in */}
                    <div className="relative md:col-span-2">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="date"
                            value={checkIn}
                            min={today}
                            onChange={(e) => setCheckIn(e.target.value)}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Check-out */}
                    <div className="relative md:col-span-2">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="date"
                            value={checkOut}
                            min={checkIn || today}
                            onChange={(e) => setCheckOut(e.target.value)}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Guests */}
                    <div className="relative md:col-span-2">
                        <div
                            className="flex items-center justify-between w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg cursor-pointer"
                            onClick={handleGuestClick}
                        >
                            <div className="flex items-center">
                                <Users className="h-5 w-5 text-gray-400 mr-2" />
                                <span>
                                    {totalGuests} {totalGuests === 1 ? 'Guest' : 'Guests'}
                                </span>
                            </div>
                            <svg
                                className={`h-5 w-5 text-gray-400 transition-transform ${showGuestSelector ? 'transform rotate-180' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>

                        {/* Guest Selector Dropdown */}
                        {showGuestSelector && (
                            <div className="absolute z-20 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <div className="font-medium">Adults</div>
                                        <div className="text-sm text-gray-500">Ages 13+</div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (adults > 1) setAdults(adults - 1);
                                            }}
                                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                                            disabled={adults <= 1}
                                        >
                                            -
                                        </button>
                                        <span>{adults}</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setAdults(adults + 1);
                                            }}
                                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="font-medium">Children</div>
                                        <div className="text-sm text-gray-500">Ages 2-12</div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (children > 0) setChildren(children - 1);
                                            }}
                                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                                            disabled={children <= 0}
                                        >
                                            -
                                        </button>
                                        <span>{children}</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setChildren(children + 1);
                                            }}
                                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Search Button */}
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 md:col-span-2"
                        onClick={handleSearch}
                    >
                        <Search className="h-5 w-5" />
                        <span>Search</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
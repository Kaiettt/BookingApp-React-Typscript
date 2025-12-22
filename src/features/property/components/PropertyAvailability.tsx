export default function PropertyAvailability() {
    return (
        <section className="p-6 bg-white rounded-2xl shadow-md space-y-5">
            <h3 className="text-lg font-semibold">Check availability</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Check-in */}
                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Check-in</label>
                    <input
                        type="date"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm
                                   focus:ring-2 focus:ring-blue-500 focus:outline-none
                                   hover:border-gray-300 transition"
                    />
                </div>

                {/* Check-out */}
                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Check-out</label>
                    <input
                        type="date"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm
                                   focus:ring-2 focus:ring-blue-500 focus:outline-none
                                   hover:border-gray-300 transition"
                    />
                </div>

                {/* Adults */}
                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Adults</label>
                    <input
                        type="number"
                        min={1}
                        placeholder="2"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm
                                   focus:ring-2 focus:ring-blue-500 focus:outline-none
                                   hover:border-gray-300 transition"
                    />
                </div>

                {/* Children */}
                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Children</label>
                    <input
                        type="number"
                        min={0}
                        placeholder="0"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm
                                   focus:ring-2 focus:ring-blue-500 focus:outline-none
                                   hover:border-gray-300 transition"
                    />
                </div>
            </div>

            <button
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold text-sm
                           hover:bg-blue-700 transition"
            >
                Search
            </button>
        </section>
    )
}

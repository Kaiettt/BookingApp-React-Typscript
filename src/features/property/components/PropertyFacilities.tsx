interface Props {
    facilities: { id: number; name: string }[]
}

export default function PropertyFacilities({ facilities }: Props) {
    if (!facilities.length) return null

    return (
        <section>
            <h3 className="text-lg font-semibold mb-4">Facilities</h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {facilities.map(f => (
                    <div
                        key={f.id}
                        className="px-4 py-3 bg-gray-50 border rounded-lg
                                   text-sm text-gray-800
                                   hover:bg-gray-100 transition"
                    >
                        {f.name}
                    </div>
                ))}
            </div>
        </section>
    )
}

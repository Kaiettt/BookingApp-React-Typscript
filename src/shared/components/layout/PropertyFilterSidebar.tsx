import type { PropertyFilters } from '@/features/search/types/search-filters.type'
import { Star, SlidersHorizontal, RotateCcw, ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    propertyTypes as defaultPropertyTypes,
    amenitiesList as defaultAmenitiesList,
    facilitiesList as defaultFacilitiesList,
    roomFacilitiesList as defaultRoomFacilitiesList,
} from '@/features/search/data/filter-options'

interface ListItem {
    id: number
    name: string
}

interface Props {
    filters: PropertyFilters
    onChange: (filters: PropertyFilters) => void
    propertyTypes?: string[]
    amenitiesList?: ListItem[]
    facilitiesList?: ListItem[]
    roomFacilitiesList?: ListItem[]
}

function Section({
    title,
    children,
    defaultOpen = true,
}: {
    title: string
    children: React.ReactNode
    defaultOpen?: boolean
}) {
    const [open, setOpen] = useState(defaultOpen)

    return (
        <section className="rounded-xl border border-gray-200 bg-white">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="flex w-full items-center justify-between px-4 py-3"
            >
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <ChevronDown
                    className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`}
                />
            </button>
            {open && <div className="px-4 pb-4">{children}</div>}
        </section>
    )
}

export default function PropertyFilterSidebar({
    filters,
    onChange,
    propertyTypes = defaultPropertyTypes,
    amenitiesList = defaultAmenitiesList,
    facilitiesList = defaultFacilitiesList,
    roomFacilitiesList = defaultRoomFacilitiesList,
}: Props) {
    const [draft, setDraft] = useState<PropertyFilters>(filters)
    const navigate = useNavigate()

    useEffect(() => {
        setDraft(filters)
    }, [filters])

    const update = <K extends keyof PropertyFilters>(
        key: K,
        value: PropertyFilters[K],
    ) => {
        setDraft(prev => ({ ...prev, [key]: value }))
    }

    const toggleArrayValue = <K extends keyof PropertyFilters>(
        key: K,
        value: PropertyFilters[K] extends (infer U)[] ? U : never
    ) => {
        const currentValue = (draft[key] as unknown as any[]) || []
        const newValue = currentValue.includes(value as never)
            ? currentValue.filter(v => v !== value)
            : [...currentValue, value]
        update(key, newValue as PropertyFilters[K])
    }

    const resetFilters = () => {
        const cleared: PropertyFilters = {
            adults: 1,
            children: 0,
            minPrice: undefined,
            maxPrice: undefined,
            propertyTypes: [],
            minRating: undefined,
            propertyAmenities: [],
            propertyFacilities: [],
            roomFacilities: [],
            checkingDate: draft.checkingDate,
            checkoutDate: draft.checkoutDate,
            page: 1,
            size: draft.size,
            city: draft.city,
        }
        setDraft(cleared)
        onChange(cleared)

        // Build query string with essential params only
        const params = new URLSearchParams()

        // Only include checkingDate and checkoutDate
        if (cleared.checkingDate) params.set('checkingDate', cleared.checkingDate)
        if (cleared.checkoutDate) params.set('checkoutDate', cleared.checkoutDate)

        navigate(`/search/filter?${params.toString()}`)
    }

    const applyFilters = () => {
        onChange(draft)

        // Build query string to navigate with params
        const params = new URLSearchParams()

        // Always include essential params
        if (draft.city) params.set('city', draft.city)
        if (draft.checkingDate) params.set('checkingDate', draft.checkingDate)
        if (draft.checkoutDate) params.set('checkoutDate', draft.checkoutDate)

        // Add filter params
        params.set('adults', String(draft.adults))
        params.set('children', String(draft.children))

        if (draft.minPrice !== undefined) params.set('minPrice', String(draft.minPrice))
        if (draft.maxPrice !== undefined) params.set('maxPrice', String(draft.maxPrice))
        if (draft.minRating !== undefined) params.set('minRating', String(draft.minRating))

        draft.propertyTypes.forEach(t => params.append('propertyType', t))
        draft.propertyAmenities.forEach(id => params.append('propertyAmenities', String(id)))
        draft.propertyFacilities.forEach(id => params.append('propertyFacilities', String(id)))
        draft.roomFacilities.forEach(id => params.append('roomFacilities', String(id)))

        if (draft.page !== undefined) params.set('page', String(draft.page))
        if (draft.size !== undefined) params.set('size', String(draft.size))

        navigate(`/search/filter?${params.toString()}`)
    }

    return (
        <aside className="w-full lg:w-80 space-y-4 sticky top-24">
            {/* Header */}
            <div className="flex items-center justify-between rounded-2xl border bg-white px-5 py-4 shadow-sm">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5 text-blue-600" />
                    <h2 className="font-semibold">Filters</h2>
                </div>
                <button
                    onClick={resetFilters}
                    className="flex items-center gap-1 text-sm text-gray-500"
                >
                    <RotateCcw className="h-4 w-4" /> Reset
                </button>
            </div>

            <Section title="Guests">
                <div className="grid grid-cols-2 gap-3">
                    <input
                        type="number"
                        min={1}
                        value={draft.adults}
                        onChange={e => update('adults', Number(e.target.value))}
                        className="rounded border p-2"
                    />
                    <input
                        type="number"
                        min={0}
                        value={draft.children}
                        onChange={e => update('children', Number(e.target.value))}
                        className="rounded border p-2"
                    />
                </div>
            </Section>

            <Section title="Price">
                <div className="grid grid-cols-2 gap-3">
                    <input
                        type="number"
                        placeholder="Min"
                        value={draft.minPrice ?? ''}
                        onChange={e => update('minPrice', Number(e.target.value) || undefined)}
                        className="rounded border p-2"
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        value={draft.maxPrice ?? ''}
                        onChange={e => update('maxPrice', Number(e.target.value) || undefined)}
                        className="rounded border p-2"
                    />
                </div>
            </Section>

            <Section title="Property type">
                <div className="flex flex-wrap gap-2">
                    {propertyTypes.map(type => (
                        <button
                            key={type}
                            onClick={() => toggleArrayValue('propertyTypes', type)}
                            className={`px-3 py-1 rounded-full border ${draft.propertyTypes.includes(type)
                                ? 'bg-blue-50 border-blue-600'
                                : ''
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </Section>

            <Section title="Rating">
                <div className="flex gap-2">
                    {[5, 4, 3].map(r => (
                        <button
                            key={r}
                            onClick={() => update('minRating', r)}
                            className={`flex items-center gap-1 border px-3 py-2 rounded ${draft.minRating === r ? 'bg-blue-50 border-blue-600' : ''
                                }`}
                        >
                            <Star className="h-4 w-4 fill-yellow-400" /> {r}+
                        </button>
                    ))}
                </div>
            </Section>

            <Section title="Amenities">
                <div className="space-y-2">
                    {amenitiesList.map(item => (
                        <label key={item.id} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={draft.propertyAmenities?.includes(item.id) || false}
                                onChange={() => toggleArrayValue('propertyAmenities', item.id)}
                                className="rounded border-gray-300 text-blue-600"
                            />
                            <span>{item.name}</span>
                        </label>
                    ))}
                </div>
            </Section>

            <Section title="Property Facilities">
                <div className="space-y-2">
                    {facilitiesList.map(item => (
                        <label key={item.id} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={draft.propertyFacilities?.includes(item.id) || false}
                                onChange={() => toggleArrayValue('propertyFacilities', item.id)}
                                className="rounded border-gray-300 text-blue-600"
                            />
                            <span>{item.name}</span>
                        </label>
                    ))}
                </div>
            </Section>

            <Section title="Room Facilities">
                <div className="space-y-2">
                    {roomFacilitiesList.map(item => (
                        <label key={item.id} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={draft.roomFacilities?.includes(item.id) || false}
                                onChange={() => toggleArrayValue('roomFacilities', item.id)}
                                className="rounded border-gray-300 text-blue-600"
                            />
                            <span>{item.name}</span>
                        </label>
                    ))}
                </div>
            </Section>

            <div className="rounded-2xl border bg-white p-4 space-y-3">
                <button
                    onClick={applyFilters}
                    className="w-full rounded-xl bg-blue-600 py-2 text-white"
                >
                    Apply filters
                </button>
                <button
                    onClick={resetFilters}
                    className="w-full rounded-xl bg-gray-100 py-2"
                >
                    Clear all
                </button>
            </div>
        </aside>
    )
}

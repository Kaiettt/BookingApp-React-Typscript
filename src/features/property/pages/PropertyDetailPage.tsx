import Header from "@/shared/components/layout/Header"
import Footer from "@/shared/components/layout/Footer"

import { useFetchProperty } from "../hooks/useFetchProperty.hook"

import PropertyHero from "../components/PropertyHero"
import PropertyGallery from "../components/PropertyGallery"
import PropertyOverview from "../components/PropertyOverview"
import PropertyAmenities from "../components/PropertyAmenities"
import PropertyFacilities from "../components/PropertyFacilities"
import PropertyAvailability from "../components/PropertyAvailability"
import PropertyRooms from "../components/PropertyRooms"
import PropertyReviews from "../components/PropertyReviews"
import Breadcrumb from "../../../shared/components/layout/Breadcrumb"

export default function PropertyDetailPage() {
    const { result, loading, error } = useFetchProperty()

    if (loading) {
        return (
            <>
                <Header />
                <main className="container mx-auto px-4 py-10">
                    <p className="text-gray-500">Loading property details...</p>
                </main>
                <Footer />
            </>
        )
    }

    if (error || !result) {
        return (
            <>
                <Header />
                <main className="container mx-auto px-4 py-10">
                    <p className="text-red-500">Failed to load property details.</p>
                </main>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Header />

            <main className="container mx-auto px-4 py-6 space-y-12">
                {/* BREADCRUMB */}
                <Breadcrumb
                    items={[
                        { name: 'Home', path: '/' },
                        { name: result.type, path: `/properties?type=${result.type.toLowerCase()}` },
                        { name: result.address.country, path: `/properties?country=${encodeURIComponent(result.address.country)}` },
                        { name: result.address.city, path: `/properties?city=${encodeURIComponent(result.address.city)}` },
                        { name: result.name, path: '#', isLast: true },
                    ]}
                    className="mb-6"
                />

                {/* HERO */}
                <PropertyHero
                    name={result.name}
                    type={result.type}
                    avgRating={result.avgRating}
                    totalRating={result.totalRating}
                    address={result.address}
                />

                {/* GALLERY */}
                <PropertyGallery media={result.media} />

                {/* MAIN CONTENT */}
                <div className="w-full">
                    {/* MAIN CONTENT - Full width */}
                    <div className="w-full space-y-10">
                        <PropertyOverview
                            description={result.description}
                            type={result.type}
                            address={result.address}
                        />

                        <PropertyAmenities amenities={result.amenities} />

                        <PropertyFacilities facilities={result.facilities} />

                        <PropertyAvailability />

                        <PropertyRooms roomTypes={result.roomTypes} />

                        <PropertyReviews
                            reviews={result.reviews}
                            avgRating={result.avgRating}
                            totalRating={result.totalRating}
                        />
                    </div>
                </div>
            </main>

            <Footer />
        </>
    )
}

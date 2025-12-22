import { Fragment } from 'react';
import HeroSection from '../components/HeroSection';
import SearchBar from '../components/SearchBar';
import PopularDestinations from '../components/PopularDestinations';
import FeaturedStays from '../components/FeaturedStays';
import Header from '@/shared/components/layout/Header';
import Footer from '@/shared/components/layout/Footer';
import type { Property } from '@/features/property/types/property/property.type';
const properties: Property[] = [
    {
        id: 1,
        name: 'Saigon Luxury Hotel',
        type: 'HOTEL',
        description: 'dsfsdfsdfsdf',
        status: 'ACCEPTED',
        mediaUrl:
            'https://tse3.mm.bing.net/th/id/OIP.P6_bRuk5FiwvGpocAdFG5wHaEO',
        minPrice: 120,
        avgRating: 5.0,
        totalRating: 1000,
        amenities: [],
        facilities: [],
        address: {
            streetAddress: 'sdf',
            ward: 'sdf',
            district: '',
            city: 'Ho Chi Minh City',
            state: 'sdf',
            postalCode: 'sdfsf',
            country: 'Vietnam',
            fullAddress: '',
            geo: { lat: 0, lng: 0 },
        },
    },
    {
        id: 2,
        name: 'Saigon Luxury Hotel',
        type: 'HOTEL',
        description: 'dsfsdfsdfsdf',
        status: 'ACCEPTED',
        mediaUrl:
            'https://tse3.mm.bing.net/th/id/OIP.P6_bRuk5FiwvGpocAdFG5wHaEO',
        minPrice: 120,
        avgRating: 5.0,
        totalRating: 1000,
        amenities: [],
        facilities: [],
        address: {
            streetAddress: 'sdf',
            ward: 'sdf',
            district: '',
            city: 'Ho Chi Minh City',
            state: 'sdf',
            postalCode: 'sdfsf',
            country: 'Vietnam',
            fullAddress: '',
            geo: { lat: 0, lng: 0 },
        },

    },
    {
        id: 3,
        name: 'Saigon Luxury Hotel',
        type: 'HOTEL',
        description: 'dsfsdfsdfsdf',
        status: 'ACCEPTED',
        mediaUrl:
            'https://tse3.mm.bing.net/th/id/OIP.P6_bRuk5FiwvGpocAdFG5wHaEO',
        minPrice: 120,
        avgRating: 5.0,
        totalRating: 1000,
        amenities: [],
        facilities: [],
        address: {
            streetAddress: 'sdf',
            ward: 'sdf',
            district: '',
            city: 'Ho Chi Minh City',
            state: 'sdf',
            postalCode: 'sdfsf',
            country: 'Vietnam',
            fullAddress: '',
            geo: { lat: 0, lng: 0 },
        },
    },
    {
        id: 4,
        name: 'Saigon Luxury Hotel',
        type: 'HOTEL',
        description: 'dsfsdfsdfsdf',
        status: 'ACCEPTED',
        mediaUrl:
            'https://tse3.mm.bing.net/th/id/OIP.P6_bRuk5FiwvGpocAdFG5wHaEO',
        minPrice: 120,
        avgRating: 5.0,
        totalRating: 1000,
        amenities: [],
        facilities: [],
        address: {
            streetAddress: 'sdf',
            ward: 'sdf',
            district: '',
            city: 'Ho Chi Minh City',
            state: 'sdf',
            postalCode: 'sdfsf',
            country: 'Vietnam',
            fullAddress: '',
            geo: { lat: 0, lng: 0 },
        },

    },
]
export default function HomePage() {
    return (
        <Fragment>
            <Header />
            <main>
                <HeroSection />
                <SearchBar />
                <PopularDestinations />
                <FeaturedStays properties={properties} />
            </main>
            <Footer />
        </Fragment>
    );
}

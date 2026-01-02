import { Fragment } from 'react';
import HeroSection from '../components/HeroSection';
import SearchBar from '../components/SearchBar';
import PopularDestinations from '../components/PopularDestinations';
import Header from '@/shared/components/layout/Header';
import Footer from '@/shared/components/layout/Footer';

export default function HomePage() {
    return (
        <Fragment>
            <Header />
            <main>
                <HeroSection />
                <SearchBar />
                <PopularDestinations />
            </main>
            <Footer />
        </Fragment>
    );
}

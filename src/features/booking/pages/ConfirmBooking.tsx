import { useState, useEffect } from 'react';
import { CheckCircle, CreditCard, Banknote, Loader2 } from 'lucide-react';
import Header from '@/shared/components/layout/Header';
import Footer from '@/shared/components/layout/Footer';
import { useHandleBooking } from '../hooks/useHandleBooking.hooks';
import type { PaymentMethod } from '@/types/payment.enum';
import { useNavigate } from 'react-router-dom';
import type { BookingResponse } from '../types/type';
import { bookingApi } from '../services/booking.api';

// Utility function to format dates
const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

// Utility function to calculate nights between two dates
const calculateNights = (checkIn: string, checkOut: string) => {
    const diffTime = Math.abs(new Date(checkOut).getTime() - new Date(checkIn).getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

interface Property {
    name: string;
    address: { fullAddress: string };
    avgRating: number;
    totalRating: number;
    media: { url: string }[];
}

interface SelectedRoom {
    roomId: string;
    roomType: string;
    ratePlanId: string;
    ratePlanName: string;
    quantity: number;
    price: number;
}

interface StayInfo {
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
}

export default function ConfirmBookingPage() {
    const [property, setProperty] = useState<Property | null>(null);
    const [selectedRooms, setSelectedRooms] = useState<SelectedRoom[]>([]);
    const [stayInfo, setStayInfo] = useState<StayInfo | null>(null);
    const navigate = useNavigate();
    const { createBooking, isSubmitting: isSubmittingApi, error: apiError } = useHandleBooking();
    const [guest, setGuest] = useState({
        name: '',
        email: '',
        phone: '',
        nationality: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('credit');
    const [specialRequest, setSpecialRequest] = useState('');

    useEffect(() => {
        const storedProperty = localStorage.getItem('propertyDetail');
        const storedRooms = localStorage.getItem('selectedRooms');
        const storedStay = localStorage.getItem('stay-info');

        if (storedProperty) setProperty(JSON.parse(storedProperty));
        if (storedRooms) setSelectedRooms(JSON.parse(storedRooms));
        if (storedStay) setStayInfo(JSON.parse(storedStay));
    }, []);

    const handleConfirmBooking = async () => {
        if (!guest.name || !guest.email || !guest.phone) {
            alert('Please fill in all required guest information.');
            return;
        }

        try {
            const response = await createBooking(
                guest,
                paymentMethod,
                specialRequest,
                stayInfo,
                selectedRooms
            );
            if (response.paymentMethod == 'VN_PAY') {
                await handleVnpayPayment(response);
            }
            else {
                navigate(`/booking-success`);
            }
        } catch (error) {
            console.error('Booking failed:', error);
            alert('There was an error processing your booking. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const handleVnpayPayment = async (response: BookingResponse) => {
        try {
            setIsSubmitting(true);
            const params = {
                amount: response.totalAmount,
                vnp_TxnRef: response.bookingReference,
                vnp_OrderInfo: "BOOKINGHOTEL",
                ordertype: "BOOKINGG",
                language: "vn"
            };
            const data = await bookingApi.getVnpayUrl(params);
            if (data.paymentUrl) {
                window.location.href = data.paymentUrl;
            } else {
                throw new Error("Payment URL was not provided by the server.");
            }
        } catch (error) {
            console.error("VNPAY Redirect Error:", error);
            alert("Failed to initiate VNPAY payment. Please try again.");
            setIsSubmitting(false);
        }
    };

    const totalAmount = selectedRooms.reduce(
        (sum, room) => sum + room.price * room.quantity,
        0
    );

    const nights = stayInfo ? calculateNights(stayInfo.checkIn, stayInfo.checkOut) : 0;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
                    <p className="text-gray-600">Loading your booking details...</p>
                </div>
            </div>
        );
    }

    if (!property || !stayInfo) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center p-6 max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Booking Details Not Found</h2>
                    <p className="text-gray-600 mb-6">We couldn't find the booking details. Please start your booking again.</p>
                    <a href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200">
                        Back to Home
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-grow">
                <div className="container mx-auto px-4 py-8 max-w-6xl">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Confirm Your Booking</h1>
                    <p className="text-gray-600 mb-8">Please review your booking details and complete the form below</p>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Booking Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Property Summary */}
                            <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                {property.media && property.media.length > 0 && (
                                    <div className="h-64 w-full overflow-hidden">
                                        <img
                                            src={property.media[0].url}
                                            alt={property.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="p-6 border-b border-gray-100">
                                    <h2 className="text-xl font-bold text-gray-900 mb-2">{property.name}</h2>
                                    <p className="text-gray-500 text-sm mb-3">{property.address.fullAddress}</p>
                                    <div className="flex items-center">
                                        <div className="flex items-center bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">
                                            <span className="text-yellow-500 mr-1">★</span>
                                            {property.avgRating} ({property.totalRating} reviews)
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 bg-gray-50">
                                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                        Your Stay Details
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Check-in</p>
                                            <p className="font-medium">{formatDate(stayInfo.checkIn)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Check-out</p>
                                            <p className="font-medium">{formatDate(stayInfo.checkOut)}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-sm text-gray-500">Length of stay</p>
                                            <p className="font-medium">{nights} {nights === 1 ? 'night' : 'nights'}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-sm text-gray-500">Guests</p>
                                            <p className="font-medium">{stayInfo.adults} {stayInfo.adults === 1 ? 'Adult' : 'Adults'}{stayInfo.children > 0 ? `, ${stayInfo.children} ${stayInfo.children === 1 ? 'Child' : 'Children'}` : ''}</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Selected Rooms */}
                            <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900">Your Selected Rooms</h3>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {selectedRooms.map((room) => (
                                        <div key={`${room.roomId}-${room.ratePlanId}`} className="p-6">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-medium text-gray-900">{room.roomType}</h4>
                                                    <p className="text-sm text-gray-500 mt-1">{room.ratePlanName}</p>
                                                    <div className="mt-2 text-sm text-gray-600">
                                                        <span className="font-medium">{room.quantity} {room.quantity === 1 ? 'room' : 'rooms'}</span>
                                                        <span className="mx-2">•</span>
                                                        <span>${room.price} per night</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold">${(room.price * room.quantity).toFixed(2)}</p>
                                                    <p className="text-sm text-gray-500">Total for {nights} {nights === 1 ? 'night' : 'nights'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Guest Information */}
                            <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900">Guest Information</h3>
                                    <p className="text-sm text-gray-500 mt-1">Enter the details of the main guest</p>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                                                Full Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                id="fullName"
                                                type="text"
                                                value={guest.name}
                                                onChange={(e) => setGuest({ ...guest, name: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                                Email Address <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                id="email"
                                                type="email"
                                                value={guest.email}
                                                onChange={(e) => setGuest({ ...guest, email: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                                placeholder="your@email.com"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                                Phone Number <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                id="phone"
                                                type="tel"
                                                value={guest.phone}
                                                onChange={(e) => setGuest({ ...guest, phone: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                                placeholder="+1 (555) 000-0000"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-1">
                                                Nationality
                                            </label>
                                            <input
                                                id="nationality"
                                                type="text"
                                                value={guest.nationality}
                                                onChange={(e) => setGuest({ ...guest, nationality: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                                placeholder="Your nationality"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Payment Method */}
                            <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
                                    <p className="text-sm text-gray-500 mt-1">How would you like to pay?</p>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="space-y-3">
                                        <label className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${paymentMethod === 'VN_PAY' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="VN_PAY"
                                                checked={paymentMethod === 'VN_PAY'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                                            />
                                            <div className="ml-3 flex items-center">
                                                <img src="https://yt3.googleusercontent.com/JM1m2wng0JQUgSg9ZSEvz7G4Rwo7pYb4QBYip4PAhvGRyf1D_YTbL2DdDjOy0qOXssJPdz2r7Q=s900-c-k-c0x00ffffff-no-rj" alt="VN_PAY" className="h-6 w-auto mr-3" />
                                                <div>
                                                    <span className="block text-sm font-medium text-gray-900">VNPAY</span>
                                                    <span className="block text-xs text-gray-500">Thanh toán qua cổng VNPAY</span>
                                                </div>
                                            </div>
                                        </label>

                                        <label className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${paymentMethod === 'CASH' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="CASH"
                                                checked={paymentMethod === 'CASH'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                                            />
                                            <div className="ml-3 flex items-center">
                                                <Banknote className="h-6 w-6 text-gray-700 mr-3" />
                                                <div>
                                                    <span className="block text-sm font-medium text-gray-900">Cash</span>
                                                    <span className="block text-xs text-gray-500">Pay at check In</span>
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </section>

                            {/* Special Requests */}
                            <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900">Special Requests</h3>
                                    <p className="text-sm text-gray-500 mt-1">Let us know if you have any special requirements</p>
                                </div>
                                <div className="p-6">
                                    <textarea
                                        rows={4}
                                        value={specialRequest}
                                        onChange={(e) => setSpecialRequest(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                        placeholder="E.g., Early check-in, late check-out, room preferences, etc."
                                    />
                                    <p className="mt-2 text-sm text-gray-500">
                                        We'll do our best to accommodate your requests, but they can't be guaranteed.
                                    </p>
                                </div>
                            </section>
                        </div>

                        {/* Right Column - Booking Summary */}
                        <div className="lg:sticky lg:top-8 h-fit">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900">Booking Summary</h3>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="space-y-3">
                                        {selectedRooms.map((room) => (
                                            <div key={`${room.roomId}-${room.ratePlanId}`} className="flex justify-between">
                                                <div>
                                                    <p className="font-medium text-gray-900">{room.roomType}</p>
                                                    <p className="text-sm text-gray-500">{room.ratePlanName}</p>
                                                    <p className="text-xs text-gray-400">{room.quantity} {room.quantity === 1 ? 'room' : 'rooms'} × {nights} {nights === 1 ? 'night' : 'nights'}</p>
                                                </div>
                                                <p className="font-medium text-gray-900">${(room.price * room.quantity * nights).toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-gray-200 pt-4 space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span className="font-medium">${totalAmount * nights}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Taxes & Fees</span>
                                            <span className="font-medium">${(totalAmount * 0.12 * nights).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                                            <span>Total</span>
                                            <span>${(totalAmount * 1.12 * nights).toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            onClick={handleConfirmBooking}
                                            disabled={isSubmitting}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                                                    Processing...
                                                </>
                                            ) : (
                                                'Confirm Booking'
                                            )}
                                        </button>
                                        <p className="mt-3 text-xs text-gray-500 text-center">
                                            By confirming this booking, you agree to our Terms of Service and Privacy Policy.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 p-6 bg-blue-50 rounded-xl border border-blue-100">
                                <h4 className="font-medium text-blue-800 mb-2">Good to know</h4>
                                <ul className="space-y-2 text-sm text-blue-700">
                                    <li className="flex items-start">
                                        <svg className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>Free cancellation up to 24 hours before check-in</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>No prepayment needed - pay at the property</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>Best price guarantee</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

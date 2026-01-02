import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, CreditCard, Home, MapPin, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import { useFetchBookingResponse } from "../hooks/useFetchBookingResponse.hooks";
import { format } from "date-fns";

export default function BookingSuccessPage() {
    const { bookingData, isLoading, error } = useFetchBookingResponse();
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-lg font-medium">Loading your booking details...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (error || !bookingData) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center space-y-4 max-w-md p-6 bg-red-50 rounded-lg">
                        <div className="text-red-500 text-5xl">⚠️</div>
                        <h2 className="text-2xl font-bold text-red-700">Booking Not Found</h2>
                        <p className="text-gray-600">{error || "We couldn't find your booking details."}</p>
                        <Button onClick={() => navigate("/")} className="mt-4">
                            Back to Home
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const { bookingReference, guest, checkIn, checkOut, totalAmount, bookingItems } = bookingData;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 py-12">
                <div className="container max-w-4xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg
                                className="w-12 h-12 text-green-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
                        <p className="text-gray-600">
                            Your booking reference:{" "}
                            <span className="font-mono font-semibold text-blue-600">{bookingReference}</span>
                        </p>
                        <p className="text-gray-600 mt-2">
                            We've sent the confirmation to {guest.email}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <MapPin className="w-5 h-5 text-blue-500" />
                                        Your Stay
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {bookingItems.map((item, index) => (
                                        <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                                            <h3 className="font-medium text-gray-900">{item.roomTypeName}</h3>
                                            <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4 text-gray-400" />
                                                    <span>{item.quantity} {item.quantity > 1 ? "Rooms" : "Room"}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <CreditCard className="w-4 h-4 text-gray-400" />
                                                    <span>${item.amount.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Clock className="w-5 h-5 text-blue-500" />
                                        Booking Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-gray-500">Check-in</p>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <span>{format(checkInDate, "EEEE, MMMM d, yyyy")}</span>
                                            </div>
                                            <p className="text-sm text-gray-500 ml-6">From 2:00 PM</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-gray-500">Check-out</p>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <span>{format(checkOutDate, "EEEE, MMMM d, yyyy")}</span>
                                            </div>
                                            <p className="text-sm text-gray-500 ml-6">Until 12:00 PM</p>
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <p className="text-sm font-medium text-gray-500">Duration</p>
                                        <p className="text-gray-700">{nights} {nights > 1 ? "nights" : "night"}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">Price Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        {bookingItems.map((item, index) => (
                                            <div key={index} className="flex justify-between text-sm">
                                                <span className="text-gray-600">
                                                    {item.quantity}x {item.roomTypeName}
                                                </span>
                                                <span>${item.amount.toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-t pt-4 space-y-2">
                                        <div className="flex justify-between font-medium">
                                            <span>Total</span>
                                            <span className="text-lg">${totalAmount.toFixed(2)}</span>
                                        </div>
                                        <p className="text-xs text-gray-500">Including all taxes and fees</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="font-medium mb-3">Need help with your booking?</h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Contact our customer service team for any questions about your stay.
                                    </p>
                                    <div className="space-y-2">
                                        <Button asChild>
                                            <a
                                                href="mailto:support@bookingapp.com"
                                                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                                            >
                                                Contact Support
                                            </a>
                                        </Button>
                                        <Button className="w-full" asChild>
                                            <a href="/">
                                                <Home className="w-4 h-4 mr-2" />
                                                Back to Home
                                            </a>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
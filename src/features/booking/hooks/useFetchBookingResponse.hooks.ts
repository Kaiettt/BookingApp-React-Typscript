import { useState, useEffect } from "react";
import type { BookingResponse } from "../types/type";

export function useFetchBookingResponse() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [bookingData, setBookingData] = useState<BookingResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getStoredBooking = () => {
            setIsLoading(true);
            try {
                const rawData = localStorage.getItem('bookingResponse');
                
                if (!rawData) {
                    throw new Error("No booking data found");
                }

                const parsedData: BookingResponse = JSON.parse(rawData);
                setBookingData(parsedData);
            } catch (err) {
                console.error("Error parsing booking response:", err);
                setError("Could not retrieve booking details.");
            } finally {
                setIsLoading(false);
            }
        };

        getStoredBooking();
    }, []);

    return { bookingData, isLoading, error };
}
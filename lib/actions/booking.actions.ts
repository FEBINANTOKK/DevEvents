'use server';

import connectDB from '@/lib/mongodb';
import Booking from '@/database/booking.model';
import mongoose from 'mongoose';

export const createBooking = async ({
                                        eventId,
                                        slug,
                                        email,
                                    }: {
    eventId: string;
    slug: string;
    email: string;
}) => {
    try {
        await connectDB();

        await Booking.create({
            eventId: new mongoose.Types.ObjectId(eventId),
            email,
        });

        return { success: true };
    } catch (error: any) {
        console.error('createBooking error:', error);

        // ✅ Duplicate booking (unique index)
        if (error.code === 11000) {
            return {
                success: false,
                error: 'You have already booked this event with this email',
            };
        }

        // ✅ Validation errors
        if (error.name === 'ValidationError') {
            return {
                success: false,
                error: error.message,
            };
        }

        // ✅ Invalid ObjectId
        if (error.name === 'CastError') {
            return {
                success: false,
                error: 'Invalid event ID',
            };
        }

        // ✅ Generic fallback
        return {
            success: false,
            error: 'Database error',
        };
    }
};

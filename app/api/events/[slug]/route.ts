import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Event from '@/database/event.model';

type RouteParams = {
    params: Promise<{
        slug: string;
    }>;
};

export async function GET(
    req: NextRequest,
    { params }: RouteParams
) {
    try {
        await connectDB();

        // ✅ MUST await params
        const { slug } = await params;

        if (!slug || typeof slug !== 'string') {
            return NextResponse.json(
                { message: 'Invalid or missing slug parameter' },
                { status: 400 }
            );
        }

        const event = await Event.findOne({ slug }).lean();

        if (!event) {
            return NextResponse.json(
                { message: 'Event not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Event fetched successfully', event },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching event:', error);

        return NextResponse.json(
            { message: 'Failed to fetch event' },
            { status: 500 }
        );
    }
}

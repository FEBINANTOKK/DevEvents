'use client';

import { useEffect, useState } from "react";
import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";

export default function Page() {
    const [events, setEvents] = useState<IEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch('/api/events'); // relative URL works on Vercel
                if (!res.ok) {
                    throw new Error(`Failed to fetch events: ${res.statusText}`);
                }

                const data = await res.json();
                setEvents(data.events || []);
            } catch (err: any) {
                console.error(err);
                setError(err.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return (
        <section>
            <h1 className="text-center">
                The Hub for Every Dev <br /> Event You Can't Miss
            </h1>
            <p className="text-center mt-5">
                Hackathons, Meetups, and Conferences, All in One Place
            </p>

            <ExploreBtn />

            {loading && <p className="text-center mt-10">Loading events...</p>}
            {error && <p className="text-center mt-10 text-red-500">Error: {error}</p>}

            {!loading && !error && (
                <div className="mt-20 space-y-7">
                    <h3>Featured Events</h3>
                    <ul className="events">
                        {events.length > 0 ? (
                            events.map((event: IEvent) => (
                                <li key={event.title} className="list-none">
                                    <EventCard {...event} />
                                </li>
                            ))
                        ) : (
                            <p>No events found.</p>
                        )}
                    </ul>
                </div>
            )}
        </section>
    );
}

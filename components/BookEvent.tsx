'use client';

import { useState } from 'react';
import { createBooking } from '@/lib/actions/booking.actions';
import posthog from 'posthog-js';

const BookEvent = ({ eventId, slug }: { eventId: string; slug: string }) => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const result = await createBooking({ eventId, slug, email });

        if (result.success) {
            setSubmitted(true);
            posthog.capture('event_booked', { eventId, slug, email });
        } else {
            console.error(result.error);
            setError(result.error || 'Booking failed');
            posthog.captureException(result.error || 'Booking creation failed');
        }
    };

    return (
        <div id="book-event">
            {submitted ? (
                <p className="text-sm">Thank you for signing up!</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button type="submit" className="button-submit">
                        Submit
                    </button>
                </form>
            )}
        </div>
    );
};

export default BookEvent;

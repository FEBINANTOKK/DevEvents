import { Schema, model, models, Document, Types } from 'mongoose';
import Event from './event.model';

export interface IBooking extends Document {
    eventId: Types.ObjectId;
    email: string;
}

const BookingSchema = new Schema<IBooking>(
    {
        eventId: {
            type: Schema.Types.ObjectId,
            ref: 'Event',
            required: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
    },
    { timestamps: true }
);

// ✅ Mongoose v7+ correct pre-save hook (NO next)
BookingSchema.pre('save', async function () {
    const booking = this as IBooking;

    if (booking.isNew || booking.isModified('eventId')) {
        const eventExists = await Event.findById(booking.eventId).select('_id');

        if (!eventExists) {
            throw new Error('Event does not exist');
        }
    }
});

// Indexes
BookingSchema.index({ eventId: 1 });
BookingSchema.index({ email: 1 });
BookingSchema.index(
    { eventId: 1, email: 1 },
    { unique: true, name: 'uniq_event_email' }
);

const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);
export default Booking;

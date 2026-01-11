import { model, Schema } from 'mongoose';

const table_booking_schema = new Schema({
  customer_id: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  table_ids: [{ type: Schema.Types.ObjectId, ref: 'Table', required: true }],
  booking_time: { type: Date, required: true },
  state: {
    type: String,
    required: true,
    enum: ['booking', 'cancel', 'done'],
    default: 'booking',
  },
});

const table_booking_model = model('TableBooking', table_booking_schema);

export default table_booking_model;

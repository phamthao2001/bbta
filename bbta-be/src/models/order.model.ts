import { model, Schema } from 'mongoose';

const order_schema = new Schema({
  serve_session_id: { type: Schema.Types.ObjectId, ref: 'ServeSession', required: true },
  ordered: [
    {
      food_id: { type: Schema.Types.ObjectId, ref: 'Food', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      table_id: { type: Schema.Types.ObjectId, ref: 'Table', required: true },
    },
  ],
  preparing: [
    {
      food_id: { type: Schema.Types.ObjectId, ref: 'Food', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      table_id: { type: Schema.Types.ObjectId, ref: 'Table', required: true },
      time_started: { type: Date, required: true },
    },
  ],
  cancelled: [
    {
      food_id: { type: Schema.Types.ObjectId, ref: 'Food', required: true },
      quantity: { type: Number, required: true },
      table_id: { type: Schema.Types.ObjectId, ref: 'Table', required: true },
      time_cancelled: { type: Date, required: true },
      reason_cancelled: { type: String },
    },
  ],
  served: [
    {
      food_id: { type: Schema.Types.ObjectId, ref: 'Food', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      table_id: { type: Schema.Types.ObjectId, ref: 'Table', required: true },
      time_served: { type: Date, required: true },
    },
  ],
  total_price: { type: Number, required: true },
});

const order_model = model('Order', order_schema);

export default order_model;

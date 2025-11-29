import { model, Schema } from 'mongoose';

const bill_schema = new Schema({
  serve_session_id: { type: Schema.Types.ObjectId, ref: 'ServeSession', required: true },
  items: [
    {
      food_id: { type: Schema.Types.ObjectId, ref: 'Food', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  total_price: { type: Number, required: true },
});

const bill_model = model('Bill', bill_schema);

export default bill_model;

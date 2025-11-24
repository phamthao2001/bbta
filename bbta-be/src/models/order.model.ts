import { model, Schema } from 'mongoose';

const order_schema = new Schema({
  serve_session_id: { type: Schema.Types.ObjectId, ref: 'ServeSession', required: true },
  food_id: { type: Schema.Types.ObjectId, ref: 'Food', required: true },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true },
  status: {
    type: String,
    required: true,
    enum: ['ordering', 'preparing', 'served', 'cancelled'],
    default: 'ordering',
  },
});

const order_model = model('Order', order_schema);

export default order_model;

import { model, Schema } from 'mongoose';

const list_serve_static_schema = new Schema({
  serve_session_id: { type: Schema.Types.ObjectId, ref: 'ServeSession', required: true },
  list_serve: [
    {
      food_id: { type: Schema.Types.ObjectId, ref: 'Food', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
});

const list_serve_static_model = model('ListServe', list_serve_static_schema);

export default list_serve_static_model;

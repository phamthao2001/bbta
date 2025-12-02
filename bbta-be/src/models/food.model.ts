import { model, Schema } from 'mongoose';

const food_schema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image_url: { type: String },
  description: { type: String },
  is_deleted: { type: Boolean, default: false },
});

const food_model = model('Food', food_schema);

export default food_model;

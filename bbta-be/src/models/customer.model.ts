import { model, Schema } from 'mongoose';

const customer_schema = new Schema({
  phone: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  sex: { type: String },
  birthday: { type: String },

  password: { type: String, required: true },
  is_deleted: { type: Boolean, default: false },
});

const customer_model = model('Customer', customer_schema);

export default customer_model;

import { model, Schema } from 'mongoose';

const admin_schema = new Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  password: { type: String, required: true },
  is_deleted: { type: Boolean, default: false },
});

const admin_model = model('Admin', admin_schema);

export default admin_model;

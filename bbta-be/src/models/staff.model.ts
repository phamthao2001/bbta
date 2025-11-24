import { model, Schema } from 'mongoose';

const staff_schema = new Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  salary: { type: Number },

  // private
  password: { type: String, required: true },
});

const staff_model = model('Staff', staff_schema);

export default staff_model;

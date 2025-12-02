import { model, Schema } from 'mongoose';

const table_schema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  capacity: { type: Number, required: true, default: 1 },
  is_deleted: { type: Boolean, default: false },
});

const table_model = model('Table', table_schema);

export default table_model;

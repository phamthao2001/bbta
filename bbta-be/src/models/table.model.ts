import { model, Schema } from 'mongoose';

const table_schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  capacity: { type: Number, required: true },
});

const table_model = model('Table', table_schema);

export default table_model;

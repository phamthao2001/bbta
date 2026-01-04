import { model, Schema } from 'mongoose';

const serve_session_schema = new Schema({
  table_ids: [{ type: Schema.Types.ObjectId, ref: 'Table', required: true }],
  customer_id: { type: Schema.Types.ObjectId, ref: 'Customer' },
  code_login: { type: String, required: true },

  is_updated_served: {
    type: Boolean,
    default: false,
  },
  type_bill: { type: String },
  bills: [
    {
      items: [
        {
          food_id: { type: Schema.Types.ObjectId, ref: 'Food', required: true },
          quantity: { type: Number, required: true },
          price: { type: Number, required: true },
        },
      ],
    },
  ],
  money: { type: Number },

  started_at: { type: Date, required: true, default: Date.now },
  ended_at: { type: Date },
});

const serve_session_model = model('ServeSession', serve_session_schema);

export default serve_session_model;

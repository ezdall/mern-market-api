const { Schema, model } = require('mongoose');

const cartItemSchema = new Schema({
  product: { type: Schema.ObjectId, ref: 'product' },
  quantity: Number,
  shop: { type: Schema.ObjectId, ref: 'shop' },
  status: {
    type: String,
    default: 'Not processed',
    enum: ['Not processed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
  }
});

const CartItem = model('cartItem', cartItemSchema);

const orderSchema = new Schema(
  {
    products: [cartItemSchema],
    customer_name: {
      type: String,
      trim: true,
      required: 'Name is required'
    },
    customer_email: {
      type: String,
      trim: true,
      match: [/.+@.+\..+/, 'Please fill a valid email address'],
      required: 'Email is required'
    },
    delivery_address: {
      street: { type: String, required: 'Street is required' },
      city: { type: String, required: 'City is required' },
      state: { type: String },
      zipcode: { type: String, required: 'Zip Code is required' },
      country: { type: String, required: 'Country is required' }
    },
    payment_id: {},
    user: { type: Schema.ObjectId, ref: 'User' }
  },
  // other options
  { timestamps: true, versionKey: false }
);

const Order = model('order', orderSchema);

module.exports = { Order, CartItem };

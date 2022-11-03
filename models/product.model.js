const { Schema, model } = require('mongoose');

const productSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: 1,
      maxlength: 32,
      required: 'Name is required'
    },
    quantity: {
      type: Number,
      required: 'Quantity is required'
    },
    price: {
      type: Number,
      required: 'Price is required'
    },
    image: {
      data: Buffer,
      contentType: String
    },
    description: {
      type: String,
      trim: true
    },
    category: {
      type: String
    },
    shop: {
      type: Schema.ObjectId,
      ref: 'shop'
    }
  },
  // other options
  { timestamps: true, versionKey: false }
);

module.exports = model('product', productSchema);

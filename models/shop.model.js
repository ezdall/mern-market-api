const { Schema, model } = require('mongoose');

const shopSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: 'Name is required'
    },
    image: {
      data: Buffer,
      contentType: String
    },
    description: {
      type: String,
      trim: true
    },
    owner: {
      type: Schema.ObjectId,
      ref: 'user'
    }
  },
  // other options
  { timestamps: true, versionKey: false }
);

module.exports = model('shop', shopSchema);

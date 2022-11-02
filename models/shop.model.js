import { Schema, model } = require('mongoose')

const shopSchema = new Schema({
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
})

module.exports = model('shop', shopSchema)

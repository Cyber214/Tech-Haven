import mongoose from 'mongoose'

const Schema = mongoose.Schema

const offerSchema = new Schema({
  value: Number,
  acceptance: Boolean,
  comment: {
    type: String,
    required: true
  },
  author: {type: Schema.Types.ObjectId, ref: 'Profile'}
}, {timestamps: true})

const deviceSchema = new Schema({
  make: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['New', 'Used', 'Refurbished'],
  },
  damage: { type: Boolean},
  scratches: { type: Boolean },
  cracks: { type: Boolean },
  author: {type: Schema.Types.ObjectId, ref: 'Profile'},
  offers: [offerSchema]
}, {timestamps: true})

const Device = mongoose.model('Device', deviceSchema)

export {
  Device
}
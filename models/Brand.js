import mongoose from 'mongoose'

const BrandSchema = new mongoose.Schema({
  brandname: {
    type: String,
    required: [true, 'Добавь наименование бренда'],
  },
  country: String,
  description: String,
  brandlogo: String,
})

export default mongoose.model('Brand', BrandSchema)

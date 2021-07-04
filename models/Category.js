import mongoose from 'mongoose'
import slugify from 'slugify'

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Требуется добавить наименование категории'],
    maxlength: [50, 'Максималное количество знаков наименования - 50'],
  },
  description: {
    type: String,
    maxlength: [
      1000,
      'Максималное количество знаков описания категории - 1000',
    ],
  },
  inmenu: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    unique: true,
  },
  slug: {
    type: String,
    unique: true,
  },
})

CategorySchema.pre('save', (next) => {
  this.slug = slugify(this.name, { lower: true })
})

export default mongoose.model('Category', CategorySchema)

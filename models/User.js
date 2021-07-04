import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Требуется добавить имя пользователя'],
    maxlength: [50, 'Допустимая длина имени 50 знаков'],
  },
  email: {
    type: String,
    required: [true, 'Требуется добавить адрес электронной почты'],
    maxlength: [50, 'Максимальная длина почты не более 50 знаков'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Требуется адрес электронной почты',
    ],
  },
  password: {
    type: String,
    required: [true, 'Требуется пароль'],
    minlength: [6, 'Минимальная длина пароля - 6 символов'],
    select: false,
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'admin', 'super'],
      message: 'Роль {VALUE} не существует',
    },
    default: 'user',
  },
  phone: {
    type: String,
    validate: {
      validator: function (v) {
        return /^((\+7|7|8)+([0-9]){10})$/.test(v)
      },
      message: (props) =>
        `${props.value} Номер телефона не соответствует формату 89997777777 или +79997777777, 79997777777`,
    },
  },
  address: {
    zipcode: String,
    region: String,
    city: String,
    street: String,
    house: String,
    office: String,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })
}
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex')

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000
  return resetToken
}

export default mongoose.model('User', UserSchema)

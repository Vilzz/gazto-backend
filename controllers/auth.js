import crypto from 'crypto'
import sendEmail from '../utils/sendEmail.js'
import ErrorResponse from '../utils/errorResponse.js'
import asyncHandler from '../middleware/asyncHandler.js'
import User from '../models/User.js'

//*************************************/
// @desc Регистрация нового пользователя
// @route POST /api/v1/auth/register
// @access Публичный
//*************************************/
export const registerUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body)
  const token = user.getSignedJwtToken()
  const id = user._id
  res.status(200).json({ success: true, token, id })
})

//*************************************/
// @desc    Вход пользователя
// @route   POST /api/v1/auth/login
// @access  Публичный
//*************************************/
export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    return next(
      new ErrorResponse('Отсутствует адрес электронной почты или пароль'),
      400
    )
  }
  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    return next(new ErrorResponse('Данные пользователя не верны'), 401)
  }

  const isMatch = await user.matchPassword(password)

  if (!isMatch) {
    return next(new ErrorResponse('Данные пользователя не верны'), 401)
  }
  sendTokenResponse(user, 200, res)
})

//***********************************/
// @desc Выход пользователя
// @route GET /api/v2/auth/logout
// @access Закрытый
//***********************************/
export const logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  })
  const { name } = req.name
  res.status(200).json({
    success: true,
    data: name,
  })
})

//********************************************/
// @desc Данные авторизованного пользователя
// @route GET /api/v2/auth/me
// @access Закрытый
//********************************************/
export const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id)
  res.status(200).json({
    success: true,
    data: user,
  })
})

//*************************************/
// @desc    Список пользователей
// @route   GET /api/v1/auth/users
// @access  Приватный
//*************************************/
export const getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})

//*************************************/
// @desc    Удалить пользователя
// @route   DELETE /api/v1/auth/users/:id
// @access  Приватный
//*************************************/
export const deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const user = await User.findById(id)
  if (!user) {
    return next(new ErrorResponse(`Пользователь с id - ${id} не найден`, 404))
  }
  user.remove()
  res.status(200).json({
    success: true,
    data: {},
  })
})

//********************************************/
// @desc Запрос на восстановление пароля
// @route POST /api/v2/auth/forgotpassword
// @access Открытый
//********************************************/
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    return next(
      new ErrorResponse(
        `Пользователь с указанным адресом ${req.body.email} не найден`,
        404
      )
    )
  }
  const resetToken = user.getResetPasswordToken()
  await user.save({ validateBeforeSave: false })

  // TODO Поменять адрес перехода на страницу fronta для сброса пароля
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`

  const message = `
    <p>Мы отправили вам это письмо потому что вы или кто-то еще запросил сброс пароля на сайте gazto.ru.
      <br /> 
      Для завершения процедуры перейдите по ссылке:
    </p> 
    <a href='${resetUrl}'>Перейти на сайт gazto.ru для сброса пароля</a>
    <p>Проигнорируйте данное письмо если вы не отправляли запрос на изменение учетных данных</p>`
  try {
    await sendEmail({
      email: user.email,
      subject: 'Запрос на смену пароля на сайте <Название сайта>',
      message,
    })
    res.status(200).json({
      success: true,
      data: 'Письмо отправлено',
    })
  } catch (err) {
    console.log(err)
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save({ validateBeforeSave: false })
    return next(new ErrorResponse('Письмо не может быть отправлено', 500))
  }
})

//*****************************************************/
// @desc Сброс пароля
// @route PUT /api/v2/auth/resetpassword/:resettoken
// @access Открытый
//*****************************************************/
export const resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex')

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  })
  if (!user) {
    return next(new ErrorResponse('Неверный токен сброса пароля', 400))
  }
  user.password = req.body.password
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined
  await user.save()
  sendTokenResponse(user, 200, res)
})
//*****************************************************/
// @desc Изменить пароль пользователя
// @route PUT /api/v1/auth/updatepassword
// @access Приватный
//*****************************************************/
export const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password')
  if (!req.body.currentPassword) {
    return next(new ErrorResponse('Вы забыли добавить текущий пароль', 401))
  }
  if (!req.body.newPassword) {
    return next(new ErrorResponse('Вы забыли добавить новый пароль', 401))
  }
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Неверный пароль', 401))
  }
  user.password = req.body.newPassword
  await user.save()
  sendTokenResponse(user, 200, res)
})

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken()
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  }
  if (process.env.NODE_ENV === 'production') {
    options.secure = true
  }
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: {
        role: user.role,
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    })
}

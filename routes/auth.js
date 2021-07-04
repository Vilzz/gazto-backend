import express from 'express'
const router = express.Router()
import User from '../models/User.js'
import { protect, authorise } from '../middleware/authHandler.js'
import advancedRes from '../middleware/advancedRes.js'

import {
  registerUser,
  loginUser,
  getUsers,
  deleteUser,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
} from '../controllers/auth.js'

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router
  .route('/users')
  .get(protect, authorise('admin', 'super'), advancedRes(User), getUsers)
router
  .route('/users/:id')
  .delete(protect, authorise('admin', 'super'), deleteUser)
router.get('/me', protect, getMe)
router.get('/logout', logout)
router.post('/forgotpassword', forgotPassword)
router.put('/resetpassword/:resettoken', resetPassword)
router.put('/updatepassword', protect, updatePassword)

export default router

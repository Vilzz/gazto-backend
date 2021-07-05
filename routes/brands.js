import express from 'express'
const router = express.Router()
import Brand from '../models/Brand.js'
import { protect, authorise } from '../middleware/authHandler.js'
import advancedRes from '../middleware/advancedRes.js'
import {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
} from '../controllers/brands.js'

router
  .route('/')
  .get(advancedRes(Brand), getBrands)
  .post(protect, authorise('admin', 'super'), createBrand)
router
  .route('/:id')
  .get(getBrand)
  .put(protect, authorise('admin', 'super'), updateBrand)
  .delete(protect, authorise('admin', 'super'), deleteBrand)

export default router

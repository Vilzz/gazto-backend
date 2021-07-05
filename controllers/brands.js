import ErrorResponse from '../utils/errorResponse.js'
import asyncHandler from '../middleware/asyncHandler.js'
import Brand from '../models/Brand.js'

//*************************************/
// @desc Создать бренд
// @route POST /api/v1/brands
// @access Закрытый (администратор, разработчик)
//*************************************/
export const createBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.create(req.body)
  res.status(201).json({
    success: true,
    data: brand,
  })
})

//*************************************/
// @desc Получить список всех брендов из БД
// @route GET /api/v1/brands
// @access Открытый
//*************************************/
export const getBrands = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})

//*************************************/
// @desc Получить бренд из БД
// @route GET /api/v1/brands/:id
// @access Открытый
//*************************************/
export const getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const brand = await Brand.findById(id)
  if (!brand) {
    return next(new ErrorResponse(`Ресурс с id -${id} не найден`, 404))
  }
  res.status(200).json({
    success: true,
    data: brand,
  })
})

//*************************************/
// @desc Изменить данные бренда
// @route PUT /api/v1/brands/:id
// @access Закрытый (администратор, разработчик)
//*************************************/
export const updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const brand = await Brand.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!brand) {
    return next(new ErrorResponse(`Ресурс с id - ${id} не найден`, 404))
  }
  res.status(200).json({
    success: true,
    data: brand,
  })
})

//*************************************/
// @desc Удалить бренд из БД
// @route DELETE /api/v1/brands/:id
// @access Закрытый, (администратор, разработчик)
//*************************************/
export const deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const brand = await Brand.findById(id)
  if (!brand) {
    return next(new ErrorResponse(`Ресурс с id - ${id} не найден`, 404))
  }
  brand.remove()
  res.status(200).json({
    success: true,
    data: {},
  })
})

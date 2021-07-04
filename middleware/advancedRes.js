const advancedResults =
  (model, ...populate) =>
  async (req, res, next) => {
    let query
    const reqQuery = { ...req.query }
    const removeFields = ['select', 'sort', 'page', 'limit', 'list', 'search']
    removeFields.forEach((param) => delete reqQuery[param])
    query = model.find(reqQuery)
    let queryStr = JSON.stringify(reqQuery)
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    )
    query = model.find(JSON.parse(queryStr))

    if (req.query.list) {
      const field = Object.keys(req.query.list)[0]
      let arr = req.query.list[field].split(',').map((param) => param)
      if (arr.length < 10) {
        req.query.limit = arr.length
      }
      query = model.find({ [field]: { $in: arr } })
    }

    if (req.query.search) {
      const searchText = req.query.search
      if (queryStr) {
        query = model.find({
          $text: { $search: `\"${searchText}\"` },
          ...JSON.parse(queryStr),
        })
      } else {
        query = model.find({ $text: { $search: `\"${searchText}\"` } })
      }
    }

    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ')
      query = query.select(fields)
    }
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')
      query = query.sort(sortBy)
    }
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 10
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await model.estimatedDocumentCount()

    query = query.skip(startIndex).limit(limit)

    if (populate) {
      populate.map((obj) => (query = query.populate(obj)))
    }

    const pagination = {}

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      }
    }
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      }
    }
    const results = await query

    res.advancedResults = {
      success: true,
      count: results.length,
      limit,
      total,
      pagination,
      data: results,
    }

    next()
  }

export default advancedResults

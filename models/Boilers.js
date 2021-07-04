import mongoose from 'mongoose'

const BoilerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Добавь наименование'],
  },
  article: {
    type: String,
  },
  price: {
    type: String,
  },
  brand: {
    type: String,
  },
  countryOfOrigin: {
    type: String,
  },
  warrantyTime: {
    type: String,
  },
  boilerType: {
    type: String,
    required: [true, 'Добавь тип котла'],
  },
  boilerPower: {
    type: String,
    required: [true, 'Добавь мощность котла'],
  },
  mountMethod: {
    type: String,
    required: [true, 'Добавь способ монтажа'],
  },
  ignitionType: {
    type: String,
    required: [true, 'Добавь тип розжига'],
  },
  heatedArea: {
    type: String,
    required: [true, 'Добавь максимальную площадь обогрева'],
  },
  chimneyType: {
    type: String,
  },
  automation: {
    type: String,
  },
  gasValve: {
    type: String,
  },
  voltage: {
    type: String,
  },
  contoursNumber: {
    type: String,
  },
  mainHeatExchanger: {
    type: String,
  },
  secondaryHeatExchanger: {
    type: String,
  },
  kpd: {
    type: String,
  },
  waterVolume: {
    type: String,
  },
  contourOperatingTemp: {
    type: String,
  },
  contourOperatingPress: {
    type: String,
  },
  gvsWorkingTemp: {
    type: String,
  },
  gvsWorkingPress: {
    type: String,
  },
  naturalGasConsumption: {
    type: String,
  },
  liquefiedGasConsumption: {
    type: String,
  },
  hotWater25: {
    type: String,
  },
  hotWater30: {
    type: String,
  },
  hotWater35: {
    type: String,
  },
  insideWaterTank: {
    type: String,
  },
  chimneyDiameter: {
    type: String,
  },
  heaterContourConnectionSize: {
    type: String,
  },
  gvsContourConnectionSize: {
    type: String,
  },
  gasConnectionSize: {
    type: String,
  },
  sizes: {
    height: String,
    width: String,
    depth: String,
  },
  weight: {
    type: String,
  },
})

export default mongoose.model('Boiler', BoilerSchema)

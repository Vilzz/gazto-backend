import mongoose from 'mongoose'

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  console.log(
    `Сервер подключен к БД ${
      conn.connection.name.toUpperCase().cyan.underline
    } адрес: ${conn.connection.host.toUpperCase().cyan.underline}`.blue.bold
  )
}

export default connectDB

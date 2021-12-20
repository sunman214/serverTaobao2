require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const bodyParse = require('body-parser')

//google authenticator

//nodemail

const app = express()
const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://taroadjs1:1234@cluster.gsqqz.mongodb.net/Cluster?retryWrites=true&w=majority`)
        console.log('Connected mongoose db')
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}
connectDB()

app.use(express.json())
app.use(cookieParser())
app.use(bodyParse.json())
app.use(bodyParse.urlencoded({extended: true}))
app.use(fileUpload({
    useTempFiles: true
}))
app.use(cors())
//Routes
app.use('/user', require('./routes/userRouter'))
app.use('/api', require('./routes/categoryRouter'))
app.use('/api', require('./routes/upload'))
app.use('/api', require('./routes/productRouter'))
app.use('/api', require('./routes/paymentRouter'))

const PORT = 8000
app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`))





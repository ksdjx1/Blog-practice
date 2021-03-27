import express from 'express'
import mongoose from 'mongoose'
import config from './config'
import postRoutes from './routes/api/post'
import userRoutes from './routes/api/user'
import authRoutes from './routes/api/auth'
import hpp from 'hpp'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'

const app = express()
const {MONGO_URI} = config

app.use(hpp())
app.use(helmet())
app.use(cors({origin: true, credentials: true}))
app.use(morgan("dev"))
app.use(express.json())
app.use('/api/post', postRoutes)
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(()=> console.log("MongoDB connecting Success"))
.catch((e)=>console.log(e))

app.get('/')


export default app
import express from 'express'
import Post from '../../models/post'
import auth from '../../middleware/auth'
import multerS3 from 'multer-s3'
import multer from 'multer'
import path from 'path'
import AWS from 'aws-sdk'
import dotenv from 'dotenv'
import moment from 'moment'
import Category from '../../models/category'
import { isNullOrUndefined } from 'util'
import User from '../../models/user'

dotenv.config()

const router = express.Router()

const s3 = new AWS.S3({
    accessKeyId : process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_PRIVATE_KEY
})

const uploadS3 = multer ({
    storage: multerS3({
        s3,
        bucket: 'blog2021',
        region: 'ap-northeast-2',
        KeyboardEvent(req, file, cb) {
            const ext = path.extname(file.originalname)
            const basename = path.basename(file.originalname, ext)
            cb(null, basename + new Date().valueOf() + ext)
        }
    }),
    limits: {fileSize: 100 * 1024 * 1024}
})

router.post('/image', uploadS3.array('upload', 5), async(req, res, next) =>{
    try {
        console.log(req.files.map((v)=> v.location))
        res.json({uploaded: true, url: req.files.map((v)=>v.location)})
    } catch (e) {
        console.log(e)
        res.json({uploaded: false, url: null})
    }
})

router.get('/', async(req,res)=> {
    const postFindResult = await Post.find()
    console.log(postFindResult, "All Post Got")
    res.json(postFindResult)
})

router.post('/', auth, uploadS3.none() ,async(req, res, next) => {
    try {
        console.log(req, "req")
        const {title, contents, fileUrl, creator, category} = req.body
        const newPost = await Post.create({
            title, contents, fileUrl, creator: req.user.id, date: moment().format('YYYY-MM-DD hh:mm:ss')
        })

        const findResult = await Category.findOne({
            categoryName: category
        })

        console.log(findResult, 'find result')
        if (isNullOrUndefined(findResult)) {
            const newCategory = await Category.create({
                categoryName: category
            })
            await Post.findByIdAndUpdate(newPost._id, {
                $push: {category: newCategory._id}
            })
            await Category.findByIdAndUpdate(newCategory._id, {
                $push: {posts: newPost._id}
            })
            await User.findByIdAndUpdate(req.user.id, {
                $push: {
                    posts: newPost._id
                }
            })
        } else {
            await Category.findByIdAndUpdate(findResult._id, {
                $push: {posts: newPost._id}
            })
            await Post.findByIdAndUpdate(newPost._id, {
                category: findResult._id
            })
            await User.findByIdAndUpdate(req.user.id, {
                $push: {posts: newPost._id}
            })
        }
        return res.redirect(`/api/post/${newPost._id}`)

    } catch(e) {
        console.log(e)
    }
})

router.get('/:id', async(req, res, next) => {
    try {
        const post = await (await Post.findById(req.params.id)).populate('creator', 'name').populate({path: 'category', select: 'categoryName'})
    } catch(e) {
        console.error(e)
        next(e)
    }
})

export default router
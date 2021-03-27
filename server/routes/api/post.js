import express from 'express'
import Post from '../../models/post'
import auth from '../../middleware/auth'

const router = express.Router()

router.get('/', async(req,res)=> {
    const postFindResult = await Post.find()
    console.log(postFindResult, "All Post Got")
    res.json(postFindResult)
})

router.post('/', auth, async(req, res, next) => {
    try {
        console.log(req, "req")
        const {title, contents, fileUrl, creator} = req.body
        const newPost = await Post.create({
            title, contents, fileUrl, creator
        })
        res.json(newPost)
    } catch(e) {
        console.log(e)
    }
})

export default router
import moment from "moment"
import mongoose from "mongoose"

const CommnetSchema = new mongoose.Schema({
    contents : {
        type: String,
        required: true
    },
    date: {
        type: String,
        ref: moment().format("YYYY-MM-DD hh:mm:ss")
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post"
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    creatorName : {
        type: String
    }
})

const Comment = mongoose.model("comment", CommnetSchema)

export default Comment
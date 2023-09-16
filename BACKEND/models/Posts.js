import mongoose from "mongoose";


const postSchema = mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    description:String,
    picturePath: String,
    userPicturePath: String,
    // likes is a type of map, if the user likes it, the userId will be set in map
    // if it does not like it will remove the id.
    likes: {
        type:Map,
        of: Boolean
    },
    comments:{
        type:Array,
        default:[]
    }
}, {timestamps:true});

const Post = mongoose.model('Post', postSchema);

export default Post;
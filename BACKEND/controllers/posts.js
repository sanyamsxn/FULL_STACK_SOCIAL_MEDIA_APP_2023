import Post from "../models/Posts.js";
import User from "../models/User.js";



/* CREATE */
export const createPost = async(req, res)=>{
    try{
        const {userId, description, picturePath} = req.body; 
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName:user.firstName,
            lastName:user.lastName,
            description,
            userPicturePath : user.picturePath,
            picturePath,
            likes:{},
            comments:[]
        })
        await newPost.save();
        //after post is created we need to update the feed with all 
        // the posts
        const posts = await Post.find();
        // 201 is for something created successfully
        res.status(201).json(posts);
    }catch(err){
        res.status(409).json({error: err.message});
    }
}


/* READ */
export const getFeedPosts = async (req, res) => {
    try{
        const posts = await Post.find();
        res.status(200).json(posts);
    }catch(err){
        res.status(409).json({error: err.message});

    }
}

export const getUserPosts = async (req, res) => {
    try{
        const {userId} = req.params;
        const posts = await Post.find({userId});
        res.status(200).json(posts);
    }catch(err){
        res.status(409).json({error: err.message});

    }
}


/* UPDATE */
export const likePost = async(req, res)=>{
    try{
        const {id} = req.params;  //post id
    const {userId} = req.body; 

    const post = await Post.findById(id);  
    
    // this will return true if that userId is there
    // in the likes map.
    const isLiked = post.likes.get(userId);  

    if(isLiked) {
        // userId is there means post is liked, so
        // now we want to remove the like.
        post.likes.delete(userId);
    } else{
        // else like the post 
        post.likes.set(userid, true);
    }

    //update post for the frontend
    const updatedPost = await Post.findByIdAndUpdate(id,
        {likes: post.likes},
        {new:true}
        )

    res.status(200).json(updatedPost);
    }catch(err){
        res.status(409).json({error: err.message});
    }
}
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../models/User.js";



/* REGISTER USER */ 
export const register = async(req, res)=>{
    try{
        //grab this from the req body using body parser.
        const{firstName, lastName, email, password, picturePath, friends, occupation} = req.body;
        const salt = await bcrypt.genSalt(); //this will give a random string     
        const hashPassword = await bcrypt.hash(password, salt); //hasing password using salt.  

        const newUser = new User({
            // passing info for User model
            firstName, lastName, email,
            password : hashPassword,   // passing hashed value
            picturePath, friends, occupation, 
            viewedProfile:Math.floor(Math.random()*10000),
            impressions: Math.floor(Math.random()*10000)
        });
        const savedUser = await newUser.save();  //saving in DB
        res.status(201).json(savedUser); // these status and msg are important for frontend
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
}



/* login user */
export const login = async(req, res)=>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email: email}); 
        if(!user)
            return res.status(400).json({msg: "User does not exist"});

        //means user is found
        //match password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch)
            return res.status(400).json({msg: "Invalid Credentials"});

        // here it the password was correct so we will issue a token.
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);

        // delete password from returned user so that we won't return password
        // to the frontend.
        delete user.password;  

        res.status(200).json({token, user});
    }catch(err){
        res.status(500).json({error: err.message});
    }
}
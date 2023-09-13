// models folder contains the schema. design for the data structure. here we will have a data structure for user
import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        min:2,
        max:30,
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        max:30,
        unique:true
    },
    password:{
        type:String,
        required:true,
        min:8
    },
    picturePath:{
        type:String,
        default:""
    },
    friends:{
        type:Array,
        default:[]
    },
    occupation:String,
    viewedProfile: Number,
    impressions: Number
}, {timestamps:true});

const User = mongoose.model('User', UserSchema);
export default User;
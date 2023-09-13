import express from 'express';   // framework
import bodyParser from 'body-parser';   // to parse the request body
import mongoose from 'mongoose';    // access mongodb
import cors from 'cors';          // cross origin requests
import dotenv from 'dotenv';     //environment variables for safety
import multer from 'multer';     // for upload files
import helmet from 'helmet';
import morgan from 'morgan';    

//these 2 we don;t need to install, they are already in node
// helps in setting path for the images we will upload.
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from "./routes/auth.js";
import { register } from './controllers/auth.js';

/* CONFIGURATION */

// this is only when we use type 'module'
const __filename = fileURLToPath(import.meta.url);  // so we can grab the file URL
const __dirname = path.dirname(__filename);

dotenv.config();  //invoking env file

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({limit : "30mb", extended : true}));
app.use(bodyParser.urlencoded({limit:"30mb", extended:true}));
app.use(cors());

// this is to store the assests, in our case we store images locally. in real world we store
// in like cloud S3
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));



/* FILE STORAGE */

//when someone uploads a file its going to be saved in the public/assets folder 
const storage =  multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "public/assets");
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
})

//whenever we need to upload file, we will use upload variable
const upload = multer({storage});



/* ROUTES WITH FILES */

// what this will do is, we will hit the route from frontend and upload middleware
// will upload the single picture locally using storage in public/assets folder.
// register is actual logic which is a function we will keep it in separate folder(controller)
// we didn't have a separate route for this cause we need to use that upload variable.
app.post('/auth/register', upload.single("picture"), register);


/* ROUTES */
//these are the routes which don't involve uploading file
// this will attach /auth to the routes from authRoutes
app.use("/auth", authRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;    //6001 as backup

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology:true,
})
.then(()=>{
    app.listen(PORT, ()=>{
        console.log(`SERVER up and RUNNING`);
    })
})
.catch((err)=>{
    console.log("Error", err);
})


import express from 'express';


//controllers for users.
import {
    getUser,
    getUserFriends,
    addRemoveFriend
} from '../controllers/users.js';

import {verifyToken} from "../middlewares/auth.js";


const router = express.Router();



/* READ */
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);


/* UPDATE */
// we need both user and friend id who we want to remove.
router.patch("/:id/:friendID", verifyToken, addRemoveFriend);



export default router;

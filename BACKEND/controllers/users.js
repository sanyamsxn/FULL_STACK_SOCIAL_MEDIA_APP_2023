import User from "../models/User.js";


/* READ */
export const getUser = async (req, res)=>{
    try{
        const {id} = req.params;    // grabbing id from params from request.

        const user = await User.findById(id);
        res.status(200).json(user);
    }catch(err){
        res.status(500).json({message: err.message});
    }
}


export const getUserFriends = async (req, res)=>{
    try{
        const {id} = req.params;

        const user = await User.findById(id);

        // here we are making multiple calls to the DB that's 
        // why we are using promise. we are fetching the user friends
        // and then grabbing each friend as an individual.
        const friends = await Promise.all(
            user.friends.map((id)=>{
                User.findById(id);
            })
        )
        // in a better formatted way for the frontend.
        const formattedFriends = friends.map(
            ({_id, firstName, lastName, occupation, picturePath}) =>{
                return {_id, firstName, lastName, occupation, picturePath};
            }
        )
        res.status(200).json(formattedFriends);
    }catch(err){
        res.status(500).json({message: err.message});
    }
}




/* UPDATE */
export const addRemoveFriend = async(req, res)=>{
    try{
        const {id, friendId} = req.params;
        const user = await User.findById(id); 
        const friend = await User.findById(friendId);

        // what we are doing here is if that friend is in the list of friends of user  
        // then just remove that friend using the filter part.  
        if(user.friends.includes(friendId)){
            user.friends = user.friends.filter((id)=>id!== friendId);
            // removing from the friend list also.
            friend.friends = friend.friends.filter((id)=> id!==id);
        } else{
            // if they are not added then add that friend
            user.friends.push(friendId);  
            friend.friends.push(id);
        }
        //saving the updation part
        await user.save();
        await friend.save();

        // now the updated user friend list 
        const friends = await Promise.all(
            user.friends.map((id)=>{
                User.findById(id);
            })
        )
        // in a better formatted way for the frontend.
        const formattedFriends = friends.map(
            ({_id, firstName, lastName, occupation, picturePath}) =>{
                return {_id, firstName, lastName, occupation, picturePath};
            }
        )
        // sending the updated list to the frontend.
        res.status(200).json(formattedFriends);
    }catch(err){
        res.status(404).json({message : err.message});
    }
}
import jwt from 'jsonwebtoken'


export const verifyToken = async (req, res, next) =>{
    try{
        // from rquest we are grabbing header authorization and this is where
        // token will be set by the frontend
        let token = req.header("Authorization");

        if(!token){
            return res.status(403).send("Access Denied");
        }

        if(token.startsWith("Bearer ")){
            token = token.slice(7, token.length).trimLeft();
        } // trimming the token and removing  bearer and space part
        // which is of length 7.

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;

        next();
    }catch(err){
        res.status(500).json({error: err.message});
    }
}
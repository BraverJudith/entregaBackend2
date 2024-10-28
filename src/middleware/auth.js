import jwt from "jsonwebtoken";
import { config } from "../config/config.js"

export const auth = (req, res, next) => {
    
    if(!req.cookies.tokenCookie){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Unauthorized - no hay usuario logueado en el sistema`});
    }

    let token = req.cookies.tokenCookie;
    try{
        req.user = jwt.verify(token, config.SECRET);
    }catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(401).json({error:'${error.message}'})
    }
    
    next()
}
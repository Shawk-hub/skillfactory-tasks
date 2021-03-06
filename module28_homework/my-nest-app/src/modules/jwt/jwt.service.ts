import { Injectable } from "@nestjs/common";
import * as jwt  from 'jsonwebtoken'
import * as constants from './constants'

@Injectable()
export class JwtService {
    generate(payload) {
        const accessToken = jwt.sign(payload, constants.ACCESS_TOKEN_SECRET, { expiresIn: constants.ACCESS_TOKEN_LIFE });
        const refreshToken = jwt.sign(payload,constants.REFRESH_TOKEN_SECRET, {expiresIn: constants.REFRESH_TOKEN_LIFE});
        return ({accessToken, refreshToken})
    }
    verifyAccess(token) {
    
        if(!token){
            return 401;
        }
        try{
            const result = jwt.verify(token, constants.ACCESS_TOKEN_SECRET);
            return 200;
        } catch (e) {
            return 403;
        }
    }
    verifyRefresh(token) {
    
        if(!token){
            return 401;
        }
        try{
            const result = jwt.verify(token, constants.REFRESH_TOKEN_SECRET);
            return 200;
        } catch (e) {
            return 403;
        }
    }
    refresh (req, res) {
        const token = req.header('refreshToken');
        const response = module.exports.verifyRefresh(token);
        if(response==200){
            const data = jwt.verify(token, constants.REFRESH_TOKEN_SECRET);
            const payload = {
                name: data.name,
                role: data.role
            }
            const result = module.exports.generate(payload)
            res.send({result})
        }else{
            return res.sendStatus(response);
        }
    }
}
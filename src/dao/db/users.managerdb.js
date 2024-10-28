import { usersModel } from "../models/users.model.js";

export class UsersManagerDB{

    static async createUser(usuario ={}){
        let newUser=await usersModel.create(usuario)
        return newUser.toJSON()
    }

    static async getUserBy(filtro={}){
        return await usersModel.findOne(filtro).lean()
    }

}
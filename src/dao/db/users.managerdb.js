import { usersModel } from "./models/users.model.js";

export class UsersManagerDB{

    static async create(usuario){
        let newUser=await usersModel.create(usuario)
        return newUser.toJSON()
    }

    static async getBy(filtro){
        return await usersModel.findOne(filtro).lean()
    }

}
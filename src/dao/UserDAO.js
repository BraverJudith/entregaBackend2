import { usersModel } from "./models/users.model"

export class UserDao {
    static async getUserBy(filter={}){
        return await usersModel.findOne(filter).lean()
    }
    static async createUser(user={}){
        let newUser=await usersModel.create(user)
        return newUser.toJSON()
    }
    static async getAllUser(){
        return await usersModel.find().lean()
    }
    static async updateUser(id, user){
        return await usersModel.findByIdAndUpdate(id, user, {new: true})
    }
    static async deleteUser(id){
        return await usersModel.findByIdAndDelete(id);
    }
}
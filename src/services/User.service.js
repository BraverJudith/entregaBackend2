import {UserdDAO as UserdDAO} from "../dao/UserDAO.js"

class UserService{
    constructor(DAO){
        this.userDAO = DAO;
    }

    async getUsers(){
        return await this.userDAO.getAllUser()
    }
}
export const userService = new UserService(UserdDAO);
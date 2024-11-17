import { UserDAO } from "../dao/UserDAO.js";

class UserService {
    constructor(DAO) {
        this.userDAO = DAO;
    }

    async getAllUsers() {
        return await this.userDAO.getAllUser();
    }

    async getUserByEmail(email) {
        //  autenticación en login por email
        return await this.userDAO.getUserBy({ email });
    }

    async findById(id) {
        //  autenticación JWT en 'current'
        return await this.userDAO.getUserBy({ _id: id });
    }

    async createUser(userData) {
        try {
            const user = await this.userDAO.createUser(userData); 
            return user;
        } catch (error) {
            throw new Error('Error al crear el usuario');
        }
    }

    async updateUser(id, userData) {
        // actualizar la información del usuario
        return await this.userDAO.updateUser(id, userData);
    }

    async deleteUser(id) {
        // eliminar un usuario por ID
        return await this.userDAO.deleteUser(id);
    }
}

export const userService = new UserService(UserDAO);

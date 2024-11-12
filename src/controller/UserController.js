import { userService } from "../services/User.service";


export class UserController {
    static getUser = async(req,res) => {
        let user = await userService.getUsers();
    }
}
/*const result = await deleteUser("12345");
if (result) {
    console.log("Usuario eliminado:", result);
} else {
    console.log("Usuario no encontrado");
}*/
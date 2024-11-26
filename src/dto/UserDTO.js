import { CartService } from "../services/Cart.service.js";

class UserDTO {
    constructor(user, includePassword = false) {
        this.id = user._id;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.full_name = this.first_name +" "+this.last_name;
        this.email = user.email;
        this.age = user.age;
        this.role = user.role;
        if (!user.cart) {
            this.cart_id = this.createCartForUser(user._id);
        } else {
            this.cart_id = user.cart.toString();
        }

        if (includePassword) {
            this.password = user.password;
        }
    }
    async createCartForUser(userId) {
        const newCart = await CartService.createCartForUser(userId); 
        return newCart._id.toString();
    }
}

export default UserDTO;
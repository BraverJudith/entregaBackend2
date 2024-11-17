class UserDTO {
    constructor(user, includePassword = false) {
        this.id = user._id;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.full_name = this.first_name +" "+this.last_name;
        this.email = user.email;
        this.age = user.age;
        this.role = user.role;
        this.cart_id = user.cart.toString();
        if (includePassword) {
            this.password = user.password;
        }
    }
}

export default UserDTO;
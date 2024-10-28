import mongoose from 'mongoose';
import { createHash } from '../../utils.js'; 
const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: { type: String, unique: true },
    age: Number,
    password: String, 
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Carts' },
    role: { type: String, default: 'user' } 
});

// Middleware para hash de contraseña
userSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next();
    this.password = createHash(this.password, 10);
    next();
});

export const usersModel = mongoose.model('usuarios', userSchema);




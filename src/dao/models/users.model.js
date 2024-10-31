import mongoose from 'mongoose';
import { createHash } from '../../utils.js'; 

const userSchema = new mongoose.Schema({
    first_name: {
        type: String, 
        required: true
    },
    last_name: {
        type: String, 
        required: true
    }, 
    email: {
        type: String, 
        required: true,
        unique: true, 
        index: true
    }, 
    password: {
        type: String, 
        required: true
    }, 
    age: {
        type: Number, 
        required: true
    },
    role: {
        type: String, 
        enum: ["admin", "user"], 
        default: "user"
    }
});

// Middleware para hash de contraseña
userSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next();
    this.password = createHash(this.password, 10);
    next();
});

export const usersModel = mongoose.model('usuarios', userSchema);

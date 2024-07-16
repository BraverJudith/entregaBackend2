//conexion a Mongoose

import mongoose from "mongoose";

// conectamos basa de datos

mongoose.connect("mongodb+srv://bjb64:bri1abi2@cluster0.vblhkhm.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0")
    .then ( () => console.log("conexion existosa"))
    .catch((error) => console.log("error de conexion", error));
//conexion a Mongoose

import mongoose from "mongoose";
import { config } from "./config/config.js";


// conectamos base de datos

mongoose.connect(config.MONGO_URL)
    .then ( () => console.log("conexion existosa"))
    .catch((error) => console.log("error de conexion", error));
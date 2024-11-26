import express from "express";
import cookieParser from "cookie-parser";
import __dirname, { passportCall, auth }  from './utils.js';
import path from 'path';
import passport from "passport";
import connectMongo from 'connect-mongo';
import { engine } from "express-handlebars";
import { createServer } from "http";
import { Server } from "socket.io";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import userRouter from "./routes/user.router.js";
import ticketRouter from "./routes/ticket.router.js";
import sessionsRouter from './routes/sessions.router.js';
import ProductManager from "./dao/fs/productManager.js";
import ProductModel from "./dao/models/product.model.js";
import "./database.js";
import { config } from "./config/config.js";
import { initPassport } from "./config/passport.config.js";



const app = express(); 

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));
app.use(cookieParser());

// Passport
initPassport();
app.use(passport.initialize());

// Express-Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set('views', path.join(__dirname,'/views'));

// Rutas
app.use('/api/user', userRouter);
app.use('/api/sessions', sessionsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/product", productsRouter);
app.use("/api/tickets", ticketRouter)
app.use("/", viewsRouter);



// Crea el servidor HTTP usando createServer de http
const httpServer = createServer(app);

// Inicia Socket.IO y pasar el servidor HTTP
const io = new Server(httpServer);

// Instancia de ProductManager
const productManager = new ProductManager("./src/data/products.json");

// Maneja eventos de conexión
io.on("connection", async (socket) => {
    console.log("Un cliente se conectó");

    try {
        const products = await ProductModel.find({}).lean();
        const productsWithStringId = products.map(product => ({
            ...product,
            _id: product._id.toString()
        }));
        socket.emit("products", productsWithStringId);

        socket.on("eliminarProducto", async (id) => {
            await ProductModel.findByIdAndDelete(id);
            const productosActualizados = await ProductModel.find({}).lean();
            const productosActualizadosConIdString = productosActualizados.map(product => ({
                ...product,
                _id: product._id.toString()
            }));
            io.emit("products", productosActualizadosConIdString);
        });

        socket.on("agregarProducto", async (producto) => {
            const nuevoProducto = new ProductModel(producto);
            await nuevoProducto.save();
            const productosActualizados = await ProductModel.find({}).lean();
            const productosActualizadosConIdString = productosActualizados.map(product => ({
                ...product,
                _id: product._id.toString()
            }));
            io.emit("products", productosActualizadosConIdString);
        });
    } catch (error) {
        console.error("Error al obtener productos:", error);
    }
});

// Escuchar el puerto
httpServer.listen(config.PORT, () => {
    console.log(`Escuchando en el puerto: ${config.PORT}`);
    app.use("/", viewsRouter);
});

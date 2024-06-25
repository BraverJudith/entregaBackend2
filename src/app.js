import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

const PUERTO = 8080;

const app = express(); 

//Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("./src/public"));

//Express-Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Rutas
app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);
app.use("/api/views", viewsRouter)

//Escucha el puerto
const httpServer = app.listen(PUERTO, () => {

    console.log(`Escuchando en el puerto: ${PUERTO}`);

})

app.get("/", (req, res) => {

    res.send("Bienvenidos");

})



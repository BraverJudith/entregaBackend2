import express from "express";
import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();
const productsFilePath = path.resolve("./data/products.json");

const readProducts = () => {
    try {
        const data = fs.readFileSync(productsFilePath, "utf-8");
        return JSON.parse(data || "[]");
    } catch (err) {
        console.error(`Error reading products file: ${err}`);
        return [];
    }
    };

const saveProducts = (products) => {
    try {
        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    } catch (err) {
        console.error(`Error saving products file: ${err}`);
    }
    };

// Obtener todos los productos
router.get("/", (req, res) => {
    const { limit } = req.query;
    const products = readProducts();
    if (limit) {
        return res.json(products.slice(0, parseInt(limit)));
    }
    res.json(products);
    });

// Obtener producto por ID
router.get("/:pid", (req, res) => {
    let { pid } = req.params;
    let products = readProducts();
    let searchedProduct = products.find((prod) => prod.id === parseInt(pid));
    if (!searchedProduct) {
        return res.status(404).json({ error: "Product not found" });
    } else {
        res.json(searchedProduct);
    }
    });

// Agregar un nuevo producto
router.post("/", (req, res) => {
    const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: "All fields except thumbnails are required" });
    }
    const products = readProducts();
    const id = products.length > 0 ? products[products.length - 1].id + 1 : 1;
    const newProduct = {
        id: id,
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
    };
    products.push(newProduct);
    saveProducts(products);
    res.status(201).json(newProduct);
    });

// Actualizar un producto
router.put("/:pid", (req, res) => {
    const { pid } = req.params;
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    const products = readProducts();
    const index = products.findIndex((p) => p.id === parseInt(pid));

    if (index === -1) {
        return res.status(404).json({ error: "Product not found" });
    }

    const updatedProduct = { ...products[index], title, description, code, price, status, stock, category, thumbnails };
    products[index] = updatedProduct;
    saveProducts(products);
    res.json(updatedProduct);
    });

// Eliminar un producto
router.delete("/:pid", (req, res) => {
    const { pid } = req.params;
    const products = readProducts();
    const productIndex = products.findIndex((p) => p.id === parseInt(pid));
    if (productIndex === -1) {
        return res.status(404).json({ error: "Product not found" });
    }
    products.splice(productIndex, 1);
    saveProducts(products);
    res.status(204).send();
    });

export default router;

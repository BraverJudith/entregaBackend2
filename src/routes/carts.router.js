import express from "express";
import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();
const cartsFilePath = path.resolve("./data/carts.json");
const productsFilePath = path.resolve("./data/products.json");

const readCarts = () => {
    try {
        const data = fs.readFileSync(cartsFilePath, "utf-8");
        return JSON.parse(data || '[]');
    } catch (error) {
        console.error(`Error reading carts file: ${error}`);
        return [];
    }
};

const saveCarts = (carts) => {
    try {
        fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
    } catch (error) {
        console.error(`Error saving carts file: ${error}`);
    }
};

const readProducts = () => {
    try {
        const data = fs.readFileSync(productsFilePath, "utf-8");
        return JSON.parse(data || '[]');
    } catch (error) {
        console.error(`Error reading products file: ${error}`);
        return [];
    }
};

// Obtener carrito por ID
router.get("/:cid", (req, res) => {
    const carts = readCarts();
    const { cid } = req.params;
    const searchedCart = carts.find(cart => cart.id === parseInt(cid));
    if (!searchedCart) {
        return res.status(404).json({ error: 'Cart not found' });
    } else {
        res.json(searchedCart);
    }
});

// Crear nuevo carrito
router.post("/", (req, res) => {
    const carts = readCarts();
    const id = (carts.length > 0) ? (carts[carts.length - 1].id) + 1 : 1;
    const newCart = {
        id: id,
        products: [],
    }
    carts.push(newCart);
    saveCarts(carts);
    res.status(201).json(newCart);
});

// Agregar producto al carrito
router.post("/:cid/product/:pid", (req, res) => {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body; // Si no se proporciona una cantidad, se agrega 1 por defecto

    const products = readProducts();
    const carts = readCarts();

    const searchedCart = carts.find(cart => cart.id === parseInt(cid));
    if (!searchedCart) {
        return res.status(404).json({ error: "Cart not found" });
    }

    const searchedProduct = products.find(prod => prod.id === parseInt(pid));
    if (!searchedProduct) {
        return res.status(404).json({ error: "Product not found" });
    }

    const searchCartProd = searchedCart.products.find(p => p.product === pid);
    if (searchCartProd) {
        searchCartProd.quantity += quantity;
    } else {
        searchedCart.products.push({ product: pid, quantity });
    }

    saveCarts(carts);
    res.status(201).json(searchedCart);
});

export default router;

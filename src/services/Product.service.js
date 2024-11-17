import { ProductDao } from "../dao/ProductDAO.js";
import ProductRepository from "../repositories/product.repository.js";

class ProductService {
    async getProducts(filter, options) {
        try {
            const products = await ProductRepository.getProducts(filter, options);
            return products;
        } catch (error) {
            throw new Error("Error en ProductService: " + error.message);
        }
    }

    async getProductById(id) {
        try {
            return await ProductDao.getProductsBy(id);
        } catch (err) {
            console.error('Error en ProductService.getProductById:', err);
            throw new Error('Error al obtener el producto');
        }
    }

    async createProduct(productData) {
        try {
            return await ProductDao.createProduct(productData);
        } catch (err) {
            console.error('Error en ProductService.createProduct:', err);
            throw new Error('Error al crear el producto');
        }
    }

    async updateProduct(id, productData) {
        try {
            return await ProductDao.updateProduct(id, productData);
        } catch (err) {
            console.error('Error en ProductService.updateProduct:', err);
            throw new Error('Error al actualizar el producto');
        }
    }

    async deleteProduct(id) {
        try {
            return await ProductDao.deleteProduct(id);
        } catch (err) {
            console.error('Error en ProductService.deleteProduct:', err);
            throw new Error('Error al eliminar el producto');
        }
    }
}

export const productService = new ProductService();

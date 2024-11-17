import { ProductDao }  from "../dao/ProductDAO.js";
import ProductDTO from "../dto/ProductsDTO.js";
import ProductModel from "../dao/models/product.model.js";

class ProductRepository {
    async addProduct(productData) {
        const product = await ProductDao.create(productData);
        return new ProductDTO(product);
    }

    async getProducts(filter = {}, options = {}) {
        const result = await ProductDao.getProducts(filter, options);
        result.docs = result.docs.map(doc => new ProductDTO(doc));
        return result;
    }

    async getProductById(id) {
        const product = await ProductDao.getById(id);
        return product ? new ProductDTO(product) : null;
    }

    async updateProduct(id, updatedFields) {
        const product = await ProductDao.update(id, updatedFields);
        return product ? new ProductDTO(product) : null;
    }

    async deleteProduct(id) {
        const product = await ProductDao.delete(id);
        return product ? new ProductDTO(product) : null;
    }

    async getProductById(productId) {
        return await ProductModel.findById(productId);
    }

    async updateProduct(productId, updateData) {
        return await ProductModel.findByIdAndUpdate(productId, updateData, { new: true });
    }
}

export default new ProductRepository();
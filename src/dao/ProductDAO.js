import ProductModel from "./models/product.model.js";

export class ProductDao {
    //cargar todos los productos
    
        static async getProducts(filter = {}, options = {}) {
            try {
                const result = await ProductModel.paginate(filter, options);
                return result;
            } catch (error) {
                console.error("Error al obtener los productos", error);
                throw error;
            }
        }
    // cargar producto con filtro
    static async getProductsBy(filtro={}){
        return ProductModel.findOne(filtro);
    }
    // agregar producto
    static async addProduct(product={}){
        let newProduct=await ProductModel.create(product)
        return newProduct.toJSON()
    }
    // obtener producto por ID
    static async findById(id) {
        try {
            const product = await ProductModel.findById(id);
            return product;
            } catch (error) {
            console.error("Error finding product by ID:", error);
            throw error;
        }
    }
    //actualizar producto
    static async updateProduct(id, updatedData) {
        try {
            const result = await ProductModel.findByIdAndUpdate(id, updatedData, { new: true }).lean();
            return result;
            } catch (error) {
            console.error("Error updating product:", error);
            throw error;
            }
    }
    //Borrar producto
    static async deleteProduct(id) {
            try {
            const result = await ProductModel.findByIdAndDelete(id).lean();
            return result;
            } catch (error) {
            console.error("Error deleting product:", error);
            throw error;
            }
    }
    // Obtener producto con diferentes filtros
    static async findProductsWithFilters(filters = {}, options = {}) {
        try {
            const products = await ProductModel.find(filters, null, options).lean();
            return products;
            } catch (error) {
            console.error("Error finding products with filters:", error);
            throw error;
        }
    }
    //Insertar varios productos
    static async bulkInsert(productsArray) {
            try {
            const result = await ProductModel.insertMany(productsArray, { ordered: true });
            return result;
            } catch (error) {
            console.error("Error in bulk insert:", error);
            throw error;
        }
    }
}
import ProductModel from "../models/product.model.js";

class ProductManagerDB {

    async addProduct({ title, description, price, img, code, stock, category, thumbnails }) {
        try {
            if (!title || !description || !price || !code || !stock || !category) {
                console.log("Todos los campos son obligatorios");
                return;
            }

            const productExist = await ProductModel.findOne({ code: code });

            if (productExist) {
                console.log("El código debe ser único");
                return;
            }

            const newProduct = new ProductModel({
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                status: true,
                thumbnails: thumbnails || []
            });

            await newProduct.save();

        } catch (error) {
            console.log("Error al agregar producto", error);
            throw error;
        }
    }

    async getProducts(filter = {}, options = {}) {
        try {
            const { page = 1, limit = 10, sort = {} } = options;
            const arrayProductos = await ProductModel.paginate(filter, {
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
                sort: sort
            });
    
            arrayProductos.docs = arrayProductos.docs.map(doc => doc.toObject());
            return arrayProductos;
        } catch (error) {
            console.log("Error al cargar el archivo de productos", error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const searched = await ProductModel.findById(id);
            if (!searched) {
                console.log("Producto no encontrado");
                return null;
            } else {
                console.log("Producto encontrado");
                return searched;
                };
        } catch (error) {
            console.log("Error al buscar producto por ID", error);
            throw error;
        }
    }

    async updateProduct(id, productoActualizado) {
        try {
            const actualProduct = await ProductModel.findByIdAndUpdate(id, productoActualizado, { new: true });
            if (!actualProduct) {
                console.log("No se encuentra el producto a actualizar");
                return null;
            } else {
                console.log("Producto actualizado con éxito!!");
                return actualProduct;
            }
        } catch (error) {
            console.log("Error al actualizar el producto", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const deletedProduct = await ProductModel.findByIdAndDelete(id);
            if (!deletedProduct) {
                console.log("No se encuentra el producto a eliminar");
                return null;
            } else {
                console.log("Producto eliminado!");
                return borrado;
            }
        } catch (error) {
            console.log("Error al eliminar el producto", error);
            throw error;
        }
    }
}

export default ProductManagerDB;

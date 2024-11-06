import ProductModel from "./models/product.model";

export class ProductDao {
    static async getProducts(){
        return ProductModel.find().lean();
    }

    static async getProductsbyId(filtro={}){
        return ProductModel.findOne(filtro).lean();
    }

}
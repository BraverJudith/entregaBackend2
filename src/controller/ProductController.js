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
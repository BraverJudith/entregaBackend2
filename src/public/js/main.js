const socket = io();

socket.on("connect", () => {
    console.log("Conectado al servidor");
});

socket.on("welcome", (message) => {
    console.log("Mensaje de bienvenida:", message);
}); 
socket.on("products", (data) => {
    console.log("Productos recibidos:", data);
    if (Array.isArray(data)) {
        renderProducts(data); // Llama a la función para renderizar productos si data es un array
    } else {
        console.error("La data recibida no es un array:", data);
        // Manejo de errores según sea necesario
    }
});
//funcion para renderizar
const renderProducts = (data) => {
    const contenedorProductos = document.getElementById("contenedorProductos");
    contenedorProductos.innerHTML = "";

    data.forEach(item => {
        const card = document.createElement("div");
        card.innerHTML =`<p> ${item.id} </p>
                        <p> ${item.title} </p>
                        <p> ${item.price} </p>
                        <button> Eliminar </button>`
                    
        contenedorProductos.appendChild(card);
        //event for button eliminar
        card.querySelector("button").addEventListener("click", () => {
            eliminarProducto(item.id);
        })
    });
}
const eliminarProducto = (id) => {
    socket.emit("eliminarProducto",id);
}

//add product from form
document.getElementById("agregar").addEventListener("click", () => {
    agregarProducto();
});

const agregarProducto = () => {

    const titulo = document.getElementById("titulo").value;
    const descripcion = document.getElementById("descripcion").value;
    const codigo = document.getElementById("codigo").value;
    const precio = parseFloat(document.getElementById("precio").value);
    const stock = parseInt(document.getElementById("stock").value);
    const categoria = document.getElementById("categoria").value;
    const status = document.getElementById("status").value === "true";

    const nuevoProducto = {
        title: titulo,
        description: descripcion,
        code: codigo,
        price: precio,
        stock: stock,
        category: categoria,
    };

    socket.emit("agregarProducto", nuevoProducto);

    document.getElementById("formularioAgregarProducto").reset();

}
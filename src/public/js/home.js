document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    socket.on("connect", () => {
        console.log("Conectado al servidor de Socket.IO");
    });

    socket.on("products", (data) => {
        console.log("Productos recibidos:", data);
        renderProducts(data);
    });

    // Renderiza los productos en el DOM
    const renderProducts = (productos) => {
        const listaProductos = document.getElementById("listaProductos");
        listaProductos.innerHTML = "";

        productos.forEach(producto => {
            const div = document.createElement("div");
            div.innerHTML = `
                <h2>${producto.title}</h2>
                <p>${producto._id}</p>
                <p>${producto.description}</p>
                <p>Precio: $${producto.price}</p>
                <p>Categoría: ${producto.category}</p>
                <a  href="/api/products/${producto._id}">Ver producto</a>
                <form action="/api/carts/add" method="POST">
                    <button type="submit">Agregar al carrito</button>
                </form>
            `;
            listaProductos.appendChild(div);
        });
    };

    const btnAgregarProducto = document.getElementById("agregar");
    if (btnAgregarProducto) {
        btnAgregarProducto.addEventListener("click", () => {
            agregarProducto();
        });
    } else {
        console.error("Botón agregar no encontrado en el DOM");
    }

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
    };
});

// Conectar con el servidor de Socket.IO
const socket = io();

// Manejar la recepción de datos de productos desde el servidor a través de Socket.IO
socket.on("connect", () => {
    console.log("Conectado al servidor de Socket.IO");
});

socket.on("products", (data) => {
    console.log("Productos recibidos:", data);
    renderProducts(data);
});

// Función para renderizar productos
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
            <button onclick="addToCart('${producto._id}')">Agregar al carrito</button>
        `;
        listaProductos.appendChild(div);
    });
};


// Función para agregar producto al carrito
function addToCart(productId) {
    fetch('/api/carts/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Producto agregado al carrito');
        } else {
            alert('Error al agregar producto al carrito');
        }
    })
    .catch(error => {
        console.error('Error al agregar producto al carrito:', error);
        alert('Error al agregar producto al carrito');
    });
};


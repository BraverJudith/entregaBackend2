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
                <a href="/api/product/${producto._id}">Ver producto</a>
                <form action="/api/carts/add/${producto._id}" method="POST">
                    <button type="submit">Agregar al carrito</button>
                </form>`;
            listaProductos.appendChild(div);
        });
        const addToCartButtons = document.querySelectorAll(".add-to-cart");
        addToCartButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            const productId = button.getAttribute("data-id");
            addProductToCart(productId);
        });
    });
};


    function addProductToCart(productId, quantity = 1) {
        fetch(`/cart/addProduct/${productId}`, {
            method: 'POST',
            body: JSON.stringify({ quantity }),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = data.cartUrl;
            } else {
                alert(`Error: ${data.error}`);
            }
        })
        .catch(error => {
            console.error('Error al agregar producto al carrito:', error);
            alert('Ocurrió un error inesperado');
        });
    }
    
    const inputEmail = document.getElementById("email");
    const inputPass = document.getElementById("password");
    const btnSubmit = document.getElementById("btnSubmit");
    const loginForm = document.getElementById("loginForm"); 

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Deshabilitar el botón para evitar doble clic
        btnSubmit.disabled = true;

        let email = inputEmail.value;
        let password = inputPass.value;
        if (!email || !password) {
            alert("Complete datos...!!!");
            btnSubmit.disabled = false; // Rehabilitar el botón
            return;
        }

        const body = { email, password };
        let respuesta = await fetch("/api/sessions/login", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (respuesta.status >= 400) {
            let { error } = await respuesta.json();
            alert(error);
            btnSubmit.disabled = false; // Rehabilitar el botón
            return;
        } else {
            let datos = await respuesta.json();
            console.log(datos);
            alert(datos.message);
        }
    });
});

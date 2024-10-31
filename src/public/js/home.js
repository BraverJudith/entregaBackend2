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
                <a href="/api/products/${producto._id}">Ver producto</a>
                <form action="/api/carts/add/${producto._id}" method="POST">
                    <button type="submit">Agregar al carrito</button>
                </form>
            `;
            listaProductos.appendChild(div);
        });
    };

    const inputEmail = document.getElementById("email");
    const inputPass = document.getElementById("password");
    const btnSubmit = document.getElementById("btnSubmit");
    const loginForm = document.getElementById("loginForm"); // Asegúrate de que el formulario tenga este ID

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

    /*const btnAgregarProducto = document.getElementById("agregar");
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
    };*/

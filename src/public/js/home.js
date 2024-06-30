const socket = io();

socket.on("connect", () => {
    console.log("Conectado al servidor");
});
socket.on("products", (data) => {
    console.log("Productos recibidos:", data);
    renderProducts(data);
});

const renderProducts = (data) => {
    const listaProductos = document.getElementById("listaProductos");
    listaProductos.innerHTML = "";

    data.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.title} - ${item.price}`;
        listaProductos.appendChild(li);
    });
};

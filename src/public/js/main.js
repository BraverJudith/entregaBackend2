const socket = io();

console.log ("funciona");

socket.on("products", (data) => {
    renderProducts(data);
})
//funcion para renderizar
const renderProducts = (data) => {
    const contenedorProductos = document.getElementById("contenedorProductos");

    data.forEach(element => {
        const card = document.createElement("div");
        //card.classList
        card.innerHTML =`<p> ${item.id} </p>
                        <p> ${item.title} </p>
                        <p> ${item.price} </p>
                        <button> Eliminar </button>`
                    
        contenedorProductos.appendChild(card);
    });
}
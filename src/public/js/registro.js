const inputNombre = document.getElementById("first_name");
const inputApellido = document.getElementById("last_Name");
const inputaAge = document.getElementById("age");
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");
const btnSubmit = document.getElementById("registro");

btnSubmit.addEventListener("click", async (e) => {
    e.preventDefault();
    let first_name = inputNombre.value.trim();
    let last_name = inputApellido.value.trim();
    let age = inputaAge.value.trim();
    let email = inputEmail.value.trim();
    let password = inputPassword.value.trim();

    if (!first_name || !last_name || !age || !email || !password) {
        alert("Por favor, complete todos los datos");
        return;
    }

    let body = JSON.stringify({
        first_name, 
        last_name,
        age,
        email, 
        password
    });

    let respuesta = await fetch("/api/sessions/registro", {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body
    });
    if (!respuesta.ok) {
        const errorMessage = await respuesta.text(); 
        throw new Error(errorMessage); 
    }

    let datos = await respuesta.json();
    if (respuesta.status === 201) {
        location.href = `/home?mensaje=Registro correcto para ${email}...!!!`;
    } else {
        alert(datos.error);
    }
});

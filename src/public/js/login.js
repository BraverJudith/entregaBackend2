const emailLog= document.getElementById("email")
const passLog= document.getElementById("password")
const btn=document.getElementById("entrar")
const div= document.getElementById("mensaje")

let params= new URLSearchParams(location.search)
let mensaje= params.get("mensaje")
if(mensaje){
    div.textContent=mensaje
    setTimeout(()=>{
        div.textContent=""
    },3000)
}

btn.addEventListener("click", async (e)=>{
    e.preventDefault();
    let email=emailLog.value.trim()
    let password=passLog.value.trim()

    if(!email || !password){
        alert ("por favor ingresa los datos")
        return
    }

    let body=JSON.stringify({
        email, 
        password
    })
   
    let respuesta=await fetch("/api/sessions/login", {
        method:"post",
        headers:{
            "Content-Type":"application/json"
        },
        body,
        credentials: 'include'
    })

    let datos= await respuesta.json()
   if(respuesta.status===200){
        location.href=`/products`
    }else{
        alert(datos.error)
    }
})
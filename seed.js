import "./database.js";

let argumentos=process.argv
console.log(argumentos)
if(!argumentos[2]){
    console.log(`Ingrese clave`)
    process.exit() 
}
if(argumentos[2]!="CoderCoder123"){
    console.log(`Clave incorrecta`)
    process.exit() 
}


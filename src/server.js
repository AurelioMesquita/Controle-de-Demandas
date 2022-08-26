const express = require("express");
const server = express();
const routes = require("./routes")

server.set('view engine', 'ejs')

//Habilitar arquivos estaticos
server.use(express.static("public"))

//Usar req.body 
server.use(express.urlencoded({extended:true}))
/*Liberando o corpo da requisição*/
//routes 
server.use(routes);

server.listen(3000, ()=> console.log('ok'))
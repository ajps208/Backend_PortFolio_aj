require('dotenv').config()
const express=require('express')
const cors=require('cors')
const router=require('./Routes/router')
require('./DB/connection')

const Server=express()

Server.use(cors());
Server.use(express.json())
Server.use(router)
const PORT = process.env.PORT || 4000;
Server.listen(PORT,()=>{console.log(`server started at ${PORT}  and waiting for client request !!!!` );})
  
Server.get('/',(req,res)=>{
    res.send(`<h1>SERVER STARTED</h1>`)
})
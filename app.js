import express from "express";


const app= express();
const port = 3000;

app.use("/",(req,res,next)=> {
    res.send("Hello Wordd");
})

app.listen(port,()=> {
    console.log("Server is running")
})
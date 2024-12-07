import express from "express"


const app = express()


app.get("/", (req,res)=>{
    res.send("olaaaa")
})


app.listen(5000,()=>{
    console.log("servidor rodando!!!")
})
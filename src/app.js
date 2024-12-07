import express from "express"
import dotenv from "dotenv"
import { MongoClient } from "mongodb"


dotenv.config()

const app = express()
const client = new MongoClient(process.env.MONGODB_URL)

let db;


async function conexaoDB() {
    try{
        await client.connect()
        db = client.db()
        console.log("Conexão com o DB feita com sucesso!!")
    } catch (error) {
        console.log("Erro ao conectar com o MongoDB", error)
        process.exit(1)
    }
} 

conexaoDB()





const PORT = process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log("servidor rodando!!!")
})
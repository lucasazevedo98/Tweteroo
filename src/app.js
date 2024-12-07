import express,{json} from "express"
import dotenv from "dotenv"
import { MongoClient } from "mongodb"
import Joi from "joi"

dotenv.config()

const app = express()
app.use(json())


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



app.post("/sign-up", async (req,res)=>{

    const {username,avatar} = req.body

    const validacao = Joi.object({
        username: Joi.string().required(),
        avatar: Joi.string().uri().required(),
    })

    const {error} = validacao.validate({username,avatar}, { abortEarly: false })

    if(error) {
        return res.status(422).send(error.details.map(e => e.message))
    }

    const usuarioExiste = await db.collection("users").findOne({username})

    if(usuarioExiste) {
        return res.status(409).send("Usuario ja cadastrado")
    }


   try {
    const usuario = {username,avatar}
    await db.collection("users").insertOne(usuario);
    res.status(201).send("Usuario criado com sucesso!")
   } catch (err) {
    res.status(500).send("erro com o banco de dados")
   }

})


app.post("/tweets", async(req,res)=>{
    const {username,tweet} = req.body

    const validacao = Joi.object({
        username: Joi.string().required(),
        tweet:Joi.string().required()
    })

    const {error} = validacao.validate({username,tweet}, {abortEarly:false})

    if(error) {
        return res.status(422).send(error.details.map(e => e.message))
    }

    const usuarioExiste = await db.collection("users").findOne({username})

    if (!usuarioExiste) {
        return res.status(401).send("Usuario não existe")
    } 

    try {
        const mensagem = {username,tweet}

        await db.collection("tweets").insertOne(mensagem)
        res.status(201).send("tweet criado com sucesso!!!")

    } catch (err) {
        res.status(500).send("erro com o banco de dados")
    }

    res.send()
})







const PORT = process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log("servidor rodando!!!")
})
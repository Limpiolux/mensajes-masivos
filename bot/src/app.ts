import "dotenv/config"
import express from "express"
import cors from "cors"
import routes from "./infrastructure/router"
const port = process.env.PORT || 7132
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('tmp'))
app.use(`/`,routes)

app.listen(port, () => console.log(`Ready...${port}`))
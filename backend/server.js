import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import checkoutRoutes from './routes/checkout.js'
import productsRoutes from './routes/products.js'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()
// Configurar __dirname en ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 4242

// Middleware
app.use(cors())
app.use(express.json())

// Servir archivos estáticos
app.use('/assets', express.static(path.join(__dirname, '../assets')))
app.use('/images', express.static(path.join(__dirname, '../images')))
app.use(express.static(path.join(__dirname, '../')))

// Rutas
app.use('/api/checkout', checkoutRoutes)
app.use('/api/products', productsRoutes)

// Servir páginas estáticas de assets/pages
app.get('/pages/:category/:file', (req, res) => {
  const { category, file } = req.params
  res.sendFile(path.join(__dirname, `../assets/pages/${category}/${file}`))
})

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../Index.html'))
})

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`)
})

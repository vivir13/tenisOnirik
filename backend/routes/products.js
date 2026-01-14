import express from 'express'

const router = express.Router()

// Simulación de base de datos
const products = [
  {
    id: 1,
    name: 'Tenis deportivos caballero',
    description: 'Tenis cómodos para correr y uso diario.',
    price: 1200,
    image: '/images/disenotenis/caballero/Factor-navy-topaz.png',
    sizes: ['25', '26', '27', '28'],
    colors: ['AzulAgua'],
  },
  {
    id: 2,
    name: 'Tenis deportivos caballero',
    description: 'Tenis cómodos para correr y uso diario.',
    price: 1500,
    image: '/images/disenotenis/caballero/Factor-navy.png',
    sizes: ['26', '27', '28'],
    colors: ['Negro'],
  },
  {
    id: 3,
    name: 'Tenis deportivos caballero',
    description: 'Tenis cómodos de pielpara el uso diario.',
    price: 1500,
    image: '/images/disenotenis/caballero/instagate.png',
    sizes: ['26', '27', '28'],
    colors: ['Negro'],
  },
  {
    id: 4,
    name: 'Tenis dama casual',
    description: 'Diseño moderno para uso casual.',
    price: 2000,
    image: '/images/disenotenis/dama/catori.png',
    sizes: ['23', '24', '25'],
    colors: ['Negro', 'Blanco'],
  },
  {
    id: 5,
    name: 'Tenis dama casual',
    description: 'Diseño moderno para uso casual.',
    price: 1950,
    image: '/images/disenotenis/dama/Malli.png',
    sizes: ['23', '24', '25', '27', '28'],
    colors: ['Negro', 'Blanco'],
  },
]

// Obtener todos los productos
router.get('/', (req, res) => {
  res.json(products)
})

// Obtener un solo producto por ID
router.get('/:id', (req, res) => {
  const product = products.find((p) => p.id === req.params.id)
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' })
  res.json(product)
})

export default router

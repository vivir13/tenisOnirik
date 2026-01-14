import express from 'express'
import stripe from '../config/stripe.js'

const router = express.Router()

router.post('/create-checkout-session', async (req, res) => {
  try {
    const { items } = req.body
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No se recibieron productos' })
    }

    const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:4242'

    const line_items = items.map((item) => {
      // Construye la URL de la imagen correctamente
      let imageUrl = ''
      if (item.image) {
        // Elimina cualquier '/' inicial para evitar dobles barras
        const cleanImagePath = item.image.replace(/^\//, '')
        imageUrl = `${CLIENT_URL}/imagenes/${cleanImagePath}`
      }

      return {
        price_data: {
          currency: 'mxn',
          product_data: {
            name: item.name || 'Producto sin nombre',
            description: `Talla: ${item.size || 'N/A'}`,
            images: imageUrl ? [imageUrl] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: Math.max(item.quantity, 1),
      }
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${CLIENT_URL}/assets/pages/carrito/success.html`,
      cancel_url: `${CLIENT_URL}/assets/pages/carrito/cancel.html`,
    })

    res.json({ url: session.url })
  } catch (error) {
    console.error('Error al crear sesión de Stripe:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router

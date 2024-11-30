import { Hono } from 'hono'

const app = new Hono().basePath('/api')

app.get("/random-number", async (c) => {
  // Random integer between 1 and 100
  const number = Math.floor(Math.random() * 100) + 1
  return c.json({ number })
})

export default app

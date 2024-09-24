import { Hono } from 'hono'
import { sign } from 'hono/jwt'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {signinInput,signupInput} from '@aravind422/medium-common'

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string
    JWT_SECRET: string
  }
}>()

userRouter.post('/api/v1/user/signup', async (c) => {
  const body = await c.req.json()
   const { success } = signupInput.safeParse(body)
   if (!success) {
     c.status(411)
     return c.text('Inputs not correct')
   }
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())


  try {
   
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: body.password,
      },
    })
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET)
    return c.json({ jwt })
  } catch (e) {
    c.status(411)
    return c.text('Invalid')
  }
})

userRouter.post('/api/v1/user/signin', async (c) => {
  const body = await c.req.json()
   const { success } = signinInput.safeParse(body)
   if (!success) {
     c.status(411)
     return c.text('Inputs not correct')
   }
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
        password: body.password,
      },
    })
    if (!user) {
      c.status(403)
      return c.json({
        message: 'Incorrect Data',
      })
    }
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET)
    return c.json({ jwt })
  } catch (e) {}

  return c.text('Invalid')
})

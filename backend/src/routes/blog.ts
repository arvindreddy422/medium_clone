import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt'
import { createPostInput, updatePostInput } from '@aravind422/medium-common'

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string
    JWT_SECRET: string
  }
  Variables: {
    //@ts-ignore
    userId: user.id
  }
}>()

blogRouter.use('/*', async (c, next) => {
  const token = c.req.header('authorization') || ''
  try {
    const user = await verify(token, c.env.JWT_SECRET)
    if (user) {
      c.set('userId', user.id)
      await next()
    }
    c.status(403)
    return c.json({
      message: 'You are not login',
    })
  } catch (error) {
    c.status(403)
    return c.json({
      message: 'You are not login',
    })
  }
})

blogRouter.post('/', async (c) => {
  const body = await c.req.json()
  const { success } = createPostInput.safeParse(body)
  if (!success) {
    c.status(411)
    return c.text('Inputs not correct')
  }
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  const userId = c.get('userId')
  try {
    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId,
      },
    })
    return c.text(post.id)
  } catch (e) {
    c.status(411)
    return c.text('Error while adding a post')
  }
})

blogRouter.put('/', async (c) => {
  const body = await c.req.json()
  const { success } = updatePostInput.safeParse(body)
  if (!success) {
    c.status(411)
    return c.text('Inputs not correct')
  }
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  try {
    await prisma.post.update({
      where: { id: body.id },
      data: {
        title: body.title,
        content: body.content,
      },
    })
    return c.text(body.id)
  } catch (e) {
    c.status(411)
    return c.text('Invalid')
  }
})

blogRouter.get('/bulk', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  const id = await c.get('userId')

  try {
    const posts = await prisma.post.findMany()
    return c.json({ posts })
  } catch (e) {
    c.status(411)
    return c.text('Error while fetching blogs')
  }
})

blogRouter.get('/:id', async (c) => {
  const id = c.req.param('id')
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  try {
    const post = await prisma.post.findFirst({
      where: { id },
    })

    return c.json({ post })
  } catch (e) {
    c.status(411)
    return c.text('Error while fetching post')
  }
})

import { M1_LOCAL_PORT } from './config'
import Logger from './logger/logger'
import morganMiddleware from './logger/middleware-logger'
import * as rabbit from './rabbitmq/client'
import express from 'express'

const port = M1_LOCAL_PORT
const app = express()

app.use(morganMiddleware)
app.use(express.json())

app.post('/request', async (req, res) => {
  const response = await rabbit.client.produce(req.body)
    .catch((err) => {
      Logger.error('error:', err)
    })

  Logger.info(`succesfully handled request`)
  res.send({ response })
})

app.listen(port, async () => {
  Logger.info(`M1 service is running and listening on port ${M1_LOCAL_PORT}`)
  await rabbit.client.initialize()
})

import compression from 'compression'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { pinoHttp } from 'pino-http'

import { errorHandler } from './lib/error-handler.js'
import { routes } from './routes/index.js'

export function createApp() {
  const app = express()

  app.use(helmet())
  app.use(cors())
  app.use(compression())
  app.use(express.json())
  app.use(pinoHttp())

  app.use('/api', routes)
  app.use(errorHandler)

  return app
}

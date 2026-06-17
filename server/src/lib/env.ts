const DEFAULT_PORT = 4000

function readPort(value: string | undefined) {
  if (!value) {
    return DEFAULT_PORT
  }

  const port = Number(value)

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error('PORT must be a positive integer')
  }

  return port
}

export const env = {
  PORT: readPort(process.env.PORT),
}

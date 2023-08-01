export const rabbitConfig = {
  url: process.env.RABBIT_CONNECTION_LINK || 'amqp://localhost:5672',
  queueName: process.env.QUEUE_NAME || 'rpc_queue',
}

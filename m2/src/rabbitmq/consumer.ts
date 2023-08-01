import { Channel, ConsumeMessage } from 'amqplib'
import { MessageHandler } from '../messageHandler'
import Logger from '../logger/logger'

export class Consumer {
  private channel: Channel
  private rpcQueue: string

  constructor(channel: Channel, rpcQueue: string) {
    this.channel = channel
    this.rpcQueue = rpcQueue
  }

  async consumeMessages () {
    this.channel.consume(this.rpcQueue, async (message: ConsumeMessage) => {
      const { correlationId, replyTo } = message.properties
    
      if (!correlationId || !replyTo) {
        Logger.error('message misses properties')
      } else {
        await MessageHandler.handle(JSON.parse(message.content.toString()), correlationId, replyTo)
          .catch((err) => {
            Logger.error('error:', err)
          })
      }
    },
    {
      noAck: true
    })
  }
}

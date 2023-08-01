import { Channel } from 'amqplib'

export class Producer {
  private channel: Channel

  constructor (channel: Channel) {
    this.channel = channel
  }

  async produceMessage (data: any, correlationId: string, replyToQueue: string) {
    this.channel.sendToQueue(replyToQueue, Buffer.from(JSON.stringify(data)), 
    { correlationId })
  }
}
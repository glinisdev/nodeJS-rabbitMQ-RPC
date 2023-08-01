import { Channel } from 'amqplib'
import { rabbitConfig } from '../config'
import { randomUUID } from 'crypto'
import EventEmitter from 'events'
import Logger from '../logger/logger'

export class Producer {
  private channel: Channel
  private replyQueueName: string
  private eventEmitter: EventEmitter

  constructor (channel: Channel, replyQueueName: string, eventEmitter: EventEmitter) {
    this.channel = channel
    this.replyQueueName = replyQueueName
    this.eventEmitter = eventEmitter
  }

  async produceMessage (data: any) {
    const uuid = randomUUID()

    this.channel.sendToQueue(rabbitConfig.queueName, Buffer.from(JSON.stringify(data)), 
    { replyTo: this.replyQueueName, correlationId: uuid })

    return new Promise((resolve, reject) => {
      this.eventEmitter.once(uuid, async (data) => {
        try {
          const reply = JSON.parse(data.content.toString())
          resolve(reply)
        } catch (err) {
          Logger.error('error:', err)
          reject(err)
        }
      })
    })
  }
}
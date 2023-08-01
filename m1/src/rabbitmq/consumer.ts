import { Channel, ConsumeMessage } from 'amqplib'
import EventEmitter from 'events'
import Logger from '../logger/logger'

export class Consumer {
  private channel: Channel
  private replyQueueName: string
  private eventEmitter: EventEmitter

  constructor(channel: Channel, replyQueueName: string, eventEmitter: EventEmitter) {
    this.channel = channel
    this.replyQueueName = replyQueueName
    this.eventEmitter = eventEmitter
  }

  async consumeMessages () {
    this.channel.consume(this.replyQueueName, (message: ConsumeMessage) => {
      this.eventEmitter.emit(message.properties.correlationId.toString(), message)
    },
    {
      noAck: true
    })
  }
}

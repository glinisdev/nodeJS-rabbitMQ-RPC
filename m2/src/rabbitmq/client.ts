import { Connection, Channel, connect } from 'amqplib'
import { rabbitConfig } from '../config'
import { Consumer } from './consumer'
import { Producer } from './producer'
import Logger from '../logger/logger'

class RabbitMQClient {
  private constructor() {}
  private static instance: RabbitMQClient
  private isInitialized = false

  private producer: Producer
  private consumer: Consumer
  private connection: Connection
  private producerChannel: Channel
  private consumerChannel: Channel

  public static getInstance () {
    if (!this.instance) {
      this.instance = new RabbitMQClient()
    }

    return this.instance
  }

  async initialize() {
    if (this.isInitialized) {
      return
    }

    try {
      this.connection = await connect(rabbitConfig.url)
      this.producerChannel = await this.connection.createChannel()
      this.consumerChannel = await this.connection.createChannel()

      const { queue: rpcQueue } = await this.consumerChannel.assertQueue(rabbitConfig.queueName, { exclusive: true })

      this.producer = new Producer (this.producerChannel)
      this.consumer = new Consumer (this.consumerChannel, rpcQueue)

      await this.consumer.consumeMessages()
      this.isInitialized = true

      Logger.info(`M2 service is initialized`)
    } catch (error) {
      Logger.error('rabbitmq error...', error)
    }
  }

  async produce (data: any, correlationId: string, replyToQueue: string) {
    if (!this.isInitialized) {
      await this.initialize()
    }
    return this.producer.produceMessage(data, correlationId, replyToQueue)
  }
}

export const client = RabbitMQClient.getInstance()
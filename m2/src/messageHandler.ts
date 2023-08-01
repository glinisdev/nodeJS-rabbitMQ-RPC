import * as rabbit from './rabbitmq/client'

export class MessageHandler {
  static async handle (data: any, correlationId: string, replyToQueue: string) {
    const handledData = {...data, handled: true }

    return rabbit.client.produce(handledData, correlationId, replyToQueue)
  }
}

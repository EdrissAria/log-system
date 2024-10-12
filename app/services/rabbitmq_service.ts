import { connect } from 'amqplib'
import ElasticService from './elastic_service.js'

class RabbitMqService {
  public async connect() {
    try {
      const queue = 'logs'
      const connection = await connect('amqp://localhost:5672')
      const channel = await connection.createChannel()
      await channel.assertQueue(queue, { durable: true })

      channel.consume(queue, async (msg) => {
        if (msg !== null) {
          const messageContent = msg.content.toString()
          const { redelivered } = msg.fields

          const logMessage = JSON.parse(messageContent);

          if (redelivered) {
            console.log('This message is being redelivered:', messageContent)
          } else {
            console.log('Received new message:', messageContent)
          }
          
          await this.saveLogToElastic(logMessage);
          channel.ack(msg)
        }
      })

      console.log(`waiting for message...`)
    } catch (ex) {
      console.log(ex.message)
    }
  }

  private async saveLogToElastic(logMessage: any) {
    try {
      const logEntry = {
        context: logMessage.context || {},
        duration: logMessage.duration || null,
        environment: logMessage.environment || 'unknown',
        file_name: logMessage.file_name || 'unknown',
        line_number: logMessage.line_number || null,
        log_id: logMessage.log_id || 'unknown',
        log_level: logMessage.log_level || 'info',
        log_type: logMessage.log_type || 'application',
        message: logMessage.message || 'No message',
        project_id: logMessage.project_id || 'unknown',
        service_name: logMessage.service_name || 'unknown',
        status_code: logMessage.status_code || null,
        timestamp: logMessage.timestamp || new Date().toISOString(),
      };

      const response = await new ElasticService().client.index({
        index: 'logs',
        body: logEntry,
      });

      console.log('Log saved to Elasticsearch:', response);
    } catch (err) {
      console.error('Failed to save log to Elasticsearch:', err);
    }
  }
}

export default new RabbitMqService()

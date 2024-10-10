import { connect, Channel, Connection } from 'amqplib';

class RabbitMqService {
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private readonly queue = 'logs'; // Set the queue name for logging

  // Method to connect to RabbitMQ
  public async connect() {
    try {
      if (!this.connection) {
        this.connection = await connect('amqp://localhost:5672');
      }

      if (!this.channel) {
        this.channel = await this.connection.createChannel();
        await this.channel.assertQueue(this.queue, { durable: true });
      }

      console.log('RabbitMQ connected and queue asserted');
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
    }
  }

  // Method to publish messages (logs) to the queue
  public async publishLog(message: string) {
    if (this.channel) {
      await this.channel.sendToQueue(this.queue, Buffer.from(message), {
        persistent: true,
      });
      console.log(`Log sent: ${message}`);
    } else {
      console.error('RabbitMQ channel is not available');
    }
  }

  // Method to consume messages from the queue
  public async consumeLogs() {
    if (this.channel) {
      await this.channel.consume(this.queue, (msg) => {
        if (msg) {
          const content = msg.content.toString();
          console.log(`Log received: ${content}`);
          this.channel?.ack(msg); // Acknowledge the message
        }
      });
    } else {
      console.error('RabbitMQ channel is not available for consuming logs');
    }
  }
}

export default new RabbitMqService(); // Exporting as singleton service

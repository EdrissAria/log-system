import ElasticService from '#services/elastic_service'
import type { ApplicationService } from '@adonisjs/core/types'
import env from '#start/env'

export default class ElasticProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {
    this.app.container.bind(ElasticService, () => {
      return new ElasticService()
    })
  }

  /**
   * The container bindings have booted
   */
  async boot() {
    if (env.get('NODE_ENV') == 'development') {
      try {
        await new ElasticService().client.indices.create({
          index: 'logs',
          settings: {
            index: {
              max_result_window: 10000000,
              mapping: {
                nested_objects: {
                  limit: 50000,
                },
              },
            },
          },
          mappings: {
            properties: {
              log_id: {
                type: 'keyword',
              },
              project_id: {
                type: 'keyword',
              },
              timestamp: {
                type: 'date',
                format: 'strict_date_optional_time||epoch_millis',
              },
              log_level: {
                type: 'keyword',
              },
              message: {
                type: 'text',
              },
              context: {
                type: 'object',
              },
              log_type: {
                type: 'keyword',
              },
              environment: {
                type: 'keyword',
              },
              file_name: {
                type: 'keyword',
              },
              line_number: {
                type: 'integer',
              },
              service_name: {
                type: 'keyword',
              },
              duration: {
                type: 'integer',
              },
              status_code: {
                type: 'integer',
              },
            },
          },
        })
        console.log('onniforums index created successfully')
      } catch (error) {
        console.log(error)
      }
    }
  }

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}

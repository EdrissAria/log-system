import ElasticService from '#services/elastic_service'
import type { ApplicationService } from '@adonisjs/core/types'
import env from '#start/env'

export default class ElasticProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {
    this.app.container.bind(ElasticService, ()=>{
      return new ElasticService()
    })
  }

  /**
   * The container bindings have booted
   */
  async boot() {
    if (env.get('NODE_ENV') == 'development'){
    try {
      await new ElasticService().client.indices.create({
        index: 'onniforums.com',
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
            id: { type: 'integer' },
            mysql_id: { type: 'integer' },               
            postId: { type: 'integer' },           
            threadId: { type: 'integer' },          
            author: { type: 'text' },           
            title: { type: 'text' },                
            content: { type: 'text' },              
            date: { type: 'text' },
            created_at: { type: 'date' },           
            updated_at: { type: 'date' },           
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

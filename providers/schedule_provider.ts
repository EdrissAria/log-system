import type { ApplicationService } from '@adonisjs/core/types'
import schedule from 'node-schedule'
import ElasticService from '#services/elastic_service' 
import env from '#start/env'
import Project from '#models/project'

export default class ScheduleProvider {
  constructor(protected app: ApplicationService ) {}

  register() {}

  async boot() {}

  async start() {
    if (env.get('START_CRON') === '1') {
      schedule.scheduleJob('*/2 * * * * *', async () => {
        const projects = await Project.query()
          .select('id', 'log_retention_period')

        const currentDate = new Date()

        for (const project of projects) {
          console.log("project_id: ", project.id)
          const retentionDate = new Date()
          retentionDate.setDate(currentDate.getDate() - project.logRetentionPeriod)

          const query = {
            index: 'logs',
            body: {
              query: {
                bool: {
                  must: [
                    { term: { project_id: project.id } },
                    {
                      range: {
                        timestamp: {
                          lt: retentionDate.toISOString()
                        }
                      }
                    }
                  ]
                }
              }
            }
          }

          console.log(query)
          await new ElasticService().client.deleteByQuery(query)
        }
      })
    }
  }

  async ready() {}

  async shutdown() {}
}

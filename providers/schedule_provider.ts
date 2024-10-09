import type { ApplicationService } from '@adonisjs/core/types'
import schedule from 'node-schedule'
import env from '#start/env'

export default class ScheduleProvider {
  constructor(protected app: ApplicationService) {}

  register() {}

  async boot() {
    
  }

  async start() {
    if (env.get('START_CRON') === '1') {
      
      schedule.scheduleJob('* * * * *', async function () {
        
      })
    }
  }

  async ready() {}

  async shutdown() {}
}

import factory from '@adonisjs/lucid/factories'
import Project from '#models/project'
import { LogLevel } from '../../contracts/loglevel.js'

export const ProjectFactory = factory
  .define(Project, async ({ faker }) => {
    return {
      name: faker.string.alpha(5),
      logRetentionPeriod: faker.number.int(3), 
      maxLogSize: faker.number.int(3),
      contactEmail: faker.internet.email(),
      logLevel: faker.helpers.arrayElement(LogLevel)
    }
  })
  .build()
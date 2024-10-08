import vine from '@vinejs/vine'
import { uniqueRule } from './rules/unique.js'
import { LogLevel } from '../../contracts/loglevel.js'
import { Status } from '../../contracts/status.js'

export const StoreValidator = vine.compile(
    vine.object({       
        name: vine.string().trim().use(
            uniqueRule({ table: 'projects', column: 'name' })
          ),
        logRetentionPeriod: vine.number(), 
        maxLogSize: vine.number(),
        contactEmail: vine.string().email(),
        logLevel: vine.enum(LogLevel)
    })
  )

  export const UpdateValidator = vine.compile(
    vine.object({
        name: vine.string().trim().use(
            uniqueRule({ table: 'projects', column: 'name' })
          ).optional(),
        logRetentionPeriod: vine.number().optional(), 
        maxLogSize: vine.number().optional(),
        contactEmail: vine.string().email().optional(),
        logLevel: vine.enum(LogLevel).optional()
    })
  )

  export const StatusValidator = vine.compile(
    vine.object({
        status: vine.enum(Status)
    })
  )
import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { Status } from '../../contracts/status.js';
import { LogLevel } from '../../contracts/loglevel.js';

export default class Project extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string;

  @column()
  declare status: Status

  @column()
  declare logRetentionPeriod: number;

  @column()
  declare maxLogSize: number;

  @column()
  declare contactEmail: string;

  @column()
  declare logLevel: LogLevel

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
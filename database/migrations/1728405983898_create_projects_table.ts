import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'projects'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name')
      table.enum('status', ['active', 'inactive']).defaultTo('active')
      table.integer('log_retention_period').unsigned().defaultTo(30)
      table.integer('max_log_size').unsigned()
      table.string('contact_email')
      table.enum('log_level',['info', 'warning', 'error', 'debug']).defaultTo('info')
      table.timestamps(true,true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
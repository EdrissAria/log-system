import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('fullname').notNullable()
      table.text('avatar_path').nullable()
      table.string('username').notNullable().unique()
      table.string('email').notNullable().unique()
      table.string('password').notNullable()
      table.string('remember_me_token').nullable()
      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
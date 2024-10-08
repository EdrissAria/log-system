import { defineConfig } from '@adonisjs/lucid'
import env from '#start/env'

const dbConfig = defineConfig({
  connection: 'mysql', 
  connections: {
    mysql: {
      client: 'mysql',
      connection: {
        host: env.get('DB_HOST'),
        port: env.get('DB_PORT'),
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig
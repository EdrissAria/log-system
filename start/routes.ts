import { fsImportAll } from '@adonisjs/core/helpers'

await fsImportAll(new URL('../app/routes', import.meta.url))

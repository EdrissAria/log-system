import factory from '@adonisjs/lucid/factories'
import User from '#models/user'
import { CategoryFactory } from './category_factory.js'
import { TodoFactory } from './todo_factory.js'
import { NoteFactory } from './note_factory.js'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      fullname: faker.lorem.word(10),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }
  })
  .relation('categories', () => CategoryFactory)
  .relation('todos', () => TodoFactory)
  .relation('notes', () => NoteFactory)
  .build()
import vine from '@vinejs/vine'
import { uniqueRule } from './rules/unique.js'
import { existRule } from './rules/exists.js'

export const LoginValidator = vine.compile(
  vine.object({
    uids: vine.string().trim(),
    password: vine.string(),
  })
)
  

export const UserValidator = vine.compile(
  vine.object({
    fullname: vine.string().trim(),
    username: vine.string().trim().use(
      uniqueRule({ table: 'users', column: 'username' })
    ),
    email: vine.string().trim().email().use(
      uniqueRule({ table: 'users', column: 'email' })
    ),
    password: vine.string(),
    confirm: vine.string().confirmed({confirmationField: 'password'})
  })
)

export const PasswordChangeValidator  = vine.compile(
  vine.object({
    password: vine.string(),
  })    
)

export const ForgotPasswordValidator = vine.compile (
  vine.object({
    uids: vine.string().trim(),
  })
)

export const ResetPasswordValidator = vine.compile(
  vine.object({
    user_id: vine.number().use(existRule({table: 'users', column: 'id'})),
    token: vine.string().use(existRule({table: 'auth_access_tokens', column: 'hash'})),
    password: vine.string(),
  })
)


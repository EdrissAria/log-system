import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'
import db from '@adonisjs/lucid/services/db'

/**
 * Options accepted by the unique rule
 */
type Options = {
    table: string
    column: string
}

/**
 * Implementation
 */
async function exist(
    value: any,
    options: Options,
    field: FieldContext
) {
    /**
     * We do not want to deal with non-string
     * values. The "string" rule will handle the
     * the validation.
     */

    const row = await db
        .from(options.table)
        .select(options.column)
        .where(options.column, value)
        .first()

    if (!row) {
        field.report(
            'The {{ field }} field is not existed',
            'exists',
            field
        )
    }
}


export const existRule = vine.createRule(exist)
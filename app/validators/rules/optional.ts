import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'

/**
 * Options accepted by the unique rule
 */
type Options = {
    column: string
}

/**
 * Implementation
 */
async function optional(
    value: any,
    options: Options,
    field: FieldContext
) {

    if (field.data.params.id) {
        field.mutate(value, field)
    }
}


export const optionalRule = vine.createRule(optional)
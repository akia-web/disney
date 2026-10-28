import { helpers } from '@vuelidate/validators'

export const validDate = helpers.withMessage(
    'Veuillez saisir une date valide',
    (value: string) => {
        if (!value) return true

        const date = new Date(value)

        return !isNaN(date.getTime()) &&
            date.toISOString().slice(0, 10) === value
    }
)
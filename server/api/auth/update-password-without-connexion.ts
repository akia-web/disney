import bcrypt from 'bcrypt'
import { createHash } from 'node:crypto'


export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    if (body.checked === undefined || body.checked === true || body.checked === undefined || !body.password || !body.code) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Données invalides',
            message: 'Veuillez vérifier les informations saisies.'
        })
    }

    const hashedToken = createHash('sha256')
        .update(body.code)
        .digest('hex')

    const searchUser = await prisma.user.findUnique({
        where: {
            resetPasswordCode: hashedToken
        }
    })


    if (
        !searchUser ||
        !searchUser.expiresResetPasswordCodeAt ||
        searchUser.expiresResetPasswordCodeAt < new Date()
    ) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Code invalide ou expiré',
            message: 'Ce lien de réinitialisation est invalide ou a expiré.'
        })
    }

    const hashedPassword = await bcrypt.hash(body.password, 10)

    await prisma.user.update({
        where: {
            id: searchUser.id
        },
        data: {
            password: hashedPassword,
            expiresResetPasswordCodeAt: null,
            resetPasswordCode: null
        }
    })

    return {
        success: true,
        message: 'Mot de passe réinitialisé'
    }

})
import { randomBytes, createHash } from 'node:crypto'
import { sendPasswordResetEmail } from '~~/server/utils/send-email'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    if (body.checked === undefined || body.checked === true || body.checked === undefined || !body.email) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Données invalides',
            message: 'Veuillez vérifier les informations saisies.'
        })
    }

    const searchUser = await prisma.user.findUnique({
        where: {
            email: body.email
        }
    })

    if (!searchUser) {
        throw createError({
            statusCode: 200,
            statusMessage: 'OK',
            message: 'Si cette adresse existe, un email de réinitialisation sera envoyé.'
        })
    }

    const token = randomBytes(32).toString('hex')
    const hashedToken = createHash('sha256')
        .update(token)
        .digest('hex')

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000)

    await prisma.user.update({
        where: {
            id: searchUser.id
        },
        data: {
            resetPasswordCode: hashedToken,
            expiresResetPasswordCodeAt: expiresAt
        }
    })


    const url = process.env.NODE_ENV === "development" ? 'http://localhost:3000' : 'https://ddv.akiagaming.fr'
    const resetUrl = new URL('/reset-password/reset-password', url)
    resetUrl.searchParams.set('code', token)

    try {
        await sendPasswordResetEmail(searchUser.email, resetUrl.toString())
    } catch (error) {
        await prisma.user.update({
            where: {
                id: searchUser.id
            },
            data: {
                resetPasswordCode: null,
                expiresResetPasswordCodeAt: null
            }
        })

        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur email',
            message: 'Impossible d’envoyer l’email de réinitialisation.'
        })
    }

    return {
        success: true,
        message: 'Si cette adresse existe, un email de réinitialisation sera envoyé.'
    }

})
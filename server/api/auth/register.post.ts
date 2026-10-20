import prisma from "~~/server/utils/prisma";
import bcrypt from 'bcrypt'
export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    if (body.checked === undefined || body.checked === true || body.checked === undefined) {
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

    if (searchUser) {
        throw createError({
            statusCode: 409,
            statusMessage: 'Conflict',
            message: 'Utilisateur déjà existant'
        })
    }

    const hashedPassword = await bcrypt.hash(body.password, 10)

    await prisma.user.create({
        data: {
            email: body.email,
            password: hashedPassword,
            role: 'USER'
        }
    })

    return {
        success: true,
        message: 'Inscription réussi'
    }
})
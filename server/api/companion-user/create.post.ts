export default defineEventHandler(async (event) => {
    const user = await getUserFromSession(event)

    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Utilisateur non authentifier',
            message: 'veuillez vous connecter'
        })
    }



    const body = await readBody(event)

    if (!body.companionId || body.checked === undefined || body.checked === null || body.checked === true) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Données invalides',
            message: 'Veuillez vérifier les informations saisies.'
        })
    }


    const searchCompanionUser = await prisma.companionUser.findFirst({
        where: {
            companionId: body.companionId,
            userId: user.id
        }
    })
    console.warn(searchCompanionUser)

    if (searchCompanionUser) {
        throw createError({
            statusCode: 409,
            statusMessage: 'Conflict',
            message: 'compagnon déjà possédé'
        })
    }

    const companionUser = await prisma.companionUser.create({
        data: {
            userId: user.id,
            companionId: body.companionId,
            isObtained: true,
        },
        include: {
            companion: {
                include: {
                    job: true,
                    availabilities: true
                }
            }
        }
    })

    return companionUser
})
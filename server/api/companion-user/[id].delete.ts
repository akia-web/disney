export default defineEventHandler(async (event) => {
    const id = Number(getRouterParam(event, 'id'))
    if (isNaN(id)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Données invalides',
            message: 'Veuillez vérifier les informations saisies.'
        })
    }

    const user = await getUserFromSession(event)

    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Utilisateur non authentifier',
            message: 'veuillez vous connecter'
        })
    }

    const body = await readBody(event)
    if (body.checked === undefined || body.checked === true || body.checked === null) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Données invalides',
            message: 'Veuillez vérifier les informations saisies.'
        })

    }

    const searchCompanionUser = await prisma.companionUser.findFirst({
        where: { companionId:id , userId: user.id }
    })

    if (!searchCompanionUser) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Compagnion non trouvées',
            message: 'Compagnion non trouvée'
        })
    }


    const task = await prisma.companionUser.delete({
        where: { id : searchCompanionUser.id, userId: user.id, companionId: id },
    })

    return task

})
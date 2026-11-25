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

    const searchDreamsnap = await prisma.dreamsnap.findFirst({
        where: { id , userId: user.id}
    })

    if (!searchDreamsnap) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Données non trouvées',
            message: 'Tâche non trouvée'
        })
    }

    await deleteImage(searchDreamsnap.image);
    
    const dreamsnap = await prisma.dreamsnap.delete({
        where: { id: searchDreamsnap.id },
    })

    return dreamsnap

})
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

    if (!body.description || body.checked === undefined || body.checked === true || body.checked === undefined) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Données invalides',
            message: 'Veuillez vérifier les informations saisies.'
        })

    }

    const task = await prisma.task.create({
        data: {
            userId: user.id,
            description: body.description,
            isCompleted: false,
        }
    })

    return task
})
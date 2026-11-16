import prisma from "~~/server/utils/prisma";

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
    if (body.isCompleted === undefined || body.checked === undefined || body.checked === true || body.checked === null) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Données invalides',
            message: 'Veuillez vérifier les informations saisies.'
        })

    }

    const searchTask = await prisma.task.findFirst({
        where: { id }
    })

    if (!searchTask) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Données non trouvées',
            message: 'Tâche non trouvée'
        })
    }

    if (searchTask.userId !== user.id) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Données non proprietaire',
            message: 'Cette tâche ne vous appartient pas'
        })
    }

    const task = await prisma.task.update({
        where: { id },
        data: {
            isCompleted: body.isCompleted,
        },
    })

    return task
})
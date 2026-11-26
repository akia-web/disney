export default defineEventHandler(async (event) => {
    const user = await getUserFromSession(event)
    const id = Number(getRouterParam(event, 'id'))

    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Utilisateur non connecté',
            message: 'Utilisateur non connecté'
        })
    }

    const body = await readBody(event)

    
    if(body.checked === undefined || body.checked === true || body.checked === null || !body.name || !body.image || !body.jobId || !body.game || !body.region || !body.loveName || !body.loveImage || !body.availabilities)  {
        throw createError({
            statusCode: 400,
            statusMessage: 'Données invalides',
            message: 'Champs manquant'
        })
    }

    const companion = await prisma.companion.update({
        where: {
            id: id
        },
        data: {
            name: body.name,
            image: body.image,
            jobId:  body.jobId,
            game: body.game,
            region: body.region,
            loveName: body.loveName,
            loveImage: body.loveImage,
            availabilities: {
                deleteMany: {
                    id: {
                        notIn: body.availabilities
                            .filter((a: any) => a.id)
                            .map((a: any) => a.id)
                    }
                },
            create: body.availabilities
                    .filter((a: any) => !a.id)
                    .map(({ id, companionId,...availability }: any) => availability),
            update: body.availabilities
                    .filter((a: any) => a.id)
                    .map(({ id, companionId,...availability }: any) => ({
                    where: { id },
                    data: availability
                    }))
            }
        },
        include: {
            availabilities: true,
            job: true
        }
    })

    return companion
})
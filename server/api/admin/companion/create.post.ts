export default defineEventHandler(async (event) => {
    const user = await getUserFromSession(event)

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

    const companion = await prisma.companion.create({
        data: {
            name: body.name,
            image: body.image,
            jobId:  body.jobId,
            game: body.game,
            region: body.region,
            loveName: body.loveName,
            loveImage: body.loveImage,
            availabilities: {
            create: body.availabilities
            }
        },
        include: {
            availabilities: true,
            job: true
        }
    })

    return companion
})
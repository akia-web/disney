export default defineEventHandler(async (event) => {
    const id = Number(getRouterParam(event, 'id'))
    const formData = await readMultipartFormData(event)
    const user = await getUserFromSession(event)

    if (!user) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Utilisateur non trouvé',
            message: 'Utilisateur non trouvé'
        })
    }

    if (!formData) {
         throw createError({
            statusCode: 400,
            statusMessage: 'Données invalides',
            message: 'Champs manquant'
        })
    }

    const theme = formData.find(item => item.name === 'theme')?.data.toString()
    const rank = formData.find(item => item.name === 'rank')?.data.toString()
    const moonlight = formData.find(item => item.name === 'moonlight')?.data.toString()
    const file = formData.find(item => item.name === 'file')
    const checked = formData.find(item => item.name === 'checked')?.data.toString()
    const date = formData.find(item => item.name === 'date')?.data.toString()


    if (!theme || !rank || !moonlight || !date) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Données invalides',
            message: 'Champs manquant'
        })
    }

    if (!checked || checked === 'true') {
        throw createError({
            statusCode: 400,
            statusMessage: 'Données invalides',
            message: 'Champs manquant'
        })
    }


    const searchDreamsnap = await prisma.dreamsnap.findFirst({
        where: {
            id,
            userId: user.id
        }
    })

    if (!searchDreamsnap) {
         throw createError({
            statusCode: 404,
            statusMessage: 'Dreamsnap non trouvé',
            message: 'Dreamsnap non trouvé'
        })
    }   

    const data={
        theme: theme,
        rank: Number(rank),
        moonlight: Number(moonlight),
        date: new Date(date),
        image: searchDreamsnap.image
    }

   if (file) {
        await deleteImage(searchDreamsnap.image);
        const nameFile = Date.now()
        const image = await uploadImage(file.data,  `ddv/dreamsnap/${user.email}`, nameFile.toString())
        data.image = image.secure_url
    }

    const dreamsnap = await prisma.dreamsnap.update({
        where: {
            id
        },
        data
    })

    return dreamsnap
})
export default defineEventHandler(async (event) => {
    const id = Number(getRouterParam(event, 'id'))
    const formData = await readMultipartFormData(event)

    if (!formData) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Données invalides',
            message: 'Champs manquant'
        })
    }

    const name = formData.find(item => item.name === 'name')?.data.toString()
    const file = formData.find(item => item.name === 'file')
    const checked = formData.find(item => item.name === 'checked')?.data.toString()

    if (!name) {
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

    const searchCharacter = await prisma.character.findUnique({
        where: {
            name
        }
    })

    if (!searchCharacter) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Données inexistantes',
            message: 'Personnage non trouvé'
        })
    }

    const data = {
        name,
        image: searchCharacter.image
    }

    if (file) {
        await deleteImage(searchCharacter.image);
        const nameFile = Date.now()
        const image = await uploadImage(file.data, 'ddv/characters', nameFile.toString())
        data.image = image.secure_url
    }

    const character = await prisma.character.update({
        where: {
            id
        },
        data
    })

    return character
})
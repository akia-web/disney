import { deleteImage } from "~~/server/utils/cloudinary"

export default defineEventHandler(async (event) => {
    const id = Number(getRouterParam(event, 'id'))

    const formData = await readMultipartFormData(event)

    if (!formData) {
        return {
            success: false,
            message: 'Données manquantes'
        }
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
            message: 'Veuillez vérifier les informations saisies.'
        })
    }

    const searchItem = await prisma.job.findFirst({ where: { id } })

    if (!searchItem) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Données inexistantes',
            message: 'Métier non trouvé'
        })
    }


    if (searchItem.name !== searchItem.name) {
        const nameAlreadyExist = await prisma.job.findUnique({
            where: {
                name
            }
        })

        if (nameAlreadyExist) {
            throw new Error('Nom déjà utilisé')
        }
    }

    const data = {
        name,
        image: searchItem.image
    }

    if (file) {
        await deleteImage(searchItem.image);
        const nameFile = Date.now()
        const image = await uploadImage(file.data, 'ddv/jobs', nameFile.toString())
        data.image = image.secure_url
    }



    const item = await prisma.job.update({
        where: {
            id
        },
        data
    })

    return item
})
import { uploadImage } from '~~/server/utils/cloudinary'

export default defineEventHandler(async (event) => {
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


    if (!name || !file) {
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

    const searchItem = await prisma.job.findUnique({
        where: {
            name
        }
    })

    if (searchItem) {
        throw createError({
            statusCode: 409,
            statusMessage: 'Conflict',
            message: 'Métier déjà existant'
        })
    }

    const nameFile = Date.now()
    const image = await uploadImage(file.data, 'ddv/jobs', nameFile.toString())

    const job = await prisma.job.create({
        data: {
            name,
            image: image.secure_url
        }
    })

    return job
})
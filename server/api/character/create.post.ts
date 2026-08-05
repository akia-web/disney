import { uploadImage } from '~~/server/utils/cloudinary'

export default defineEventHandler(async (event) => {
    const formData = await readMultipartFormData(event)

    if (!formData) {
        return {
            success: false,
            message: 'Données manquantes'
        }
    }

    const name = formData.find(item => item.name === 'name')?.data.toString()
    const level = formData.find(item => item.name === 'level')?.data.toString()
    const job = formData.find(item => item.name === 'job')?.data.toString()
    const file = formData.find(item => item.name === 'file')
    const checked = formData.find(item => item.name === 'checked')?.data.toString()


    if (!name || !level || !job || !file) {
        return {
            success: false,
            message: 'Champs manquants'
        }
    }

    if (!checked || checked === 'true') {
        return {
            success: false,
            message: 'Erreur'
        }
    }

    const searchCharacter = await prisma.character.findUnique({
        where: {
            name
        }
    })

    if (searchCharacter) {
        return {
            success: false,
            message: 'Personnage déjà existant'
        }
    }
    const image = await uploadImage(file.data, 'characters', name)

    const character = await prisma.character.create({
        data: {
            name,
            level: Number(level),
            job,
            image: image.secure_url
        }
    })

    return character
})
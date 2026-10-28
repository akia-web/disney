import { uploadImage } from '~~/server/utils/cloudinary'

export default defineEventHandler(async (event) => {
    const formData = await readMultipartFormData(event)
    const user = await getUserFromSession(event)

    if (!user) {
        throw new Error('Utilisateur non trouvé')
    }

    if (!formData) {
        return {
            success: false,
            message: 'Données manquantes'
        }
    }

    const theme = formData.find(item => item.name === 'theme')?.data.toString()
    const rank = formData.find(item => item.name === 'rank')?.data.toString()
    const moonlight = formData.find(item => item.name === 'moonlight')?.data.toString()
    const file = formData.find(item => item.name === 'file')
    const checked = formData.find(item => item.name === 'checked')?.data.toString()
    const date = formData.find(item => item.name === 'date')?.data.toString()


    if (!theme || !rank || !moonlight || !file || !date) {
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

    const nameFile = Date.now()

    const image = await uploadImage(file.data, `ddv/dreamsnap/${user.email}`, nameFile.toString())

    const dreamsnap = await prisma.dreamsnap.create({
        data: {
            theme,
            rank: Number(rank),
            moonlight: Number(moonlight),
            date: new Date(date),
            image: image.secure_url,
            userId: user.id,
        }
    })

    return dreamsnap
})
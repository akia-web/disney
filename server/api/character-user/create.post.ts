export default defineEventHandler(async (event) => {
    const user = await getUserFromSession(event)

    if (!user) {
        throw new Error('Utilisateur non trouvé')
    }

    const body = await readBody(event)

    const characterUser = await prisma.characterUser.create({
        data: {
            userId: user.id,
            characterId: body.character.id,
            jobId: body.job.id,
            level: Number(body.level)
        }
    })

    return characterUser
})
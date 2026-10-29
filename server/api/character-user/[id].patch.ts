export default defineEventHandler(async (event) => {
    const user = await getUserFromSession(event)

    if (!user) {
        throw new Error('Utilisateur non trouvé')
    }

    const body = await readBody(event)

    const characterUser = await prisma.characterUser.update({
        where: {
            characterId_userId: {
                characterId: body.character.id,
                userId: user.id
            }
        },
        data: {
            jobId: body.job.id,
            level: Number(body.level)
        },
        include: {
            character: true,
            job: true
        }
    })

    return characterUser
})
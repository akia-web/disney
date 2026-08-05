export default defineEventHandler(async (event) => {
    const id = Number(getRouterParam(event, 'id'))
    const body = await readBody(event)

    if (body.checked === undefined || body.checked === true || body.checked === undefined) {
        return {
            success: false,
            message: 'Erreur'
        }
    }

    const character = await prisma.character.update({
        where: {
            id
        },
        data: {
            name: body.name,
            level: Number(body.level),
            job: body.job
        }
    })

    return character
})
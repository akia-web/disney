export default defineEventHandler(async (event) => {
    const id = Number(getRouterParam(event, 'id'))
    const body = await readBody(event)

    if (body.checked === undefined || body.checked === true || body.checked === undefined) {
        return {
            success: false,
            message: 'Erreur'
        }
    }

    const dreamsnap = await prisma.dreamsnap.update({
        where: {
            id
        },
        data: {
            theme: body.theme,
            rank: Number(body.rank),
            moonlight: Number(body.moonlight),
            date: new Date(body.date),
        }
    })

    return dreamsnap
})
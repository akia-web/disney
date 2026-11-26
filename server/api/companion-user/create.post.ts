export default defineEventHandler(async (event) => {
    const user = await getUserFromSession(event)

    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Utilisateur non authentifier',
            message: 'veuillez vous connecter'
        })
    }



    const body = await readBody(event)

    if(!body.companionId || body.checked === undefined || body.checked === null || body.checked === true ){}

    
    const searchCompanionUser = await prisma.companionUser.findFirst({where: {
        id: body.companionId,
        userId: user.id
    }})

    if(searchCompanionUser){
        throw createError({
            statusCode: 409,
            statusMessage: 'Conflict',
            message: 'compagnon déjà possédé'
        })
    }
    
    const companionUser = await prisma.companionUser.create({
        data: {
            userId: user.id,
            companionId: body.companionId,
            isObtained: true,
        },
        include: {
            companion: {
                include: {
                    job: true,
                    availabilities: true
                }
            }
        }
    })

    return companionUser
})
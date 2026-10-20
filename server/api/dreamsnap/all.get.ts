import { Prisma } from "~/generated/prisma/client"

export default defineEventHandler(async (event) => {
    const user = await getUserFromSession(event)
    if (!user) {
        throw new Error('utilisateur non trouvé')
    }
    return await prisma.dreamsnap.findMany({
        where: { userId: user.id },
        orderBy: {
            date: 'desc'
        }
    })
})
import { Prisma } from "~/generated/prisma/client"

export default defineEventHandler(async (event) => {
    const user = await getUserFromSession(event)
    if (!user) {
        throw new Error('utilisateur non trouvé')
    }
    return await prisma.task.findMany({
        where: { userId: user.id },
        orderBy: {
            isCompleted: 'asc'
        }
    })
})

import { Prisma } from "~/generated/prisma/client"

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const user = await getUserFromSession(event)

    const search = String(query.search ?? '').trim()
    const job = String(query.job ?? '').trim()
    const orderByLevel = String(query.orderByLevel ?? '').trim()

    if (!user) {
        throw new Error('utilisateur non trouvé')
    }

    const where: Prisma.CharacterUserWhereInput = {
        userId: user.id
    }

    if (job) {
        where.job = {
            id: {
                equals: Number(job),
            }
        }
    }

    if (search) {
        where.character = {
            name: {
                contains: search,
                mode: 'insensitive'
            }
        }
    }

    return await prisma.characterUser.findMany({
        where,
        include: {
            character: true,
            job: true
        },
        orderBy: orderByLevel
            ? [
                { level: orderByLevel === 'smallest' ? 'asc' : 'desc' },
                { character: { name: 'asc' } }
            ]
            : [
                { character: { name: 'asc' } }
            ]
    })
})

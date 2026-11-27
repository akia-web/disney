
import { Prisma } from "~/generated/prisma/client"

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const user = await getUserFromSession(event)

    const search = String(query.search ?? '').trim()
    const job = String(query.job ?? '').trim()

    if (!user) {
        throw new Error('utilisateur non trouvé')
    }

    const where: Prisma.CompanionWhereInput = {
    }

    if (job) {
        where.job = {
            id: {
                equals: Number(job),
            }
        }
    }

    if (search) {
        where.name = {

            contains: search,
            mode: 'insensitive'

        }
    }

    return await prisma.companion.findMany({
        where,
        include: {
            job: true,
            availabilities: true
        },
        orderBy:
            [{ game: 'asc' },
            { region: 'asc' },
            { name: 'asc' }
            ]

    })
})

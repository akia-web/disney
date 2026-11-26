
import { Prisma } from "~/generated/prisma/client"

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const user = await getUserFromSession(event)

    const search = String(query.search ?? '').trim()
    const job = String(query.job ?? '').trim()

    if (!user) {
        throw new Error('utilisateur non trouvé')
    }

    const where: Prisma.CompanionUserWhereInput = {
        userId: user.id
    }

    if (job && where.companion) {
        where.companion = {
            job:{
                id: {
                equals: Number(job),
                 }
            }

        }
    }

    if (search) {
        where.companion = {
            name: {
                contains: search,
                mode: 'insensitive'
            }
        }
    }

    return await prisma.companionUser.findMany({
        where,
        include: {
            companion: {
                include: {
                    job: true,
                    availabilities: true
                }
            },
        },
        orderBy:  [
                { companion: { region: 'asc' } },
                {companion: {name: 'asc'}}
            ]
    })
})

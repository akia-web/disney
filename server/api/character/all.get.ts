
import { Prisma } from "~/generated/prisma/client"

export default defineEventHandler(async (event) => {
    const query = getQuery(event)

    const search = String(query.search ?? '').trim()
    const job = String(query.job ?? '').trim()

    const where: Prisma.CharacterWhereInput = {}

    if (job) {
        where.characterUsers = {
            some: {
                job: {
                    name: {
                        equals: job,
                        mode: 'insensitive'
                    }
                }
            }
        }
    }

    if (search) {
        where.name = {
            contains: search,
            mode: 'insensitive'
        }
    }

    return await prisma.character.findMany({
        where,
        orderBy: {
            name: 'asc'
        }
    })
})

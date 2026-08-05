import { Prisma } from "~/generated/prisma/client"

export default defineEventHandler(async (event) => {
    const query = getQuery(event)

    const search = String(query.search ?? '').trim()
    const job = String(query.job ?? '').trim()

    let where: Prisma.CharacterWhereInput | undefined

    if (job) {
        where = {
            job
        }
    } else if (search) {
        where = {
            name: {
                contains: search,
                mode: 'insensitive'
            }
        }
    }

    return await prisma.character.findMany({
        where,
        orderBy: {
            name: 'asc'
        }
    })
})
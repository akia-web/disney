import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async () => {
    const result = await prisma.character.groupBy({
        by: ['job'],
        _count: {
            job: true
        },
        orderBy: {
            job: 'asc'
        }
    })

    return result.map((item) => ({
        job: item.job,
        number: item._count.job
    }))
})
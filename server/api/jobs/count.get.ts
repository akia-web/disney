import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const user = await getUserFromSession(event)
    const userId = user?.id

    const result = await prisma.characterUser.groupBy({
        by: ['jobId'],
        where: {
            userId
        },
        _count: {
            jobId: true
        },
        orderBy: {
            jobId: 'asc'
        }
    })

    const jobs = await prisma.job.findMany({
        where: {
            id: {
                in: result.map(item => item.jobId)
            }
        },
        select: {
            id: true,
            name: true,
            image: true
        },
        orderBy: {
            name: 'asc'
        }
    })

    return jobs.map(job => ({
        name: job.name,
        image: job.image,
        number: result.find(item => item.jobId === job.id)?._count.jobId ?? 0,
        id: job.id
    }))
})
import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    const sessionId = getCookie(event, 'session-DDV')

    if (sessionId) {
        await prisma.session.delete({
            where: {
                id: sessionId
            }
        })
    }

    deleteCookie(event, 'session-DDV')

    return {
        success: true
    }
})
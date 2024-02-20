import  schedule  from 'node-schedule'


export const configureDeleteScheduler = (prisma) => {   
    schedule.scheduleJob('*/2 * * * *', async () => {
        try {
            const time = new Date(Date.now() - 2 * 60 * 1000);
            
            await prisma.otp.deleteMany({
                where: {
                    createdAt: {
                        lt: time,
                    },
                },
            })
            
            console.log('The Eskiz code time is end')
        } catch (error) {
            console.log(error)
        }
    })
}

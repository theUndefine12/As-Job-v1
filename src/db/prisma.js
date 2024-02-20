import { PrismaClient } from "@prisma/client";
import {configureDeleteScheduler} from '../services/schedule.service.js'


const prisma = new PrismaClient()
configureDeleteScheduler(prisma)


export default prisma

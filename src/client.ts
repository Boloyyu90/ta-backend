import { PrismaClient } from '@prisma/client';
import config from './config/config';

const prisma = new PrismaClient({
  log: config.env === 'development' ? ['query', 'error', 'warn'] : ['error']
});

export default prisma;

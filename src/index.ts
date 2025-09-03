import app from './app';
import config from './config/config';
import logger from './config/logger';
import http from 'http';
import { Server } from 'socket.io';
import { setupProctoringWebSocket } from './websocket/proctoring.handler';

const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*', // Configure this properly for production
    methods: ['GET', 'POST']
  }
});

// Setup WebSocket handlers
setupProctoringWebSocket(io);

server.listen(config.port, () => {
  logger.info(`Listening to port ${config.port}`);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: unknown) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});

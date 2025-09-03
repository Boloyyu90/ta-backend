import { Server } from 'socket.io';
import { proctoringService } from '../services';

export const setupProctoringWebSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join-exam', (data) => {
      const { userExamId } = data;
      socket.join(`exam-${userExamId}`);
      console.log(`Client joined exam session: ${userExamId}`);
    });

    socket.on('proctoring-event', async (data) => {
      try {
        const { userExamId, eventType, metadata } = data;
        
        await proctoringService.recordProctoringEvent(
          userExamId,
          eventType,
          metadata
        );

        // Broadcast to admin/proctor
        socket.broadcast.emit('proctoring-alert', {
          userExamId,
          eventType,
          timestamp: new Date(),
          metadata
        });
      } catch (error) {
        console.error('Error recording proctoring event:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};
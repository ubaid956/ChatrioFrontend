// utils/socket.js
import { Server } from 'socket.io';
import { socketAuth } from '../middleware/auth.js';

export const onlineUsers = new Map(); // userId -> Set<socketIds>

const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  io.use(socketAuth).on('connection', (socket) => {
    const userId = socket.user._id.toString();
    console.log(`User connected: ${userId}, socketId: ${socket.id}`);

    // Track online user
    const set = onlineUsers.get(userId) || new Set();
    set.add(socket.id);
    onlineUsers.set(userId, set);

    // Also join personal room for private messages
    socket.join(userId);
    console.log(`User ${userId} joined personal room: ${userId}`);

    // Join user groups
    socket.on('joinGroups', async () => {
      const groups = socket.user.groups || [];
      groups.forEach(groupId => {
        socket.join(groupId.toString());
        console.log(`User ${userId} joined group ${groupId}`);
      });
    });

    // Join specific group room
    socket.on('joinGroup', (groupId) => {
      socket.join(groupId.toString());
      console.log(`User ${userId} joined group room: ${groupId}`);
    });

    // Handle direct socket message sending (for real-time delivery)
    socket.on('sendPrivateMessage', async (data) => {
      try {
        console.log('Received sendPrivateMessage via socket:', data);
        const { recipientId, text } = data;

        // Emit to recipient immediately
        io.to(recipientId.toString()).emit('privateMessage', {
          _id: `temp-${Date.now()}`,
          sender: socket.user,
          recipient: recipientId,
          text: text,
          createdAt: new Date(),
          isPrivate: true
        });

        console.log(`Socket message sent to recipient: ${recipientId}`);
      } catch (error) {
        console.error('Error handling socket message:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${userId}`);
      const set = onlineUsers.get(userId);
      if (!set) return;
      set.delete(socket.id);
      if (set.size === 0) onlineUsers.delete(userId);
    });
  });

  return io;
};

export default initSocket;
const socketio = require('socket.io');

let io;

const initSocket = (server) => {
  io = socketio(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`New Socket Connection: ${socket.id}`);

    socket.on('join-room', (bookingId) => {
      socket.join(bookingId);
      console.log(`Socket ${socket.id} joined room ${bookingId}`);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

module.exports = { initSocket, getIO };

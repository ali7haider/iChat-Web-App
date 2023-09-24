const http = require('http');
const io = require('socket.io');

const httpServer = http.createServer(); // Create an HTTP server instance

const socketOptions = {
    cors: {
      origin: 'http://127.0.0.1:5500', // Update this to the correct URL of your client
      methods: ['GET', 'POST']
    }
  };

const socketIoServer = io(httpServer, socketOptions); // Initialize Socket.IO server

const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

const users = {};

socketIoServer.on('connection', socket => {
  socket.on('new-user-joined', name => {
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
  });

  socket.on('send', message => {
    socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
  });
  socket.on('disconnect', message => {
    socket.broadcast.emit('left',users[socket.id]);
    delete users[socket.id];
  });
});

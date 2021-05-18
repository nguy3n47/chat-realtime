// Setup basic express server
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

// Routing
app.use(express.static(path.join(__dirname, 'public')));

// Chat Room

let numUsers = 0;

io.on('connection', (socket) => {
  console.log('a user connected');
  let addedUser = false;
  // when the client emits 'add user', this listens and executes
  socket.on('add user', (data) => {
    if (addedUser) return;
    socket.username = data.username;
    socket.avatar = data.avatar;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers,
    });

    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers,
    });
  });

  // when the client emits 'new message', this listens and executes
  socket.on('new message', (data) => {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      avatar: socket.avatar,
      message: data,
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    console.log('a user disconnected');
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers,
      });
    }
  });
});

server.listen(port, () => {
  console.log(`🚀 Server listening at ${port}`);
});

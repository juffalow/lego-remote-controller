const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let driver = null;
let clients = [];
const cache = {
  poweredup: {
    hubs: [],
  },
};

io.on('connection', (socket) => {
  console.log('New connection!');

  if (socket.handshake.query.driver === 'true') {
    console.log('Driver connected!');
    driver = socket;
  } else {
    clients.push(socket);
    
    socket.emit('poweredup', cache['poweredup']);
  }

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('command', (message) => {
    if (driver === null) {
      return;
    }

    driver.emit('command', message)
  });

  socket.on('scan', (message) => {
    if (driver === null) {
      return;
    }

    driver.emit('scan', message);
  });

  socket.on('poweredup', (message) => {
    cache['poweredup'] = message;

    for (const client of clients) {
      client.emit('poweredup', message);
    }
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.listen(3000, () => {
  console.log('Listening on localhost:3000');
});

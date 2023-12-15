const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let driver = null;
let clients = [];

io.on('connection', (socket) => {
  if (socket.handshake.query.driver === 'true') {
    console.log('Driver connected!', { id: socket.id });
    driver = socket;
  } else {
    console.log('Client connected!', { id: socket.id });

    clients.push(socket);
    socket.emit('poweredup', driver !== null && 'poweredup' in driver ? driver.poweredup : {});
  }

  socket.on('disconnect', () => {
    if (driver !== null && driver.id === socket.id) {
      console.log('Driver disconnected!');
      driver = null;

      for (const client of clients) {
        client.emit('poweredup', {});
      }
    } else {
      console.log('Client disconnected!');
      clients = clients.filter(client => client.id === socket.id);
    }
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
    driver['poweredup'] = message;

    for (const client of clients) {
      client.emit('poweredup', message);
    }
  });

  socket.on('tilt', (message) => {
    for (const client of clients) {
      client.emit('tilt', message);
    }
  });

  socket.on('accel', (message) => {
    for (const client of clients) {
      client.emit('accel', message);
    }
  });

  socket.on('force', (message) => {
    for (const client of clients) {
      client.emit('force', message);
    }
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/excavator', (req, res) => {
  res.sendFile(__dirname + '/excavator.html');
});

app.get('/audi', (req, res) => {
  res.sendFile(__dirname + '/audi.html');
});

app.get('/images/excavator.png', (req, res) => {
  res.sendFile(__dirname + '/images/excavator.png');
});

app.get('/images/audi.png', (req, res) => {
  console.log(__dirname + '/images/audi.png');
  res.sendFile(__dirname + '/images/audi.png');
});

server.listen(3010, () => {
  console.log('Listening on localhost:3010');
});

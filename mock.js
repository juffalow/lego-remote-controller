const io = require("socket.io-client");
const client = io.connect("http://localhost:3000", { reconnect: true });

client.on('connect', async function () {
  console.log('Connected!');

  client.emit('scan', 'start');

  await new Promise(r => setTimeout(r, 20000));

  client.emit('command', {
    hub: 0,
    a: {
      power: 100,
    },
  });

  await new Promise(r => setTimeout(r, 5000));

  client.emit('command', {
    hub: 0,
    a: {
      power: 0,
    },
  });

  await new Promise(r => setTimeout(r, 5000));

  client.emit('command', {
    hub: 0,
    b: {
      power: 100,
    },
  });

  await new Promise(r => setTimeout(r, 5000));

  client.emit('command', {
    hub: 0,
    b: {
      power: 0,
    },
  });

  await new Promise(r => setTimeout(r, 5000));

  client.emit('command', {
    hub: 0,
    c: {
      power: 100,
    },
  });

  await new Promise(r => setTimeout(r, 5000));

  client.emit('command', {
    hub: 0,
    c: {
      power: 0,
    },
  });

  await new Promise(r => setTimeout(r, 5000));

  client.emit('command', {
    hub: 0,
    d: {
      power: 100,
    },
  });

  await new Promise(r => setTimeout(r, 5000));

  client.emit('command', {
    hub: 0,
    d: {
      power: 0,
    },
  });

  client.disconnect();
});

client.on('poweredup', (message) => {
  console.log('PoweredUp', message);
});
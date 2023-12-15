const io = require("socket.io-client");
const PoweredUP = require("node-poweredup");

const poweredUP = new PoweredUP.PoweredUP();
const hubs = [];

const client = io.connect("http://localhost:3010", { reconnect: true, query: 'driver=true' });
// const client = io.connect("https://lego.juffalow.com", { reconnect: true, query: 'driver=true' });

client.on('connect', function () {
  console.log('Connected!');

  client.emit('poweredup', {
    hubs: [],
  });
});

client.on('scan', (message) => {
  if (message === 'start') {
    console.log('Scan: start');
    poweredUP.scan();
  }

  if (message === 'stop') {
    console.log('Scan: stop');
    poweredUP.stop();
  }
});

client.on('command', (message) => {
  if (typeof hubs[message.hub] === 'undefined') {
    console.warn('Selected hub is not connected!', { index: message.hub });
    return;
  }

  console.log('nessage', message);

  const hub = hubs[message.hub];

  if ('a' in message && 'power' in message.a && hub.motorA !== null) {
    hub.motorA.setPower(message.a.power);
  }
  if ('a' in message && 'angle' in message.a && hub.motorA !== null) {
    hub.motorA.gotoAngle(message.a.angle, message.a.speed);
  }
  if ('a' in message && 'rotate' in message.a && hub.motorA !== null) {
    hub.motorA.rotateByDegrees(message.a.rotate, message.a.speed);
  }

  if ('b' in message && 'power' in message.b && hub.motorB !== null) {
    hub.motorB.setPower(message.b.power);
  }
  if ('b' in message && 'angle' in message.b && hub.motorB !== null) {
    hub.motorB.gotoAngle(message.b.angle, message.b.speed);
  }
  if ('b' in message && 'rotate' in message.b && hub.motorB !== null) {
    hub.motorB.rotateByDegrees(message.b.rotate, message.b.speed);
  }

  if ('c' in message && 'power' in message.c && hub.motorC !== null) {
    hub.motorC.setPower(message.c.power);
  }
  if ('c' in message && 'angle' in message.c && hub.motorC !== null) {
    hub.motorC.gotoAngle(message.c.angle, message.c.speed);
  }
  if ('c' in message && 'rotate' in message.c && hub.motorC !== null) {
    hub.motorC.rotateByDegrees(message.c.rotate, message.c.speed);
  }

  if ('d' in message && 'power' in message.d && hub.motorD !== null) {
    hub.motorD.setPower(message.d.power);
  }
  if ('d' in message && 'angle' in message.d && hub.motorD !== null) {
    hub.motorD.gotoAngle(message.d.angle, message.d.speed);
  }
  if ('d' in message && 'rotate' in message.d && hub.motorD !== null) {
    hub.motorD.rotateByDegrees(message.d.rotate, message.d.speed);
  }
});

poweredUP.on("discover", async (hub) => {
  console.log(`Discovered ${hub.name}!`, hubs.map(h => h.name));
  await hub.connect();
  console.log(`Connected ${hub.name}`);

  /*
    * Function waitForDeviceAtPort() is checking the port until there
    * is something attached. If there is nothing it will never resolve.
    */
  console.log('Checking motor A...');
  const motorA = await Promise.race([
    hub.waitForDeviceAtPort("A"),
    new Promise(r => setTimeout(r, 500)).then(() => null),
  ]);

  console.log('Checking motor B...');
  const motorB = await Promise.race([
    hub.waitForDeviceAtPort("B"),
    new Promise(r => setTimeout(r, 500)).then(() => null),
  ]);
  console.log('Checking motor C...');
  const motorC = await Promise.race([
    hub.waitForDeviceAtPort("C"),
    new Promise(r => setTimeout(r, 500)).then(() => null),
  ]);
  console.log('Checking motor D...');
  const motorD = await Promise.race([
    hub.waitForDeviceAtPort("D"),
    new Promise(r => setTimeout(r, 500)).then(() => null),
  ]);

  console.log('Centring...');
  await motorD.gotoRealZero(100);
  await new Promise(resolve => setTimeout(resolve, 2000));
  await motorD.resetZero();

  let tilt = { x: 0, y: 0, z: 0 };
  hub.on('tilt', (device, { x, y, z }) => {
    if (x !== tilt.x || y !== tilt.y || z !== tilt.z) {
      tilt = { x, y, z };
      console.log('tilt', { x, y, z });
      client.emit('tilt', { x, y, z });
    }
  });

  let accel = { x: 0, y: 0, z: 0 };
  hub.on('accel', (device, { x, y, z }) => {
    if (x !== accel.x || y !== accel.y || z !== accel.z) {
      accel = { x, y, z };
      console.log('accel', { x, y, z });
      client.emit('accel', { x, y, z });
    }
  });

  hubs.push({
    hub,
    motorA,
    motorB,
    motorC,
    motorD,
  });

  console.log('Hub added to list of hubs!', hubs.map(hub => hub.hub.name));

  client.emit('poweredup', {
    hubs: hubs.map((h, i) => {
      return {
        name: h.hub.name,
        uuid: h.hub._primaryMACAddress,
        status: 'connected',
        index: i,
      }
    }),
  });

  hub.on('disconnect', () => {
    console.log('Hub disconnected!');
    hubs = hubs.filter(h => h.uuid() === hub.uuid());

    client.emit('poweredup', {
      hubs: hubs.map((h, i) => {
        return {
          name: h.hub.name,
          uuid: h.hub._primaryMACAddress,
          status: 'connected',
          index: i,
        }
      }),
    });
  });
});

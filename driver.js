const io = require("socket.io-client");
const PoweredUP = require("node-poweredup");

const poweredUP = new PoweredUP.PoweredUP();
const hubs = [];

const client = io.connect("http://localhost:3000", { reconnect: true, query: 'driver=true' });

client.on('connect', function () {
  console.log('Connected!');
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

/*
{
  hub: 0,
  a: {
    power: 50,
  },
}
*/

client.on('command', (message) => {
  const hub = hubs[message.hub];

  if ('a' in message && 'power' in message.a && hub.motorA !== null) {
    hub.motorA.setPower(message.a.power);
  }
  if ('b' in message && 'power' in message.b && hub.motorB !== null) {
    hub.motorB.setPower(message.b.power);
  }
  if ('c' in message && 'power' in message.c && hub.motorC !== null) {
    hub.motorC.setPower(message.c.power);
  }
  if ('d' in message && 'power' in message.d && hub.motorD !== null) {
    hub.motorD.setPower(message.d.power);
  }
});

poweredUP.on("discover", async (hub) => {
  console.log(`Discovered ${hub.name}!`, hub);
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

  hubs.push({
    hub,
    motorA,
    motorB,
    motorC,
    motorD,
  });

  console.log('Hub added to list of hubs!', hubs);

  client.emit('poweredup', {
    hubs: hubs.map((h, i) => {
      return {
        name: h.hub.name,
        status: 'connected',
        index: i,
      }
    }),
  });
});

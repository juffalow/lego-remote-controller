const readline = require('readline');

const PoweredUP = require("node-poweredup");
const poweredUP = new PoweredUP.PoweredUP();


// poweredUP.on("discover", async (hub) => { // Wait to discover a Hub
//     console.log(`Discovered ${hub.name}!`, hub);
//     await hub.connect(); // Connect to the Hub
//     const motorA = await hub.waitForDeviceAtPort("A"); // Make sure a motor is plugged into port A
//     // const motorB = await hub.waitForDeviceAtPort("B"); // Make sure a motor is plugged into port B
//     console.log("Connected");

//     console.log("Running motor A at speed 100 for 2 seconds");
//     motorA.setPower(100); // Run a motor attached to port A for 2 seconds at maximum speed (100) then stop
//     await hub.sleep(2000);
//     motorA.brake();
// });

// poweredUP.scan(); // Start scanning for Hubs
// console.log("Scanning for Hubs...");



readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c') {
    process.exit();
  } else {
    console.log(`You pressed the "${str}" key`);
    console.log();
    console.log(key);
    console.log();
  }
});
console.log('Press any key...');

// var stdin = process.stdin;
// stdin.setRawMode(true);
// stdin.resume();
// stdin.setEncoding('utf8');

// stdin.on('data', function(key){
//     if (key == '\u001B\u005B\u0041') {
//         process.stdout.write('up'); 
//     }
//     if (key == '\u001B\u005B\u0043') {
//         process.stdout.write('right'); 
//     }
//     if (key == '\u001B\u005B\u0042') {
//         process.stdout.write('down'); 
//     }
//     if (key == '\u001B\u005B\u0044') {
//         process.stdout.write('left'); 
//     }

//     if (key == '\u0003') { process.exit(); }    // ctrl-c
// });

// stdin.on('keypress', function(key){
//   process.stdout.write('keypress');
//   if (key == '\u001B\u005B\u0041') {
//       process.stdout.write('up'); 
//   }
//   if (key == '\u001B\u005B\u0043') {
//       process.stdout.write('right'); 
//   }
//   if (key == '\u001B\u005B\u0042') {
//       process.stdout.write('down'); 
//   }
//   if (key == '\u001B\u005B\u0044') {
//       process.stdout.write('left'); 
//   }

//   if (key == '\u0003') { process.exit(); }    // ctrl-c
// });
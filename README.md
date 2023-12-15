# Remote controller for LEGO® Powered UP

Drive supported vehicles with simple web application.

![ezgif com-video-to-gif 3](https://github.com/juffalow/lego/assets/8142965/d8933e21-ce1f-4df5-aca4-a19204ff35c0)

## Supported vehicles

* [x] [Liebherr R 9800 Excavator](https://www.lego.com/product/liebherr-r-9800-excavator-42100)
* [x] [Audi RS Q E-Tron](https://www.lego.com/product/audi-rs-q-e-tron-42160)

## How it works

Requres:
* `Controller` web application with controlls and support for keyboard arrows and gamepad
* `Driver` for bluetooth communication with [LEGO Technic™ Hub](https://www.lego.com/product/technic-hub-88012), runs on a computer near to the Lego vehicle
* `Server` for socket communication between `driver` and `controller`

`Controller` transforms user inputs to commands and sends them through [socket.io-client](https://socket.io/docs/v4/client-api/) to the server

`Driver` is using [node-poweredup](https://nathan.kellenicki.com/node-poweredup/) package to communicate with hub and [socket.io-client](https://socket.io/docs/v4/client-api/) to communicate with the server.

`Server` is bridge between controller and driver

## License

[MIT license](./LICENSE)

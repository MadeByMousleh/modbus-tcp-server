let net = require('net');
const EventEmitter = require('node:events');

class ModbusTcpServer {

    port;
    ipAddress;
    tcpServer

    eventEmitter = new EventEmitter();

    constructor(port, ipAddress) {
        this.port = port;
        this.ipAddress = ipAddress;
        this.tcpServer = net.createServer((socket) => {

            console.log('Client connected')

            socket.on('data', data => {
                this.eventEmitter.emit('msg', data);
            })

            this.eventEmitter.on('write', (data) => {
                socket.write(data);
            });

            socket.on('close', function () {
                console.log(`${socket.remoteAddress}:${socket.remotePort} Connection closed`);
            });

            socket.on('error', function () {
                console.log(`${socket.remoteAddress}:${socket.remotePort} Connection Error `);
            });

        })
    }

    listen() {
        this.tcpServer.listen(this.port, this.ipAddress);
        console.log(`Listening on port ${this.port} and ip ${this.ipAddress}`)
    }

    write(data) {
        this.eventEmitter.emit('write', data);
    }

    onMessage(cb) {
        this.eventEmitter.on('msg', data => {
            cb(data)
        })
    }
}

module.exports = ModbusTcpServer;
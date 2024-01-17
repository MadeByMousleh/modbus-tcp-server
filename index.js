const ModbusTcpResponse = require("./ModbusTcpResponse");
const ModbusTcpServer = require("./ModbusTcpServer");

let coils = [
    1,0,1,0,1,1,1,1,1,0,
    1,0,1,0,1,1,1,1,1,0,
    1,0,1,0,1,1,1,1,1,0,
    1,0,1,0,1,1,1,1,1,0,
    1,0,1,0,1,1,1,1,1,0,
    1,0,1,0,1,1,1,1,1,0,
    1,0,1,0,1,1,1,1,1,0,
    1,0,1,0,1,1,1,1,1,0,
    1,0,1,0,1,1,1,1,1,0,
    1,0,1,0,1,1,1,1,1,0,
];


let modbusServer = new ModbusTcpServer(502,'127.0.0.1');

let tcpServer = modbusServer.tcpServer;

modbusServer.listen();


modbusServer.onMessage(data => {

    let response = new ModbusTcpResponse(data);

    console.log(response.data);
    console.log(data, 'AGAIN AGAIN')
})


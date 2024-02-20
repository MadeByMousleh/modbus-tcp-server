const { read } = require("fs");
const ModbusTcpResponse = require("./ModbusTcpResponse");
const ModbusTcpServer = require("./ModbusTcpServer");
const ModbusTcpReadRequest = require("./ModbusTcpReadRequest");


let modbusServer = new ModbusTcpServer(502,'0.0.0.0');

let tcpServer = modbusServer.tcpServer;

modbusServer.listen();


modbusServer.onMessage(data => {

    let request = new ModbusTcpReadRequest(data);


    let response = new ModbusTcpResponse(request);

   response.create(response => {

    console.log(response, 'response');

        modbusServer.write(response);
    })
    // modbusServer.write(response.createInputRegisterResponse())

    // let startAddress = response.data.readInt16BE(0);
    // let count = response.data.readInt16BE(2);

    // Get data;

    // response.printResponseInformation();
})
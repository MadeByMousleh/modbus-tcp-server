const ModbusTcpRequest = require("../../client/ModbusTcpRequest");

class ReadCoilResponse {
    request;
    packetLength = 4;
    protocolId = 0
    functionCode = 1;
    constructor(transactionId, unitId = 1, remainingLength = 1, value)
    {
        this.request = new ModbusTcpRequest(
            transactionId, 
            this.protocolId, 
            this.packetLength, 
            unitId, 
            this.functionCode, 
            remainingLength,
            value,
            );
    }

    createMsg()
    {
        return this.request.buff;
    }

}

module.exports = ReadCoilResponse;
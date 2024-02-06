class ModbusTcpReadRequest {

    buffer;
    command;
    constructor(request) {

        this.transactionId = request.readInt16BE(0);
        this.protocolId = request.readInt16BE(2);
        this.packetLength = request.readInt16BE(4);
        this.unitId = request.readInt8(6);
        this.functionCode = request.readInt8(7);
        this.startAddress = request.readUInt16BE(8);
        this.numberOfRegisters = request.readUInt16BE(10);
        this.buffer = request;

        this.command = this.startAddress + this.numberOfRegisters;
    }
    

    getCommand()
    {
        switch(this.functionCode)
        {
            case 1: return this.startAddress;
            case 2: return (10000 + this.startAddress) +1;
            case 3: return (40000 + this.startAddress) +1;
            case 4: return (30000 + this.startAddress) +1;
            case 5: return (10000 + this.startAddress) +1;
        }
    }

    getCoil()
    {
        if(this.functionCode === 5)
        {
            return {
                address: this.startAddress +1, 
                output: this.buffer.readUInt8(10) 
            }
        }

    }

}

module.exports = ModbusTcpReadRequest;
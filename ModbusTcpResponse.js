class ModbusTcpResponse {
    buff;
    transactionId;
    protocolId;
    packetLength;
    unitId;
    functionCode;
    data;

    constructor(bytes) {
        {
            this.buff = Buffer.from(bytes)

            this.transactionId = this.buff.readUInt16BE(0);
            this.protocolId = this.buff.readUInt16BE(2);
            this.packetLength = this.buff.readUInt16BE(4);
            this.unitId = this.buff.readInt8(6);
            this.functionCode = this.buff.readInt8(7);
            this.data = this.buff.subarray(8, this.buff.length)
        }
    }



    getFunction(functionCode)
    {
        switch(functionCode)
        {
            case 1: return 'READ-COIL';
            case 2: return 'READ-INPUT-STATUS';
            case 3: return 'READ-HOLDING-REGISTER'; 
            case 4: return 'READ-INPUT-REGISTER';
            case 5: return 'WRITE-COIL';
            case 6: return 'WRITE-REGISTER';
        }
    }

    readCoil(addr, count) {

    }

}

module.exports = ModbusTcpResponse;
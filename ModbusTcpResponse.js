const ModbusToBLEFacade = require("./ModbusToBLEFacade");

class ModbusTcpResponse {

    buff;

    transactionId;

    protocolId;

    packetLength;

    unitId;

    functionCode;

    data;

    facade

    request;

    constructor(request) {
        {
            this.facade = new ModbusToBLEFacade('192.168.0.29', 80, "CC:1B:E0:E2:E4:A4");
            this.request = request;
        }
    }


    getFunction() {
        switch (this.functionCode) {
            case 1: return 'READ-COIL';
            case 2: return 'READ-INPUT-STATUS';
            case 3: return 'READ-HOLDING-REGISTER';
            case 4: return 'READ-INPUT-REGISTER';
            case 5: return 'WRITE-COIL';
            case 6: return 'WRITE-REGISTER';
        }
    }

    getAddress() {
        let code = this.getFunction();

        if (code === 'READ-COIL') {
            return this.data.readUInt16BE(0) + this.data.readUInt16BE(2)
        }
    }

    printResponseInformation() {
        console.log(
            `
        Transaction Id: ${this.transactionId}
        Protocol Id: ${this.protocolId}
        Length of packet: ${this.packetLength}
        Unit id: ${this.unitId}
        Function code: ${this.getFunction()}
        Start address: ${this.data.readInt16BE(0)}
        Count: ${this.data.readInt16BE(2)}
        `)
    }


    createReadCoilResponse(value, valueLength) {

        if (this.functionCode === 1) {
            // let startAddress = this.data.readInt16BE(0);
            let count = this.data.readInt16BE(2);

            if (count >= 1 && count <= 2000) {
                this.buff = Buffer.alloc(8 + valueLength);

                this.buff.writeInt16BE(transactionId, 0);

                this.buff.writeInt16BE(protocolId, 2);

                this.buff.writeInt16BE(valueLength + 3, 4);

                this.buff.writeInt8(unitId, 6);

                this.buff.writeInt8(functionCode, 7);

                this.buff.writeInt8(valueLength, 8);

                this.buff.writeInt16BE(value, 9);
            }
        }
    }

    create(cb) {

        if (this.request.functionCode === 4) {

            this.facade.handle(this.request.getCommand(), "10:B9:F7:10:61:A5", (data) => {

                this.data = data;

                this.packetLength = 3 + this.data.length;

                let buffer = Buffer.alloc(9)

                buffer.writeInt16BE(this.request.transactionId, 0);

                buffer.writeInt16BE(this.request.protocolId, 2);

                buffer.writeInt16BE(this.packetLength, 4);
                                
                buffer.writeInt8(this.request.unitId, 6);

                buffer.writeInt8(this.request.functionCode, 7);

                buffer.writeInt8(this.data.length, 8);

                let resp = Buffer.concat([buffer, this.data]);
                cb(Buffer.concat([buffer, this.data]))
    
            })



        }


        if (this.request.functionCode === 5) {

           let coil = this.request.getCoil();
           let result = [];
           console.log(result, 'Result')
            this.facade.setCoil(coil.output, coil.address, "10:B9:F7:10:61:A5", ack => {
                
                if(ack)
                {
                    cb(this.request.buffer)
                }
            })

            return result;

        }
    }
}

module.exports = ModbusTcpResponse;
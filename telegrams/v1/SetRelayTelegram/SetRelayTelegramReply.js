class SetRelayTelegramReply {

    protocolVersion = {
        byteNumber: 0,
        fieldSize: 1,
        description: ``,
        value: null
    }

    telegramType = {
        byteNumber: 1,
        fieldSize: 2,
        description: "Telegram type",
        value: null,
    };

    totalLength = {
        byteNumber: 3,
        fieldSize: 2,
        description: "Total length",
        value: null
    }

    crc16 = {
        byteNumber: 5,
        fieldSize: 2,
        description: "CRC 16 value",
        value: null,
    }

    result = {
        byteNumber: 7,
        fieldSize: 1,
        description: "Indicates the version of the user config structure.",
        value: null
    }

    constructor(reply) {

        let { value } = JSON.parse(reply);

        Object.entries(this).forEach((currentProp) => {
            currentProp[1].value = this.getValueFromReply(currentProp[1], value)
        })


    }

    getValueFromReply(field, reply) {
        let start = field.byteNumber * 2;
        let end = (field.fieldSize * 2) + start;
        return reply.slice(start, end);
    }


    getRawData() {
        let hexVal = "";

        for (const [propName, propValue] of Object.entries(this)) {
            const { fieldSize, value } = propValue;

            if (value !== undefined) {
                hexVal += value.toString(16).padStart(fieldSize * 2, '0').toUpperCase()
            }
        }

        return hexVal;
    }

    isAccepted()
    {
        return  !Number(this.result.value);
    }

}

module.exports = SetRelayTelegramReply;
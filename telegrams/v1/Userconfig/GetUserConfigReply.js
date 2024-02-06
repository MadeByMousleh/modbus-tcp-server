class GetUserConfigReply {

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

    cfgVersion = {
        byteNumber: 7,
        fieldSize: 1,
        description: "Indicates the version of the user config structure.",
        value: null
    }

    systemConfigState = {
        byteNumber: 8,
        fieldSize: 1,
        description: `0=Out Of The Box
        1=FS_DK  (Fact.Reset Denmark)
        2=FS_SV  (Fact.Reset Sweden)
        3=FS_NO  (Fact.Reset Norway)
        4=FS_DE  (Fact.Reset Germany)
        5=FS_BE  (Fact.Reset Belgium)
        255=USER ( The user has made changes to the configuration)
        `,
        value: null
    }

    systemNetworkId = {
        byteNumber: 9,
        fieldSize: 1,
        description: `Identifies the ID of the BLE network Range (0..253)=user network Id’s`,
        value: null
    }

    systemCommonFunc0 = {
        byteNumber: 10,
        fieldSize: 1,
        description: ``,
        value: null
    };


    systemCommonFunc1 = {
        byteNumber: 11,
        fieldSize: 1,
        description: ``,
        value: null
    };

    systemDaliFunc2 = {
        byteNumber: 12,
        fieldSize: 1,
        description: ``,
        value: null
    };


    systemReserved1 = {
        byteNumber: 13,
        fieldSize: 1,
        description: `RESERVED`,
        value: null
    };

    systemReserved2 = {
        byteNumber: 14,
        fieldSize: 1,
        description: `RESERVED`,
        value: null
    }

    vPirA = {
        byteNumber: 15,
        fieldSize: 1,
        description: `Indicates the sensitivity Level for Pir A`,
        value: null
    };

    vPirB = {
        byteNumber: 16,
        fieldSize: 1,
        description: `Indicates the sensitivity Level for Pir B`,
        value: null
    };

    vPirC = {
        byteNumber: 17,
        fieldSize: 1,
        description: `Indicates the sensitivity Level for Pir C`,
        value: null
    };

    tSp = {
        byteNumber: 18,
        fieldSize: 2,
        description: `Indicate the time to recognize a short press. 
        ms. (150-10000)
        500
        1000
        2000
        `,
        value: null,
    }

    tLp = {
        byteNumber: 20,
        fieldSize: 2,
        description: `Indicate the time to recognize a long press. ms. (500-17000) > CFG_T_SP`,
        value: null,
    };

    tVlp = {
        byteNumber: 22,
        fieldSize: 2,
        description: `Very long push timing.
        ms. (10000-30000)
        10500
        11000
        12000
        `,
        value: null,
    };

    tLpFail = {
        byteNumber: 24,
        fieldSize: 2,
        description: `Long push fail time. ms. (>=30001)`,
        value: null,
    };

    tHvacOnDelay = {
        byteNumber: 26,
        fieldSize: 2,
        description: `Indicate the time for the HVAC to turn On after motion detection Sec. (120..7200)`,
        value: null,
    };

    tHvacOffDelay = {
        byteNumber: 28,
        fieldSize: 2,
        description: `Indicate the time for the HVAC to turn Off after the last motion detection Sec. (0..7200)`,
        value: null,
    };

    tStandbyMinDelay = {
        byteNumber: 30,
        fieldSize: 2,
        description: `Delay for Std.By Min. Sec. (0..7200)`,
        value: null,
    };

    zone1 = {
        byteNumber: 32,
        fieldSize: 27,
        description: `The value for zone 1`,
        value: null
    }

    zone2 = {
        byteNumber: 59,
        fieldSize: 27,
        description: `The value for zone 1`,
        value: null
    }

    zone3 = {
        byteNumber: 86,
        fieldSize: 27,
        description: `The value for zone 1`,
        value: null
    }

    zone4 = {
        byteNumber: 113,
        fieldSize: 27,
        description: `The value for zone 1`,
        value: null
    }

    zone5 = {
        byteNumber: 140,
        fieldSize: 27,
        description: `The value for zone 1`,
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

    getZone(zoneNumber) {
        switch (zoneNumber) {
            case 1: return this.zone1;
            case 2: return this.zone2;
            case 3: return this.zone3;
            case 4: return this.zone4;
            case 5: return this.zone5;
        }
    }

    getOverview() {
        ;
    }

    get() {
        const data = {
            ...this,
            zone1: this.getZone(1),
            zone2: this.getZone(2),
            zone3: this.getZone(3),
            zone4: this.getZone(4),
            zone5: this.getZone(5),
        }

        return data;
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


    getPayload() {

        let data = this.getRawData();
        let s = data.substring(14, data.length);
        return s;
    }


}
module.exports = GetUserConfigReply;
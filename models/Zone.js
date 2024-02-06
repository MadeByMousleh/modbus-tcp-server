
class Zone {

    zoneCommonFunc1 = {
        byteNumber: 0,
        fieldSize: 1,
        description: "See section 4.2.6 for a detailed descr.",
        value: null,
    }

    onOffFunc2 = {
        byteNumber: 1,
        fieldSize: 1,
        description: "See section 4.2.6 for a detailed descr.",
        value: null,
    }

    daliFunc1 = {
        byteNumber: 2,
        fieldSize: 1,
        description: "See section 4.2.6 for a detailed descr.",
        value: null,
    }

    tOffPirDelay = {
        byteNumber: 3,
        fieldSize: 2,
        description: `Range (1..65535) sec., Default: 15min
        States the Off-Delay duration.
        See section 4.2.1 for a detailed description of this field.
        `,
        value: null,
    };


    tPresenceDelay = {
        byteNumber: 5,
        fieldSize: 2,
        description: `Range (1..65535) sec, Default: 15min
        States the Presence-delay duration during 2-level control.
        See section 4.2.1 for a detailed description of this field.
        `,
        value: null,
    };


    tNonPresenceDelay = {
        byteNumber: 7,
        fieldSize: 2,
        description: `Range (1..65535) sec., Default:65535
        States the Non presence-delay duration during 2-level control.
        See section 4.2.1 for a detailed description of this field.
        `,
        value: null,
    };


    tOrientationDelay = {
        byteNumber: 9,
        fieldSize: 2,
        description: `Range (0..65535) sec., Default: 10min
        States the Orientation light Period.
        `,
        value: null,
    };

    tOnDelay = {
        byteNumber: 11,
        fieldSize: 2,
        description: `Range (0..3600) sec.
        States the delay after movement detection.
        0   sec (no delay)
        60  sec
        120 sec
        180 sec
        240 sec
        300 sec
        `,
        value: null,
    };


    type = {
        byteNumber: 13,
        fieldSize: 1,
        description: `Range (0..4) enum.
        Indicates the zone type.
        0=Zone not used (disabled)
        1=DLZ (Daylight zone)
        2=SEZ (Secondary zone / OnOff zone)
        3=MUZ (Multi zone)
        4=HVAC (HVAC Control. OnOff Sensors
        `,
        value: null,
    };

    reserved = {
        byteNumber: 14,
        fieldSize: 1,
        description: `Not Used`,
        value: null,
    };

    deskDaylightFactorPct = {
        byteNumber: 15,
        fieldSize: 2,
        description: `Range (0..1000) %`,
        value: null,
    };

    deskMaxArtificialLight = {
        byteNumber: 17,
        fieldSize: 2,
        description: `Range (1..2000) Lux`,
        value: null,
    };

    vSetpoint = {
        byteNumber: 19,
        fieldSize: 2,
        description: `Range (0..65535) Lux
        States the Lux set point.
        See section 4.2.2 for a detailed description of accepted lux values.
        `,
        value: null,
    };

    daylight = {
        byteNumber: 21,
        fieldSize: 2,
        description: `Range (0..65535) Lux`,
        value: null,
    };

    presenceLevel = {
        byteNumber: 23,
        fieldSize: 1,
        description: `Range (0..100) % 
        States the lux level (in %) for presence in the 2-Level function.
        See section 4.2.2 for a detailed description of accepted lux values.
        `,
        value: null,
    };

    nonPresenceLevel = {
        byteNumber: 24,
        fieldSize: 1,
        description: `Range (0..100) %
        States the lux level (in %)for non-presence in the 2-Level function.
        `,
        value: null,
    };

    orientationLevel = {
        byteNumber: 25,
        fieldSize: 1,
        description: `Range (0..100) %
        States the lux level (in %) for orientation light.
        Not in Zone 5.
        `,
        value: null,
    };

    turnOnLevel = {
        byteNumber: 26,
        fieldSize: 1,
        description: `Range (1..100) %,  default:100
        Not in Zone 5.
        `,
        value: null,
    };

    constructor(hexValue) {
        // console.log(hexValue, 'START')
        Object.entries(this).forEach((currentProp) => {
            currentProp[1].value = this.getValueFromReply(currentProp[1], hexValue)
        })
    }

    getValueFromReply(field, hexValue) {
        // console.log(reply, 'reply')
        let start = field.byteNumber * 2;
        let end = (field.fieldSize * 2) + start;
        let value = `0x${hexValue.slice(start, end).match(/[a-fA-F0-9]{2}/g).reverse().join('')}`;

        return Number(value);
    }

    getRawData() {
        let hexVal = "";

        for (const [_, propValue] of Object.entries(this)) {
            const {fieldSize, value} = propValue;
            if(value !== undefined)
            {
                hexVal += value.toString(16).padStart(fieldSize * 2, '0').toUpperCase().match(/[a-fA-F0-9]{2}/g).reverse().join('');
            }
          }

        return hexVal;
    }

    getPropData()
    {

    }

    get() {
        return this;
    }

    set(zone) {
        Object.assign(this, zone);
        return this;
    }


    setOffPirTimer(val)
    {
        this.tOffPirDelay.value = val;
    }

    getOffPirTimer()
    {
        return this.tOffPirDelay.value;
    }
}

module.exports = Zone;
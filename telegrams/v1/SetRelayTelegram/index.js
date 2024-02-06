const TelegramHelper = require('../../TelegramHelper.js');



 class SetRelayTelegram  {

    protocolVersion;
    telegramType;
    totalLength;
    // crc16: number;
    payload;

    telegramHelper = new TelegramHelper();
    
    constructor(payload) {
        this.telegramHelper = new TelegramHelper();
        this.protocolVersion =  this.telegramHelper.createProtocolVersion(0x01);
        this.telegramType = this.telegramHelper.createTelegramType(0x0107);
        this.totalLength = this.telegramHelper.createTotalLength(0x0009);
        this.payload = Uint8Array.from(payload)
    }

     create()
    {
        return this.telegramHelper.createTelegram(this)
    }
}

module.exports = SetRelayTelegram;


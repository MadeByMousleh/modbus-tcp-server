const TelegramHelper = require("../../TelegramHelper");



class LoginTelegram  {

    protocolVersion;
    telegramType;
    totalLength;
    // crc16: number;
    payload;

    telegramHelper = new TelegramHelper();
    
    constructor() {
        this.telegramHelper = new TelegramHelper();
        this.protocolVersion =  this.telegramHelper.createProtocolVersion(0x01);
        this.telegramType = this.telegramHelper.createTelegramType(0x0010);
        this.totalLength = this.telegramHelper.createTotalLength(0x0009);
        this.payload = Uint8Array.from([0x01, 0x1D])
        // this.crc16 = this.telegramHelper.createCrc16(0x95FB);
    }

     create()
    {
        return this.telegramHelper.createTelegram(this)
    }
}

module.exports = LoginTelegram;


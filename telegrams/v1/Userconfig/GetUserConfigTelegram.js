const TelegramHelper = require("../../TelegramHelper");

 class GetUserConfigTelegram  {

    totalBytes = 7;
    
    protocolVersion;
    telegramType;
    totalLength;
    payload;
    telegramHelper = new TelegramHelper();
    
    constructor() {
        this.protocolVersion =  this.telegramHelper.createProtocolVersion(0x01);
        this.telegramType = this.telegramHelper.createTelegramType(0x010B);
        this.totalLength = this.telegramHelper.createTotalLength(0x0007);
        this.payload = Uint8Array.from([]);
    }

     create()
    {
        return this.telegramHelper.createTelegram(this)
    }
}

module.exports = GetUserConfigTelegram;
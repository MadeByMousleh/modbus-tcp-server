const LoginResult = {
    0: {bleSpecMsg: 'LOGIN NACK', msg:'Login failed', ack: false, pincodeRequired: false},
    1: {bleSpecMsg: 'LOGIN ACK. No pincode required', msg:'Login succeeded', ack: true, pincodeRequired: false},
    2: {bleSpecMsg: 'LOGIN ACK. Pincode Required', msg:'A pincode is required to be able to login to the detector', ack: true, pincodeRequired: true},
    3: {bleSpecMsg: 'Login.Ack. Open Period Active. No Pincode Required.', msg:'Open period is currently active', ack: false, pincodeRequired: false}
}

class LoginTelegramReply {
    protocolVersion
    telegramType
    totalLength
    crc16
    loginResult

    constructor(reply)
    {
        let {value} = JSON.parse(reply);
        this.protocolVersion = value.slice(0,2);
        this.telegramType = value.slice(2,6);
        this.totalLength = value.slice(6,10);
        this.crc16 = value.slice(10,14);
        this.loginResult = value.slice(14,16);
    }

    swapBytes(bytes)
    {
        return [bytes >> 8, bytes & 0xff];
    }

    getProtocolVersion(){
        return this.protocolVersion;
    }

    getTelegramType(){
        return this.swapBytes(this.telegramType);
    }

    getTotalLength(){
        return this.swapBytes(this.totalLength);
    }

    getCrc16(){
        return this.swapBytes(this.crc16);
    }

    getResult(){

        return LoginResult[+this.loginResult]
    }


}

module.exports = LoginTelegramReply;
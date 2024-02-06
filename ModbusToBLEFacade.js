const LoginTelegram = require('./telegrams/v1/LoginTelegram');
const axios = require('axios');
const EventEmitter = require('events');
const LoginTelegramReply = require('./telegrams/v1/LoginTelegram/LoginTelegramReply');
const GetUserConfigTelegram = require('./telegrams/v1/Userconfig/GetUserConfigTelegram');
const GetUserConfigReply = require('./telegrams/v1/Userconfig/GetUserConfigReply');
const Zone = require('./models/Zone');
const SetRelayTelegram = require('./telegrams/v1/SetRelayTelegram');
const SetRelayTelegramReply = require('./telegrams/v1/SetRelayTelegram/SetRelayTelegramReply');


class ModbusToBLEFacade {

    replyEmitter = new EventEmitter();
    dataEmitter = new EventEmitter();
    replyName = 'reply';

    eventSourceUrl = 'http://192.168.0.29/gatt/nodes?event=1';


    constructor(hostname, port, gatewayMac) {
        this.hostname = hostname;
        this.port = port;
        this.gatewayMac = gatewayMac;

        this.replyName = 'reply';

        this.replyEmitter.setMaxListeners(2);

        this.dataEmitter.setMaxListeners(2);


        axios.get(this.eventSourceUrl, { responseType: 'stream' })

            .then((response) => {

                let stream = response.data;

                stream.on('data', chunk => {

                    const chunkStr = chunk.toString();

                    if (!chunkStr.includes(':keep-alive')) {
                        let data = chunkStr.split('data:')[1];

                        this.replyEmitter.emit(this.replyName, data)
                    }

                })

                response.data.on('end', () => {
                });

            })

            .catch((error) => {
                console.error('Axios error:', error);
            });
    }


    subscribeOnce = (event, cb) => {
        this.replyName = event;
        this.replyEmitter.once(event, (e) => cb(e))
    }

    unsubscribe = () => {
        this.replyEmitter.removeAllListeners();
    }

    async isConnected(mac) {

        let getConnectionListRequest = await axios(`${process.env.HOST}/gap/nodes?connection_state=connected`, {
            method: 'GET'
        })

        if (getConnectionListRequest.status === 200) {

            let connectedDevices = getConnectionListRequest.data.nodes;

            if (Array.isArray(connectedDevices)) {

                let result = connectedDevices.find(node => node.id === mac);

                if (result) return true;

            }

            return false;

        }
        return false;
    }

    async connectToDetector(host, mac, cb) {

        if (!mac) throw new Error('Mac should be supplied');

        const connectResult = await axios(`http://${host}/gap/nodes/${mac}/connection`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })

        if (connectResult.status === 200) {

            const loginTelegram = new LoginTelegram().create();

            let loginResult = await axios(`http://192.168.0.29/gatt/nodes/${mac}/handle/19/value/${loginTelegram}?noresponse=1`);

            if (loginResult.status === 200) {

                this.subscribeOnce('replyLogin', (data) => {

                    const loginTelegramReply = new LoginTelegramReply(data);

                    let reply = loginTelegramReply.getResult();

                    if (reply) {

                        if (reply.ack) {

                            cb(reply.ack);

                            this.unsubscribe();


                        }

                    }

                })

            }

        }
    }


    async connectToDevice(mac, cb) {

        if (!mac) throw new Error('Mac should be supplied');

        
        let isConnected = await this.isConnected(mac);

        if(isConnected)
        {
            return cb(true);
        }


        const connectResult = await axios(`${process.env.HOST}/gap/nodes/${mac}/connection`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })

        if (connectResult.status === 200) {

            const loginTelegram = new LoginTelegram().create();

            let loginResult = await axios(`${process.env.HOST}/gatt/nodes/${mac}/handle/19/value/${loginTelegram}?noresponse=1`);

            if (loginResult.status === 200) {

                this.subscribeOnce('replyLogin', (data) => {

                    const loginTelegramReply = new LoginTelegramReply(data);

                    let reply = loginTelegramReply.getResult();

                    if (reply) {

                        this.unsubscribe();

                        cb(reply.ack);

                    }

                })

            }

        }
    }

    async disconnectFromDevice(mac) {
        if (!mac) throw new Error('Mac should be supplied');


        const disconnectResult = await axios(`${process.env.HOST}/gap/nodes/${mac}/connection`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        })

        if (disconnectResult.status === 200) {
            return true;
        }

        return false;
    }

    async getZoneOneLux(mac, cb) {

        const getUserConfigTelegram = new GetUserConfigTelegram().create();

        let userConfigReq = await axios(`http://192.168.0.29/gatt/nodes/${mac}/handle/19/value/${getUserConfigTelegram}?noresponse=1`, {
            method: 'GET'
        })

        if (userConfigReq.status === 200) {
            this.subscribeOnce('getUserConfig', (data) => {

                const getUserConfigReply = new GetUserConfigReply(data);

                if (getUserConfigReply) {

                    this.unsubscribe();

                    let zone = new Zone(getUserConfigReply.get().zone1.value)
                    cb(zone.vSetpoint.value);
                }
            })


        }

    }

    async turnOnChannel(output, channel, mac, cb) {

        const setRelayTelegram = new SetRelayTelegram([output, channel]).create();

        console.log(setRelayTelegram);

        let setRelayTelegramRequest = await axios(`${process.env.HOST}/gatt/nodes/${mac}/handle/19/value/${setRelayTelegram}?noresponse=1`, {
            method: 'GET'
        })

        if (setRelayTelegramRequest.status === 200) {

            this.subscribeOnce('setRelayTelegram', (data) => {

                const setRelayTelegramReply = new SetRelayTelegramReply(data);

                if (setRelayTelegramReply.isAccepted()) {

                    this.unsubscribe();

                    cb(setRelayTelegramReply.isAccepted());
                }
            })


        }
    }

    async handle(command, mac, cb) {


        switch (command) {


            // case 10001:
            //     {

            //         this.connectToDevice(mac, isConnected => {
            //             if (isConnected) {
            //                 this.turnOnChannel(1, 1, mac, reply => {

            //                     if (reply) {
            //                     }

            //                 });
            //             }
            //         });



            //         break;
            //     }

            case 30002:
                {

                    this.connectToDetector(this.hostname, mac, (isConnected) => {

                        if (isConnected) {
                            this.getZoneOneLux(mac, (data) => {
                                let buffer = Buffer.alloc(2);
                                buffer.writeInt16BE(data, 0);
                                cb(buffer);
                            })
                        }
                    });
                }
        }
    }

    setCoil(output, address, mac, callback) {

        switch (address) {

            case 1: {

                let channel = 1;
                let onOrOff = output === 255;                
                this.connectToDevice(mac, isConnected => {

                    if (isConnected) {
                        
                        this.turnOnChannel(onOrOff, channel, mac, reply => {
                            
                            if (reply) {
                                return callback(true)
                            }
                 
                        });

                    }

                   return  callback(false)
                });

                break;
            }

            case 2: {

                this.connectToDevice(mac, isConnected => {

                    if (isConnected) {

                        this.turnOnChannel(2, output, mac, reply => {

                            if (reply) {


                            }

                        });
                    }
                });

                break;
            }
        }

    }

}

module.exports = ModbusToBLEFacade;
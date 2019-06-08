const { EventEmitter } = require('events')
const { timestamp } = require('./util/util')
const FIXParserBase = require('./FIXParserBase')
const FIXParserClientSocket = require('./handler/FIXParserClientSocket')
const FIXParserClientWebsocket = require('./handler/FIXParserClientWebsocket')
const Field = require('./fields/Field')
const { Message } = require('./message/Message')
const Messages = require('./constants/ConstantsMessage')
const Fields = require('./constants/ConstantsField')
const Side = require('./constants/ConstantsSide')
const OrderTypes = require('./constants/ConstantsOrderTypes')
const HandlInst = require('./constants/ConstantsHandlInst')
const TimeInForce = require('./constants/ConstantsTimeInForce')
const EncryptMethod = require('./constants/ConstantsEncryptMethod')

const PROTOCOL_TCP = 'tcp';
const PROTOCOL_WEBSOCKET = 'websocket';

class FIXParser extends EventEmitter {
    constructor() {
        super();
        this.fixParserBase = new FIXParserBase();
        this.clientHandler = null;
        this.host = null;
        this.port = null;
        this.sender = null;
        this.target = null;
        this.messageSequence = 1;
        this.heartBeatInterval = null;
        this.heartBeatIntervalId = null;
        this.fixVersion = 'FIX.5.0SP2';
    }

    connect({
        host = 'localhost',
        port = '9878',
        protocol = PROTOCOL_TCP,
        sender = 'SENDER',
        target = 'TARGET',
        heartbeatIntervalMs = 30000,
        fixVersion = this.fixVersion
    } = {}) {
        switch (protocol) {
            case PROTOCOL_TCP:
                this.clientHandler = new FIXParserClientSocket(this, this);
                break;
            case PROTOCOL_WEBSOCKET:
                this.clientHandler = new FIXParserClientWebsocket(this, this);
                break;
            default:
                console.error(
                    'FIXParser: could not connect, no protocol specified'
                );
        }
        this.fixVersion = fixVersion;
        this.clientHandler.host = host;
        this.clientHandler.port = port;
        this.clientHandler.sender = sender;
        this.clientHandler.target = target;
        this.clientHandler.heartBeatInterval = heartbeatIntervalMs;
        this.clientHandler.fixVersion = this.fixVersion;
        this.clientHandler.connect();
    }

    getNextTargetMsgSeqNum() {
        return this.messageSequence;
    }

    setNextTargetMsgSeqNum(nextMsgSeqNum) {
        this.messageSequence = nextMsgSeqNum;
        return this.messageSequence;
    }

    getTimestamp(dateObject = new Date()) {
        return timestamp(dateObject);
    }

    createMessage(...fields) {
        return new Message(this.fixVersion, ...fields);
    }

    parse(data) {
        return this.fixParserBase.parse(data);
    }

    send(message) {
        this.clientHandler.send(message);
    }
}

module.exports = {
    FIXParser,
    Field,
    Fields,
    Message,
    Messages,
    Side,
    OrderTypes,
    HandlInst,
    TimeInForce,
    EncryptMethod
}

const { EventEmitter } = require('events')

const Messages = require('../constants/ConstantsMessage')
const Fields = require('../constants/ConstantsField')
const Field = require('../fields/Field')

class FIXParserClientBase extends EventEmitter {
    constructor(eventEmitter, parser) {
        super();
        this.eventEmitter = eventEmitter;
        this.fixParser = parser;
        this.host = null;
        this.port = null;
        this.client = null;
        this.socket = null;
        this.sender = null;
        this.target = null;
        this.heartBeatInterval = null;
        this.heartBeatIntervalId = null;
    }

    stopHeartbeat() {
        clearInterval(this.heartBeatIntervalId);
    }

    startHeartbeat() {
        this.stopHeartbeat();
        const sendHeartbeat = () => {
            const heartBeat = this.fixParser.createMessage(
                new Field(Fields.MsgType, 0),
                new Field(
                    Fields.MsgSeqNum,
                    this.fixParser.getNextTargetMsgSeqNum()
                    ),
                    new Field(Fields.SenderCompID, this.sender),
                    new Field(Fields.SendingTime, this.fixParser.getTimestamp()),
                    new Field(Fields.TargetCompID, this.target)
                    );
            console.log('[Heartbeat] ', new Date());
            this.send(heartBeat);
        }
        this.heartBeatIntervalId = setInterval(sendHeartbeat, this.heartBeatInterval);
    }

    processMessage(message) {
        if (message.messageType === Messages.SequenceReset) {
            const newSeqNo = (this.fixParser.getField(Fields.NewSeqNo) || {})
                .value;
            if (newSeqNo) {
                console.log(
                    `[${Date.now()}] FIXClient new sequence number ${newSeqNo}`
                );
                this.fixParser.setNextTargetMsgSeqNum(newSeqNo);
            }
        }
        // console.log(
        //     `[${Date.now()}] FIXClient received message ${message.description}`
        // );
    }
}

module.exports = FIXParserClientBase

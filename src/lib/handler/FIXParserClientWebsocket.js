const WebSocket = require('ws')

const FIXParserClientBase = require('./FIXParserClientBase')
const Message = require('../message/Message')

class FIXParserClientWebsocket extends FIXParserClientBase {
    connect() {
        const connectionString =
            this.host.indexOf('ws://') === -1 &&
            this.host.indexOf('wss://') === -1
                ? `ws://${this.host}:${this.port}`
                : `${this.host}:${this.port}`;

        this.socket = new WebSocket(connectionString);

        this.socket.on('open', () => {
            console.log('Connected');
            this.eventEmitter.emit('open');
            this.startHeartbeat();
        });

        this.socket.on('message', (data) => {
            const messages = this.fixParser.parse(data.toString());
            let i = 0;
            for (i; i < messages.length; i++) {
                this.processMessage(messages[i]);
                this.eventEmitter.emit('message', messages[i]);
            }
        });

        this.socket.on('close', () => {
            this.eventEmitter.emit('close');
            this.stopHeartbeat();
        });
    }

    close() {
        this.socket.close();
    }

    send(message) {
        if (this.socket.readyState === WebSocket.OPEN) {
            if (message instanceof Message) {
                this.fixParser.setNextTargetMsgSeqNum(
                    this.fixParser.getNextTargetMsgSeqNum() + 1
                );
                this.socket.send(message.encode());
            } else {
                console.error(
                    'FIXParser: could not send message, message of wrong type'
                );
            }
        } else {
            console.error(
                'FIXParser: could not send message, socket not open',
                message
            );
        }
    }
}

module.exports = FIXParserClientWebsocket

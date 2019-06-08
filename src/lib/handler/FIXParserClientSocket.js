const { Socket } = require('net')

const FIXParserClientBase = require('./FIXParserClientBase')
const FrameDecoder = require('../util/FrameDecoder')
const { Message } = require('../message/Message')

class FIXParserClientSocket extends FIXParserClientBase {
    connect() {
        console.log('Called Connect function..');
        this.socket = new Socket();
        this.socket.setEncoding('ascii');
        this.socket.pipe(new FrameDecoder()).on('data', (data) => {
            console.log(`--------------GOT PIPE DATA = ${JSON.stringify(data)}`);
            const messages = this.fixParser.parse(data.toString());
            let i = 0;
            for (i; i < messages.length; i++) {
                this.processMessage(messages[i]);
                this.eventEmitter.emit('message', messages[i]);
            }
        });
        this.socket.on('close', () => {
            console.log('Emitted Closed');
            this.eventEmitter.emit('close');
            this.stopHeartbeat();
        });

        this.socket.on('error', (error) => {
            console.log('Error: ', error);
            this.eventEmitter.emit('error', error);
            this.stopHeartbeat();
        });

        this.socket.on('timeout', () => {
            console.log('Timed Out');
            this.eventEmitter.emit('timeout');
            this.socket.end();
            this.stopHeartbeat();
        });

        this.socket.connect(
            this.port,
            this.host,
            () => {
                console.log('Connected', this.socket.readyState, `Port=${this.port} host=${this.host}`);
                if (this.socket.readyState === 'open') {
                    this.eventEmitter.emit('open');
                    this.startHeartbeat();
                }
            }
        );
    }

    close() {
        this.socket.close();
    }

    send(message) {
        if (this.socket.readyState === 'open') {
            if (message instanceof Message) {
                this.fixParser.setNextTargetMsgSeqNum(
                    this.fixParser.getNextTargetMsgSeqNum() + 1
                );
                console.log(`Sending message Encoded = ${JSON.stringify(message.encode())}`);

                // this.socket.write(message.encode());
                this.socket.write(message.encode());
            } else {
                console.error(
                    'FIXParserClientSocket: could not send message, message of wrong type'
                );
            }
        } else {
            console.error(
                'FIXParserClientSocket: could not send message, socket not open',
                message
            );
        }
    }
}

module.exports = FIXParserClientSocket
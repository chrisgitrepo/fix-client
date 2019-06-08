const prebuiltMap = require('../prebuild/built/MessageContents.prebuilt.json')

class MessageContents {
    constructor() {
        this.cacheMap = new Map();
        Object.entries(prebuiltMap).forEach((pair) =>
            this.cacheMap.set(pair[0], pair[1])
        );
    }

    processMessageContents(message, componentId) {
        const messageContents = this.cacheMap.get(componentId);
        if (messageContents) {
            message.setMessageContents(messageContents);
        }
    }
}


module.exports = { MessageContents }
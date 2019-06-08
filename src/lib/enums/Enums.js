const { ENUMS } = require('../spec/SpecEnums')
const { EnumType } = require('./EnumType')

class Enums {
    constructor() {
        this.enums = ENUMS;
        this.cacheMap = new Map();
        this.enums.forEach((enumType) => {
            this.cacheMap.set(`${enumType.Tag}|${enumType.Value}`, enumType);
        });
        this.enumType = null;
    }

    getEnum(tag, value) {
        return this.cacheMap.get(`${tag}|${value}`);
    }

    processEnum(field) {
        this.enumType = new EnumType();
        const enumType = this.cacheMap.get(`${field.tag}|${field.value}`);
        if (enumType) {
            this.enumType.setEnumeration(enumType);
            field.setEnumeration(this.enumType);
        }
    }
}

module.exports = { Enums }

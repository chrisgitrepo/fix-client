const { Message } = require('../message/Message');

const SOH = '\x01';
const STRING_EQUALS = '=';
const RE_ESCAPE = /[.*+?^${}()|[\]\\]/g; // eslint-disable-line no-useless-escape
const RE_FIND = /8=FIXT?\.\d\.\d([^\d]+)/i;

const groupBy = (xs, key) =>
    xs.reduce((rv, x) => {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});

const adjustForTimezone = (date) => {
    const timeOffsetInMS = date.getTimezoneOffset() * 60000;
    date.setTime(date.getTime() + timeOffsetInMS);
    return date;
};

const timestamp = (dateObject) => {
    if (isNaN(dateObject.getTime())) {
        console.error('Invalid date specified!');
    }
    const date = adjustForTimezone(dateObject);
    return `${date.getFullYear()}${Message.pad(
        date.getMonth() + 1,
        2
    )}${Message.pad(date.getDate(), 2)}-${Message.pad(
        date.getHours(),
        2
    )}:${Message.pad(date.getMinutes(), 2)}:${Message.pad(
        date.getSeconds(),
        2
    )}.${Message.pad(date.getMilliseconds(), 3)}`;
};

module.exports = {
    SOH,
    STRING_EQUALS,
    RE_ESCAPE,
    RE_FIND,
    groupBy,
    adjustForTimezone,
    timestamp
}
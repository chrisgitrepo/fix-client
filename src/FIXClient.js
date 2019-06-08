const forexSymbols = require('./lib/config')
const {
  FIXParser,
  Field,
  Fields,
  Messages,
  Side,
  OrderTypes,
  HandlInst,
  TimeInForce,
  EncryptMethod
} = require('./lib/FIXParser');

class FIXClient {
  constructor({ connection, account }) {
    const { fixVersion, host, port, sender, target } = connection
    this.account = account
    this.fixVersion = fixVersion
    this.host = host
    this.port = port
    this.sender = sender
    this.target = target
    this.parser = new FIXParser()
    this.parser.connect(connection);
  }

  standardHeader(msgType) {
    return [
      new Field(Fields.MsgType, msgType), // 35
      new Field(Fields.SenderCompID, this.sender), // 49
      new Field(Fields.TargetCompID, this.target), // 56
      new Field(Fields.TargetSubID, this.type), // 57
      new Field(Fields.MsgSeqNum, this.parser.getNextTargetMsgSeqNum()), // 34
      new Field(Fields.SendingTime, this.parser.getTimestamp()), // 52
    ]
  }

  sendLogon(type) {
    console.log('LOGGED IN');
    this.type = type
    const logon = this.parser.createMessage(
      ...standardHeader(Messages.Logon),
      new Field(Fields.EncryptMethod, EncryptMethod.None), // 98
      new Field(Fields.HeartBtInt, '30'), // 108
      new Field(Fields.ResetSeqNumFlag, 'Y'), // 141
      new Field(Fields.Username, this.account.number), // 553
      new Field(Fields.Password, this.account.password), // 554
    );
    const messages = this.parser.parse(logon.encode());
    console.log('sending message', messages[0].description, messages[0].string.replace(/\x01/g, '|'));
    this.parser.send(logon);
  }

  createOrder({ symbol, orderQty }) {
    const fixSymbolID = forexSymbols.find(e => e.symbol === symbol).fixSymbolID
    console.log(`fixSymbolID = ${fixSymbolID}`);
    const order = this.parser.createMessage(
      ...standardHeader(Messages.NewOrderSingle),
      new Field(Fields.ClOrdID, '1234'),
      new Field(Fields.Symbol, fixSymbolID),
      new Field(Fields.Side, Side.Buy),
      new Field(Fields.TransactTime, parser.getTimestamp()),
      new Field(Fields.OrderQty, orderQty),
      new Field(Fields.OrdType, OrderTypes.Market),
    );
    const messages = this.parser.parse(order.encode());
    console.log('sending message', messages[0].description, messages[0].string.replace(/\x01/g, '|'));
    this.parser.send(order);
  }

  sendLogout() {
    const logout = parser.createMessage(
      ...standardHeader(Messages.Logout),
    );
    const messages = parser.parse(logout.encode());
    console.log('sending LOGOUT message', messages[0].description, messages[0].string.replace(/\x01/g, '|'));
    parser.send(logout);
  }
}

module.exports = FIXClient

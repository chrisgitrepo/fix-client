const configUtils = require('./lib/config')
const {
  FIXParser,
  Field,
  Fields,
  Messages,
  Side,
  OrderTypes,
  EncryptMethod
} = require('./lib/FIXParser');

class FIXClient {
  constructor({
    fixVersion,
    host,
    port,
    sender,
    target,
    accountID,
    accountPassword
  }, type) {
    this.connection = { fixVersion, host, port, sender, target }
    this.sender = sender
    this.target = target
    this.accountID = accountID
    this.accountPassword = accountPassword
    this.type = type
    this.parser = new FIXParser()
  }

  static generateResponseObj(message) {
    const invertedConstantsFields =
      Object.entries(Fields).reduce((acc, [name, number]) => ({ ...acc, [number]: name }), {})

    const responseObj = message.string.split('\x01').reduce((acc, curr) => {
      const splitField = curr.split('=')
      const firstCharLowercase = string => string && string[0].toLowerCase() + string.slice(1)
      const key = firstCharLowercase(invertedConstantsFields[splitField[0]])
      const value = splitField[1]

      if (!key) return acc

      return { ...acc, [key]: value }
    }, {})
    return responseObj
  }

  static processSecurityListRequest(message) {
    let index = 0
    const securityList = []

    message.string.split('\x01').forEach(fixItem => {
      const [key, value] = fixItem.split('=')
      if (key === '55') {
        securityList[index] = { fixSymbolID: value }
      }
      if (key === '1007') {
        securityList[index].symbol = `${value.slice(0, 3)}/${value.slice(3, 6)}`
        index++
      }
    })
    return securityList
  }

  static formatSenderSubID({ targetSubID }) {
    const [s, ...tring] = targetSubID.toLowerCase()
    const senderSubID = [s.toUpperCase(), ...tring].join('')
    return senderSubID
  }

  static isNotBuyOrSell(direction) {
    return (direction !== 'BUY' && direction !== 'SELL')
  }

  static newOrderValues({ executionReport, currentFIXPosition }) {
    if (executionReport) {
      const {
        side,
        orderQty,
        leavesQty,
        posMaintRptID
      } = FIXClient.generateResponseObj(executionReport)
      return { side, orderQty, leavesQty, posMaintRptID }

    } else if (currentFIXPosition) {
      const { longQty, shortQty, posMaintRptID } = currentFIXPosition
      const {
        side,
        orderQty
      } = configUtils.getDirectionAndOrderQty({ longQty, shortQty })
      return { side, orderQty, leavesQty: '0', posMaintRptID }

    } else {
      console.error(`ERROR. Please provide executionReport or currentFIXPosition to sendStopOrder()`);
    }
  }

  connect() {
    this.parser.connect(this.connection);
  }

  uniqueClientID(symbolDirection) {
    return symbolDirection
      ? `${symbolDirection.symbol}-${symbolDirection.direction}-${this.parser.getTimestamp()}`
      : `emsstrad-client-id-${this.parser.getTimestamp()}`
  }

  standardHeader(msgType) {
    return [
      new Field(Fields.MsgType, msgType), // 35
      new Field(Fields.SenderCompID, this.sender), // 49
      new Field(Fields.TargetCompID, this.target), // 56
      new Field(Fields.MsgSeqNum, this.parser.getNextTargetMsgSeqNum()), // 34
      new Field(Fields.SendingTime, this.parser.getTimestamp()), // 52
      new Field(Fields.SenderSubID, FIXClient.formatSenderSubID({ targetSubID: this.type })), // 50
      new Field(Fields.TargetSubID, this.type), // 57
    ]
  }

  sendLogon() {
    const logon = this.parser.createMessage(
      ...this.standardHeader(Messages.Logon),
      new Field(Fields.EncryptMethod, EncryptMethod.None), // 98
      new Field(Fields.HeartBtInt, '30'), // 108
      new Field(Fields.ResetSeqNumFlag, 'Y'), // 141
      new Field(Fields.Username, this.accountID), // 553
      new Field(Fields.Password, this.accountPassword), // 554
    );
    // const messages = this.parser.parse(logon.encode());
    // console.log('[FIX] SENDING ', messages[0].description, FIXClient.generateResponseObj(messages[0]));
    this.parser.send(logon);
  }

  sendLogout() {
    const logout = this.parser.createMessage(
      ...this.standardHeader(Messages.Logout),
    );
    this.parser.send(logout);
  }

  sendNewOrder({ securityObj, orderQty, direction, posMaintRptID }) {
    const { symbol, fixSymbolID } = securityObj
    if (FIXClient.isNotBuyOrSell(direction)) {
      console.error(`Direction not valid for ${symbol}, Trade Rejected`)
      return
    }
    const clientID = this.uniqueClientID({ symbol, direction })

    const newOrderFields = [
      ...this.standardHeader(Messages.NewOrderSingle),
      new Field(Fields.ClOrdID, clientID),
      new Field(Fields.Symbol, fixSymbolID),
      new Field(Fields.Side, configUtils.getFixIdFromDirection(direction)),
      new Field(Fields.TransactTime, this.parser.getTimestamp()),
      new Field(Fields.OrderQty, orderQty),
      new Field(Fields.OrdType, OrderTypes.Market),
    ]
    if (posMaintRptID) {
      newOrderFields.push(new Field(Fields.PosMaintRptID, posMaintRptID))
    }
    const order = this.parser.createMessage(...newOrderFields)
    this.parser.send(order);
    return clientID
  }

  sendStopOrder({ securityObj, executionReport, currentFIXPosition, stopPx }) {
    const { symbol, fixSymbolID } = securityObj

    const {
      side,
      orderQty,
      leavesQty,
      posMaintRptID
    } = FIXClient.newOrderValues({ executionReport, currentFIXPosition })

    const invertedSide = side === Side.Buy ? Side.Sell : Side.Buy
    const sideToExecute = leavesQty === '0' ? invertedSide : side
    const clientID = this.uniqueClientID({
      symbol,
      direction: configUtils.getDirectionfromFixId(sideToExecute)
    })

    const order = this.parser.createMessage(
      ...this.standardHeader(Messages.NewOrderSingle),
      new Field(Fields.ClOrdID, clientID),
      new Field(Fields.Symbol, fixSymbolID),
      new Field(Fields.Side, sideToExecute),
      new Field(Fields.TransactTime, this.parser.getTimestamp()),
      new Field(Fields.OrderQty, orderQty),
      new Field(Fields.OrdType, OrderTypes.Stop),
      new Field(Fields.PosMaintRptID, posMaintRptID),
      new Field(Fields.StopPx, stopPx),
    );
    this.parser.send(order);
    return clientID
  }

  requestForPositions() {
    const clientID = this.uniqueClientID()
    const order = this.parser.createMessage(
      ...this.standardHeader(Messages.RequestForPositions),
      new Field(Fields.PosReqID, clientID)
    );
    this.parser.send(order);
    return clientID
  }

  orderMassStatusRequest() {
    const clientID = this.uniqueClientID()
    const order = this.parser.createMessage(
      ...this.standardHeader(Messages.OrderMassStatusRequest),
      new Field(Fields.MassStatusReqID, clientID),
      new Field(Fields.MassStatusReqType, 7),
    );
    this.parser.send(order);
    return clientID
  }

  orderCancelRequest(origClOrdID) {
    const clientID = this.uniqueClientID()
    const order = this.parser.createMessage(
      ...this.standardHeader(Messages.OrderCancelRequest),
      new Field(Fields.OrigClOrdID, origClOrdID),
      new Field(Fields.ClOrdID, clientID),
    );
    this.parser.send(order);
    return clientID
  }

  securityListRequest() {
    const clientID = this.uniqueClientID()
    const order = this.parser.createMessage(
      ...this.standardHeader(Messages.SecurityListRequest),
      new Field(Fields.SecurityReqID, clientID),
      new Field(Fields.SecurityListRequestType, '0')
    );
    this.parser.send(order);
    return clientID
  }

  marketDataRequest(fixSymbolID) {
    const clientID = this.uniqueClientID()
    const order = this.parser.createMessage(
      ...this.standardHeader(Messages.MarketDataRequest),
      new Field(Fields.MDReqID, clientID),
      new Field(Fields.SubscriptionRequestType, '1'),
      new Field(Fields.MarketDepth, '0'),
      new Field(Fields.NoMDEntryTypes, '2'),
      new Field(Fields.MDEntryType, '0'),
      new Field(Fields.MDEntryType, '1'),
      new Field(Fields.NoRelatedSym, '1'),
      new Field(Fields.Symbol, fixSymbolID)
    );
    this.parser.send(order);
    return clientID
  }
}

module.exports = FIXClient

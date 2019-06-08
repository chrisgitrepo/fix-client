const FIXClient = require('./FIXClient');
const {
  HOST,
  SENDER,
  TARGET,
  PORT,
  ACCOUNT_NUMBER,
  ACCOUNT_PASSWORD
} = process.env

describe('FIXClient', () => {
  it('successfully logs into FIX session', () => {
    const connection = {
      fixVersion: 'FIX.4.4',
      host: HOST,
      port: PORT,
      sender: SENDER,
      target: TARGET
    }
    const account = {
      number: ACCOUNT_NUMBER,
      password: ACCOUNT_PASSWORD
    }
    const fixClient = new FIXClient({ connection, account })

    fixClient.parser.on('open', () => {
      console.log('Open');
      //fixClient.sendLogon('TRADE');
      // fixClient.createOrder('GBP/USD');
      // fixClient.sendLogout();
    });
    fixClient.parser.on('message', (message) => {
      console.log('Received Message: ', message.description, message.string);
    });
    fixClient.parser.on('close', () => {
      console.log('Disconnected');
    });
  })
})

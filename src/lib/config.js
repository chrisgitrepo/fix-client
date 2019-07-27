const directions = {
  'BUY': '1',
  'SELL': '2',
}
const fixSides = {
  '1': 'BUY',
  '2': 'SELL',
}

const getDirectionfromFixId = (fixSideID) =>
  fixSideID === 'BUY' || fixSideID === 'SELL' ? fixSideID : fixSides[fixSideID]

const getFixIdFromDirection = (direction) =>
  direction === '1' || direction === '2' ? direction : directions[direction]

const getDirectionAndOrderQty = ({ longQty, shortQty }) => {
  const longQtyInt = parseInt(longQty)
  const shortQtyInt = parseInt(shortQty)
  const directionAndOrderQty =
    longQtyInt > 0
    && shortQtyInt === 0
    && { side: '1', direction: 'BUY', orderQty: longQtyInt }
    ||
    shortQtyInt > 0
    && longQtyInt === 0
    && { side: '2', direction: 'SELL', orderQty: shortQtyInt }

  return directionAndOrderQty
}

module.exports = {
  getDirectionAndOrderQty,
  getDirectionfromFixId,
  getFixIdFromDirection
}
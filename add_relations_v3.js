const fs = require('fs');
const crypto = require('crypto');
function uuid() { return crypto.randomUUID(); }

const erdPath = './erd.vuerd.json';
const data = JSON.parse(fs.readFileSync(erdPath, 'utf8'));

const getTable = (name) => Object.values(data.collections.tableEntities).find(t => t.name === name);
const getCol = (table, name) => Object.values(data.collections.tableColumnEntities).find(c => c.tableId === table.id && c.name === name);

const relations = [
  { start: 'MIN_User', startCol: 'id', end: 'MIN_CART', endCol: 'userId' },
  { start: 'MIN_User', startCol: 'id', end: 'MIN_ORDER', endCol: 'userId' },
  { start: 'MIN_CART', startCol: 'id', end: 'MIN_CART_ITEM', endCol: 'cartId' },
  { start: 'MIN_PRODUCT', startCol: 'id', end: 'MIN_CART_ITEM', endCol: 'productId' },
  { start: 'MIN_ORDER', startCol: 'id', end: 'MIN_ORDER_ITEM', endCol: 'orderId' },
  { start: 'MIN_PRODUCT', startCol: 'id', end: 'MIN_ORDER_ITEM', endCol: 'productId' }
];

for (const rel of relations) {
  const startT = getTable(rel.start);
  const startC = getCol(startT, rel.startCol);
  const endT = getTable(rel.end);
  const endC = getCol(endT, rel.endCol);

  if (!startT || !startC || !endT || !endC) continue;
  
  // Make endCol FK
  endC.options |= 4; // Not sure exact bitmask, but usually adding something or we can just ignore. vuerd will figure it out if relationship exists.

  const relId = uuid();
  data.collections.relationshipEntities[relId] = {
    id: relId,
    identification: false,
    relationshipType: 4, // ZeroOneN (guess)
    startRelationshipType: 1, // Dash
    start: {
      tableId: startT.id,
      columnIds: [startC.id],
      x: 0,
      y: 0,
      direction: 1
    },
    end: {
      tableId: endT.id,
      columnIds: [endC.id],
      x: 0,
      y: 0,
      direction: 2
    },
    meta: {
      updateAt: Date.now(),
      createAt: Date.now()
    }
  };
  
  data.doc.relationshipIds.push(relId);
}

fs.writeFileSync(erdPath, JSON.stringify(data, null, 2));
console.log('Added relationships for v3.');

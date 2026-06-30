const fs = require('fs');
const crypto = require('crypto');
function uuid() { return crypto.randomUUID(); }

const erdPath = './erd.vuerd.json';
const data = JSON.parse(fs.readFileSync(erdPath, 'utf8'));

const getTable = (name) => data.table.tables.find(t => t.name === name);
const getCol = (table, name) => table.columns.find(c => c.name === name);

const relations = [
  { start: 'MIN_User', startCol: 'id', end: 'MIN_CART', endCol: 'userId' },
  { start: 'MIN_User', startCol: 'id', end: 'MIN_ORDER', endCol: 'userId' },
  { start: 'MIN_CART', startCol: 'id', end: 'MIN_CART_ITEM', endCol: 'cartId' },
  { start: 'MIN_PRODUCT', startCol: 'id', end: 'MIN_CART_ITEM', endCol: 'productId' },
  { start: 'MIN_ORDER', startCol: 'id', end: 'MIN_ORDER_ITEM', endCol: 'orderId' },
  { start: 'MIN_PRODUCT', startCol: 'id', end: 'MIN_ORDER_ITEM', endCol: 'productId' }
];

const newRelations = [];

for (const rel of relations) {
  const startT = getTable(rel.start);
  const startC = getCol(startT, rel.startCol);
  const endT = getTable(rel.end);
  const endC = getCol(endT, rel.endCol);

  if (!startT || !startC || !endT || !endC) {
    console.log('Skipping', rel);
    continue;
  }
  
  // Make endCol FK
  endC.option.notNull = true;
  endC.ui.fk = true;

  newRelations.push({
    id: uuid(),
    identification: false,
    relationshipType: "ZeroOneN",
    startRelationshipType: "Dash",
    start: {
      tableId: startT.id,
      columnIds: [startC.id],
      x: startT.ui.left || 0,
      y: startT.ui.top || 0,
      direction: "bottom"
    },
    end: {
      tableId: endT.id,
      columnIds: [endC.id],
      x: endT.ui.left || 0,
      y: endT.ui.top || 0,
      direction: "top"
    }
  });
}

data.relationship.relationships.push(...newRelations);

// Layout tables nicely
let startX = 50;
let startY = 50;
data.table.tables.forEach((t, i) => {
  t.ui.left = startX + (i % 3) * 300;
  t.ui.top = startY + Math.floor(i / 3) * 300;
});

fs.writeFileSync(erdPath, JSON.stringify(data, null, 2));
console.log('Added relationships.');

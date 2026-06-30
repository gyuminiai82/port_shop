const fs = require('fs');
const crypto = require('crypto');

function uuid() { return crypto.randomUUID(); }

const erdPath = './erd.vuerd.json';
const data = JSON.parse(fs.readFileSync(erdPath, 'utf8'));

function createColumn(name, comment, dataType, isPk = false) {
  return {
    id: uuid(),
    name, comment, dataType, default: isPk ? 'uuid()' : '',
    option: { autoIncrement: false, primaryKey: isPk, unique: false, notNull: true },
    ui: { active: false, pk: isPk, fk: false, pfk: false, widthName: 60, widthComment: 60, widthDataType: 60, widthDefault: 60 }
  };
}

function createTable(name, comment, columns) {
  return {
    id: uuid(),
    name, comment,
    columns,
    ui: { active: false, left: 100 + Math.floor(Math.random() * 400), top: 100 + Math.floor(Math.random() * 400), zIndex: 1, widthName: 60, widthComment: 60 },
    visible: true
  };
}

const tables = [
  createTable('MIN_PRODUCT', '상품 정보', [
    createColumn('id', '상품 고유 번호', 'VARCHAR(191)', true),
    createColumn('name', '상품명', 'VARCHAR(191)'),
    createColumn('price', '가격', 'INTEGER'),
    createColumn('imageUrl', '이미지 URL', 'VARCHAR(191)'),
    createColumn('stock', '재고 수량', 'INTEGER')
  ]),
  createTable('MIN_CART', '장바구니', [
    createColumn('id', '장바구니 고유 번호', 'VARCHAR(191)', true),
    createColumn('userId', '유저 ID', 'VARCHAR(191)')
  ]),
  createTable('MIN_CART_ITEM', '장바구니 상품', [
    createColumn('id', '항목 고유 번호', 'VARCHAR(191)', true),
    createColumn('cartId', '장바구니 ID', 'VARCHAR(191)'),
    createColumn('productId', '상품 ID', 'VARCHAR(191)'),
    createColumn('quantity', '수량', 'INTEGER')
  ]),
  createTable('MIN_ORDER', '주문', [
    createColumn('id', '주문 고유 번호', 'VARCHAR(191)', true),
    createColumn('userId', '유저 ID', 'VARCHAR(191)'),
    createColumn('totalAmount', '총 결제 금액', 'INTEGER'),
    createColumn('status', '주문 상태', 'VARCHAR(50)')
  ]),
  createTable('MIN_ORDER_ITEM', '주문 상품', [
    createColumn('id', '항목 고유 번호', 'VARCHAR(191)', true),
    createColumn('orderId', '주문 ID', 'VARCHAR(191)'),
    createColumn('productId', '상품 ID', 'VARCHAR(191)'),
    createColumn('quantity', '수량', 'INTEGER'),
    createColumn('price', '구매 당시 가격', 'INTEGER')
  ])
];

// 이미 존재하는 테이블인지 확인
const existingTables = data.table.tables.map(t => t.name);
const newTables = tables.filter(t => !existingTables.includes(t.name));

data.table.tables.push(...newTables);
fs.writeFileSync(erdPath, JSON.stringify(data, null, 2));
console.log(`Added ${newTables.length} tables to ERD.`);

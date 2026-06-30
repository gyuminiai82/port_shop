const fs = require('fs');
const crypto = require('crypto');
function uuid() { return crypto.randomUUID(); }

const erdPath = './erd.vuerd.json';
const data = JSON.parse(fs.readFileSync(erdPath, 'utf8'));

// Find MIN_PRODUCT table
const productTable = Object.values(data.collections.tableEntities).find(t => t.name === 'MIN_PRODUCT');

if (productTable) {
  // Check if description already exists
  const exists = Object.values(data.collections.tableColumnEntities).find(c => c.tableId === productTable.id && c.name === 'description');
  
  if (!exists) {
    const colId = uuid();
    data.collections.tableColumnEntities[colId] = {
      id: colId,
      tableId: productTable.id,
      name: 'description',
      comment: '상품 설명',
      dataType: 'TEXT',
      default: '',
      options: 0, // Nullable string
      ui: {
        keys: 0,
        widthName: 60,
        widthComment: 60,
        widthDataType: 60,
        widthDefault: 60
      },
      meta: {
        updateAt: Date.now(),
        createAt: Date.now()
      }
    };
    
    // Add column ID to table
    productTable.columnIds.push(colId);
    productTable.seqColumnIds.push(colId);
    
    fs.writeFileSync(erdPath, JSON.stringify(data, null, 2));
    console.log('Added description column to MIN_PRODUCT');
  } else {
    console.log('Description column already exists');
  }
} else {
  console.log('MIN_PRODUCT not found');
}

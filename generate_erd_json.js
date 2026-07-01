const fs = require('fs');
const crypto = require('crypto');
function uuid() { return crypto.randomUUID(); }

const tablesData = [
  { name: 'MIN_User', comment: '사용자 정보 (SSO)', cols: [{name:'id', type:'VARCHAR(191)', pk:true, comment:'고유 번호'}, {name:'email', type:'VARCHAR(191)', comment:'이메일'}, {name:'password', type:'VARCHAR(191)', comment:'비밀번호'}, {name:'name', type:'VARCHAR(191)', comment:'이름'}] },
  { name: 'MIN_CATEGORY', comment: '상품 카테고리', cols: [{name:'id', type:'VARCHAR(191)', pk:true, comment:'카테고리 번호'}, {name:'name', type:'VARCHAR(191)', comment:'카테고리명'}, {name:'parentId', type:'VARCHAR(191)', comment:'상위 카테고리 ID'}] },
  { name: 'MIN_PRODUCT', comment: '상품 마스터', cols: [{name:'id', type:'VARCHAR(191)', pk:true, comment:'상품 고유 번호'}, {name:'categoryId', type:'VARCHAR(191)', comment:'카테고리 ID'}, {name:'name', type:'VARCHAR(191)', comment:'상품명'}, {name:'description', type:'TEXT', comment:'상품 상세 설명'}, {name:'price', type:'INTEGER', comment:'판매 가격'}, {name:'stock', type:'INTEGER', comment:'재고 수량'}, {name:'viewCount', type:'INTEGER', comment:'조회수'}] },
  { name: 'MIN_PRODUCT_IMAGE', comment: '상품 상세 이미지', cols: [{name:'id', type:'VARCHAR(191)', pk:true, comment:'이미지 번호'}, {name:'productId', type:'VARCHAR(191)', comment:'상품 ID'}, {name:'url', type:'VARCHAR(191)', comment:'이미지 경로'}, {name:'isMain', type:'BOOLEAN', comment:'대표 이미지 여부'}] },
  { name: 'MIN_PRODUCT_OPTION', comment: '상품 옵션 (색상/사이즈)', cols: [{name:'id', type:'VARCHAR(191)', pk:true, comment:'옵션 번호'}, {name:'productId', type:'VARCHAR(191)', comment:'상품 ID'}, {name:'name', type:'VARCHAR(191)', comment:'옵션명 (예: 사이즈)'}, {name:'value', type:'VARCHAR(191)', comment:'옵션값 (예: XL)'}, {name:'addPrice', type:'INTEGER', comment:'추가 금액'}, {name:'stock', type:'INTEGER', comment:'옵션별 재고'}] },
  { name: 'MIN_REVIEW', comment: '상품 리뷰', cols: [{name:'id', type:'VARCHAR(191)', pk:true, comment:'리뷰 번호'}, {name:'productId', type:'VARCHAR(191)', comment:'상품 ID'}, {name:'userId', type:'VARCHAR(191)', comment:'작성자 유저 ID'}, {name:'rating', type:'INTEGER', comment:'별점 (1~5)'}, {name:'content', type:'TEXT', comment:'리뷰 내용'}] },
  { name: 'MIN_WISHLIST', comment: '유저별 찜 목록', cols: [{name:'id', type:'VARCHAR(191)', pk:true, comment:'찜 목록 번호'}, {name:'userId', type:'VARCHAR(191)', comment:'유저 ID'}] },
  { name: 'MIN_WISHLIST_ITEM', comment: '찜 목록 항목', cols: [{name:'id', type:'VARCHAR(191)', pk:true, comment:'찜 항목 번호'}, {name:'wishlistId', type:'VARCHAR(191)', comment:'찜 목록 ID'}, {name:'productId', type:'VARCHAR(191)', comment:'상품 ID'}] },
  { name: 'MIN_CART', comment: '장바구니 마스터', cols: [{name:'id', type:'VARCHAR(191)', pk:true, comment:'장바구니 번호'}, {name:'userId', type:'VARCHAR(191)', comment:'소유 유저 ID'}] },
  { name: 'MIN_CART_ITEM', comment: '장바구니 담긴 상품들', cols: [{name:'id', type:'VARCHAR(191)', pk:true, comment:'항목 번호'}, {name:'cartId', type:'VARCHAR(191)', comment:'장바구니 ID'}, {name:'productId', type:'VARCHAR(191)', comment:'상품 ID'}, {name:'optionId', type:'VARCHAR(191)', comment:'선택한 옵션 ID'}, {name:'quantity', type:'INTEGER', comment:'담은 수량'}] },
  { name: 'MIN_ORDER', comment: '주문 마스터', cols: [{name:'id', type:'VARCHAR(191)', pk:true, comment:'주문 번호'}, {name:'userId', type:'VARCHAR(191)', comment:'주문자 유저 ID'}, {name:'totalAmount', type:'INTEGER', comment:'총 결제 금액'}, {name:'status', type:'VARCHAR(50)', comment:'주문 상태'}] },
  { name: 'MIN_ORDER_ITEM', comment: '주문 상세 상품들', cols: [{name:'id', type:'VARCHAR(191)', pk:true, comment:'상세 번호'}, {name:'orderId', type:'VARCHAR(191)', comment:'주문 ID'}, {name:'productId', type:'VARCHAR(191)', comment:'상품 ID'}, {name:'optionId', type:'VARCHAR(191)', comment:'선택한 옵션 ID'}, {name:'quantity', type:'INTEGER', comment:'수량'}, {name:'price', type:'INTEGER', comment:'구매 당시 금액'}] },
  { name: 'MIN_PAYMENT', comment: '결제 정보', cols: [{name:'id', type:'VARCHAR(191)', pk:true, comment:'결제 번호'}, {name:'orderId', type:'VARCHAR(191)', comment:'주문 ID'}, {name:'method', type:'VARCHAR(50)', comment:'결제 수단'}, {name:'amount', type:'INTEGER', comment:'승인 금액'}, {name:'transactionId', type:'VARCHAR(191)', comment:'PG사 거래번호'}, {name:'status', type:'VARCHAR(50)', comment:'결제 상태'}] },
  { name: 'MIN_DELIVERY', comment: '배송 정보', cols: [{name:'id', type:'VARCHAR(191)', pk:true, comment:'배송 번호'}, {name:'orderId', type:'VARCHAR(191)', comment:'주문 ID'}, {name:'recipient', type:'VARCHAR(191)', comment:'수령인 이름'}, {name:'address', type:'TEXT', comment:'배송지 주소'}, {name:'trackingNo', type:'VARCHAR(191)', comment:'운송장 번호'}, {name:'status', type:'VARCHAR(50)', comment:'배송 상태'}] },
  { name: 'MIN_COUPON', comment: '쿠폰 종류 마스터', cols: [{name:'id', type:'VARCHAR(191)', pk:true, comment:'쿠폰 번호'}, {name:'name', type:'VARCHAR(191)', comment:'쿠폰명'}, {name:'discountRate', type:'INTEGER', comment:'할인율(%)'}, {name:'discountAmt', type:'INTEGER', comment:'정액 할인금액'}, {name:'minOrderAmt', type:'INTEGER', comment:'최소 사용금액'}] },
  { name: 'MIN_USER_COUPON', comment: '발급받은 쿠폰 내역', cols: [{name:'id', type:'VARCHAR(191)', pk:true, comment:'발급 번호'}, {name:'userId', type:'VARCHAR(191)', comment:'소유 유저 ID'}, {name:'couponId', type:'VARCHAR(191)', comment:'쿠폰 ID'}, {name:'isUsed', type:'BOOLEAN', comment:'사용 여부'}] },
  { name: 'MIN_NOTICE', comment: '공지사항', cols: [{name:'id', type:'VARCHAR(191)', pk:true, comment:'공지사항 고유 번호'}, {name:'title', type:'VARCHAR(191)', comment:'제목'}, {name:'content', type:'TEXT', comment:'내용'}, {name:'viewCount', type:'INTEGER', comment:'조회수'}] },
  { name: 'MIN_INQUIRY', comment: '1:1 문의', cols: [{name:'id', type:'VARCHAR(191)', pk:true, comment:'문의 고유 번호'}, {name:'userId', type:'VARCHAR(191)', comment:'작성자 유저 ID'}, {name:'type', type:'VARCHAR(191)', comment:'문의 유형'}, {name:'title', type:'VARCHAR(191)', comment:'문의 제목'}, {name:'content', type:'TEXT', comment:'문의 내용'}, {name:'status', type:'VARCHAR(50)', comment:'처리 상태'}, {name:'answer', type:'TEXT', comment:'관리자 답변'}] }
];

const relationsData = [
  { start: 'MIN_User', startCol: 'id', end: 'MIN_INQUIRY', endCol: 'userId' },
  { start: 'MIN_User', startCol: 'id', end: 'MIN_CART', endCol: 'userId' },
  { start: 'MIN_User', startCol: 'id', end: 'MIN_ORDER', endCol: 'userId' },
  { start: 'MIN_User', startCol: 'id', end: 'MIN_WISHLIST', endCol: 'userId' },
  { start: 'MIN_User', startCol: 'id', end: 'MIN_USER_COUPON', endCol: 'userId' },
  { start: 'MIN_CATEGORY', startCol: 'id', end: 'MIN_PRODUCT', endCol: 'categoryId' },
  { start: 'MIN_PRODUCT', startCol: 'id', end: 'MIN_PRODUCT_IMAGE', endCol: 'productId' },
  { start: 'MIN_PRODUCT', startCol: 'id', end: 'MIN_PRODUCT_OPTION', endCol: 'productId' },
  { start: 'MIN_PRODUCT', startCol: 'id', end: 'MIN_REVIEW', endCol: 'productId' },
  { start: 'MIN_PRODUCT', startCol: 'id', end: 'MIN_CART_ITEM', endCol: 'productId' },
  { start: 'MIN_PRODUCT', startCol: 'id', end: 'MIN_ORDER_ITEM', endCol: 'productId' },
  { start: 'MIN_PRODUCT', startCol: 'id', end: 'MIN_WISHLIST_ITEM', endCol: 'productId' },
  { start: 'MIN_PRODUCT_OPTION', startCol: 'id', end: 'MIN_CART_ITEM', endCol: 'optionId' },
  { start: 'MIN_PRODUCT_OPTION', startCol: 'id', end: 'MIN_ORDER_ITEM', endCol: 'optionId' },
  { start: 'MIN_CART', startCol: 'id', end: 'MIN_CART_ITEM', endCol: 'cartId' },
  { start: 'MIN_ORDER', startCol: 'id', end: 'MIN_ORDER_ITEM', endCol: 'orderId' },
  { start: 'MIN_ORDER', startCol: 'id', end: 'MIN_PAYMENT', endCol: 'orderId' },
  { start: 'MIN_ORDER', startCol: 'id', end: 'MIN_DELIVERY', endCol: 'orderId' },
  { start: 'MIN_WISHLIST', startCol: 'id', end: 'MIN_WISHLIST_ITEM', endCol: 'wishlistId' },
  { start: 'MIN_COUPON', startCol: 'id', end: 'MIN_USER_COUPON', endCol: 'couponId' }
];

const doc = {
  $schema: "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  version: "3.0.0",
  settings: { width: 2000, height: 2000, scrollTop: 0, scrollLeft: 0, zoomLevel: 1, show: 495, database: 16, databaseName: "portfolio", canvasType: "ERD", language: 1, tableNameCase: 4, columnNameCase: 2, bracketType: 1, relationshipDataTypeSync: true, relationshipOptimization: false, columnOrder: [1,2,4,8,16,32,64], maxWidthComment: -1, ignoreSaveSettings: 0 },
  doc: { tableIds: [], relationshipIds: [], indexIds: [], memoIds: [] },
  collections: { tableEntities: {}, tableColumnEntities: {}, relationshipEntities: {}, indexEntities: {}, indexColumnEntities: {}, memoEntities: {} }
};

const tMap = {};
const cMap = {};

let x = 100, y = 100;
tablesData.forEach((tData, i) => {
  const tid = uuid();
  doc.doc.tableIds.push(tid);
  
  const colIds = [];
  tData.cols.forEach((cData) => {
    const cid = uuid();
    colIds.push(cid);
    cMap[`${tData.name}.${cData.name}`] = cid;
    
    doc.collections.tableColumnEntities[cid] = {
      id: cid, tableId: tid, name: cData.name, comment: cData.comment || "", dataType: cData.type, default: cData.pk ? "uuid()" : "",
      options: cData.pk ? 10 : 8,
      ui: { keys: cData.pk ? 1 : 0, widthName: 60, widthComment: 120, widthDataType: 60, widthDefault: 60 },
      meta: { updateAt: Date.now(), createAt: Date.now() }
    };
  });
  
  doc.collections.tableEntities[tid] = {
    id: tid, name: tData.name, comment: tData.comment || "",
    columnIds: colIds, seqColumnIds: colIds,
    ui: { x, y, zIndex: 1, widthName: 80, widthComment: 60, color: "" },
    meta: { updateAt: Date.now(), createAt: Date.now() }
  };
  
  tMap[tData.name] = tid;
  
  x += 300;
  if (x > 1500) { x = 100; y += 300; }
});

relationsData.forEach(r => {
  const startTid = tMap[r.start];
  const endTid = tMap[r.end];
  const startCid = cMap[`${r.start}.${r.startCol}`];
  const endCid = cMap[`${r.end}.${r.endCol}`];
  
  if (startTid && endTid && startCid && endCid) {
    const rid = uuid();
    doc.doc.relationshipIds.push(rid);
    
    doc.collections.tableColumnEntities[endCid].options |= 4; // FK
    
    doc.collections.relationshipEntities[rid] = {
      id: rid, identification: false, relationshipType: 4, startRelationshipType: 1,
      start: { tableId: startTid, columnIds: [startCid], x: 0, y: 0, direction: 1 },
      end: { tableId: endTid, columnIds: [endCid], x: 0, y: 0, direction: 2 },
      meta: { updateAt: Date.now(), createAt: Date.now() }
    };
  }
});

fs.writeFileSync('erd.vuerd.json', JSON.stringify(doc, null, 2));
console.log('Successfully generated complete erd.vuerd.json!');


Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.MIN_SHOP_USERScalarFieldEnum = {
  id: 'id',
  email: 'email',
  name: 'name',
  phone: 'phone',
  zipcode: 'zipcode',
  address: 'address',
  detailAddress: 'detailAddress',
  tier: 'tier',
  points: 'points',
  totalSpent: 'totalSpent',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MIN_SHOP_CATEGORYScalarFieldEnum = {
  id: 'id',
  name: 'name',
  parentId: 'parentId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MIN_SHOP_PRODUCTScalarFieldEnum = {
  id: 'id',
  categoryId: 'categoryId',
  name: 'name',
  description: 'description',
  price: 'price',
  stock: 'stock',
  viewCount: 'viewCount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MIN_SHOP_PRODUCT_IMAGEScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  url: 'url',
  isMain: 'isMain',
  createdAt: 'createdAt'
};

exports.Prisma.MIN_SHOP_PRODUCT_OPTIONScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  name: 'name',
  value: 'value',
  addPrice: 'addPrice',
  stock: 'stock',
  createdAt: 'createdAt'
};

exports.Prisma.MIN_SHOP_REVIEWScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  userId: 'userId',
  rating: 'rating',
  content: 'content',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MIN_SHOP_WISHLISTScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MIN_SHOP_WISHLIST_ITEMScalarFieldEnum = {
  id: 'id',
  wishlistId: 'wishlistId',
  productId: 'productId',
  createdAt: 'createdAt'
};

exports.Prisma.MIN_SHOP_CARTScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MIN_SHOP_CART_ITEMScalarFieldEnum = {
  id: 'id',
  cartId: 'cartId',
  productId: 'productId',
  optionId: 'optionId',
  quantity: 'quantity',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MIN_SHOP_ORDERScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  totalAmount: 'totalAmount',
  refundAmount: 'refundAmount',
  usedPoints: 'usedPoints',
  earnedPoints: 'earnedPoints',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MIN_SHOP_ORDER_ITEMScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  productId: 'productId',
  optionId: 'optionId',
  quantity: 'quantity',
  price: 'price',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MIN_SHOP_PAYMENTScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  method: 'method',
  amount: 'amount',
  transactionId: 'transactionId',
  status: 'status',
  paidAt: 'paidAt',
  createdAt: 'createdAt'
};

exports.Prisma.MIN_SHOP_DELIVERYScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  recipient: 'recipient',
  address: 'address',
  trackingNo: 'trackingNo',
  status: 'status',
  shippedAt: 'shippedAt',
  deliveredAt: 'deliveredAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MIN_SHOP_COUPONScalarFieldEnum = {
  id: 'id',
  name: 'name',
  discountRate: 'discountRate',
  discountAmt: 'discountAmt',
  minOrderAmt: 'minOrderAmt',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt'
};

exports.Prisma.MIN_SHOP_USER_COUPONScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  couponId: 'couponId',
  isUsed: 'isUsed',
  usedAt: 'usedAt',
  createdAt: 'createdAt'
};

exports.Prisma.MIN_SHOP_ROLEScalarFieldEnum = {
  id: 'id',
  name: 'name',
  permissions: 'permissions',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MIN_SHOP_ADMINScalarFieldEnum = {
  id: 'id',
  email: 'email',
  password: 'password',
  name: 'name',
  role: 'role',
  roleId: 'roleId',
  isSuperAdmin: 'isSuperAdmin',
  permissions: 'permissions',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MIN_SHOP_NOTICEScalarFieldEnum = {
  id: 'id',
  title: 'title',
  content: 'content',
  viewCount: 'viewCount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MIN_SHOP_INQUIRYScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  title: 'title',
  content: 'content',
  status: 'status',
  answer: 'answer',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MIN_SHOP_POINT_LOGScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  amount: 'amount',
  reason: 'reason',
  createdAt: 'createdAt'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  password: 'password',
  name: 'name',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  MIN_SHOP_USER: 'MIN_SHOP_USER',
  MIN_SHOP_CATEGORY: 'MIN_SHOP_CATEGORY',
  MIN_SHOP_PRODUCT: 'MIN_SHOP_PRODUCT',
  MIN_SHOP_PRODUCT_IMAGE: 'MIN_SHOP_PRODUCT_IMAGE',
  MIN_SHOP_PRODUCT_OPTION: 'MIN_SHOP_PRODUCT_OPTION',
  MIN_SHOP_REVIEW: 'MIN_SHOP_REVIEW',
  MIN_SHOP_WISHLIST: 'MIN_SHOP_WISHLIST',
  MIN_SHOP_WISHLIST_ITEM: 'MIN_SHOP_WISHLIST_ITEM',
  MIN_SHOP_CART: 'MIN_SHOP_CART',
  MIN_SHOP_CART_ITEM: 'MIN_SHOP_CART_ITEM',
  MIN_SHOP_ORDER: 'MIN_SHOP_ORDER',
  MIN_SHOP_ORDER_ITEM: 'MIN_SHOP_ORDER_ITEM',
  MIN_SHOP_PAYMENT: 'MIN_SHOP_PAYMENT',
  MIN_SHOP_DELIVERY: 'MIN_SHOP_DELIVERY',
  MIN_SHOP_COUPON: 'MIN_SHOP_COUPON',
  MIN_SHOP_USER_COUPON: 'MIN_SHOP_USER_COUPON',
  MIN_SHOP_ROLE: 'MIN_SHOP_ROLE',
  MIN_SHOP_ADMIN: 'MIN_SHOP_ADMIN',
  MIN_SHOP_NOTICE: 'MIN_SHOP_NOTICE',
  MIN_SHOP_INQUIRY: 'MIN_SHOP_INQUIRY',
  MIN_SHOP_POINT_LOG: 'MIN_SHOP_POINT_LOG',
  User: 'User'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)

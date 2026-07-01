import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Clear existing data
  await prisma.mIN_PRODUCT_IMAGE.deleteMany()
  await prisma.mIN_PRODUCT_OPTION.deleteMany()
  await prisma.mIN_REVIEW.deleteMany()
  await prisma.mIN_PRODUCT.deleteMany()
  await prisma.mIN_CATEGORY.deleteMany()
  await prisma.mIN_COUPON.deleteMany()
  await prisma.mIN_SHOP_USER.deleteMany()

  // Create Categories
  const catLaptop = await prisma.mIN_CATEGORY.create({ data: { name: '노트북' } })
  const catTablet = await prisma.mIN_CATEGORY.create({ data: { name: '태블릿' } })
  const catAudio = await prisma.mIN_CATEGORY.create({ data: { name: '오디오/음향' } })
  const catSmartwatch = await prisma.mIN_CATEGORY.create({ data: { name: '스마트워치' } })
  const catAccessories = await prisma.mIN_CATEGORY.create({ data: { name: '주변기기' } })

  // Dummy Images by Category (Unsplash)
  const laptopImages = [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80'
  ]
  const tabletImages = [
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
    'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80',
    'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80'
  ]
  const audioImages = [
    'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=800&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80'
  ]
  const watchImages = [
    'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80'
  ]
  const accImages = [
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80',
    'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80',
    'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80'
  ]

  // Create Dummy Users for Reviews
  const dummyUsers = await Promise.all([
    prisma.mIN_SHOP_USER.create({ data: { email: 'tech_lover1@minstudio.app', name: '테크러버' } }),
    prisma.mIN_SHOP_USER.create({ data: { email: 'early_adopter@minstudio.app', name: '얼리어답터' } }),
    prisma.mIN_SHOP_USER.create({ data: { email: 'gadget_freak@minstudio.app', name: '가젯프릭' } })
  ]);

  // Product Templates
  const productsData = [
    // Laptops
    { catId: catLaptop.id, name: '맥북 프로 16인치 M3 Max', price: 4890000, images: [laptopImages[0], laptopImages[1]], desc: '최고 성능의 랩탑. M3 Max 탑재로 작업 효율 극대화.' },
    { catId: catLaptop.id, name: '서피스 랩탑 스튜디오 2', price: 3200000, images: [laptopImages[2]], desc: '크리에이터를 위한 완벽한 컨버터블 노트북.' },
    { catId: catLaptop.id, name: '델 XPS 15 9530', price: 2900000, images: [laptopImages[3]], desc: '인피니티엣지 디스플레이와 강력한 성능의 조화.' },
    { catId: catLaptop.id, name: '씽크패드 X1 카본 Gen 11', price: 2500000, images: [laptopImages[0]], desc: '비즈니스 랩탑의 표준, 가벼운 무게와 극강의 키감.' },
    
    // Tablets
    { catId: catTablet.id, name: '아이패드 프로 13인치 M4', price: 1999000, images: [tabletImages[0], tabletImages[1]], desc: '세상에서 가장 얇은 디자인에 담긴 강력한 M4 성능.' },
    { catId: catTablet.id, name: '갤럭시 탭 S9 울트라', price: 1590000, images: [tabletImages[2]], desc: '14.6인치 대화면과 방수방진 태블릿의 정점.' },
    { catId: catTablet.id, name: '아이패드 에어 6세대', price: 899000, images: [tabletImages[0]], desc: 'M2 칩 탑재로 프로급 성능을 합리적인 가격에.' },
    
    // Audio
    { catId: catAudio.id, name: '에어팟 맥스 2세대', price: 769000, images: [audioImages[0]], desc: '스튜디오급 사운드와 액티브 노이즈 캔슬링의 만남.' },
    { catId: catAudio.id, name: '소니 WH-1000XM5', price: 479000, images: [audioImages[1]], desc: '업계 최고 수준의 노이즈 캔슬링 무선 헤드폰.' },
    { catId: catAudio.id, name: '보스 QC 울트라 이어버드', price: 359000, images: [audioImages[2]], desc: '완벽한 착용감과 압도적인 노이즈 캔슬링.' },
    { catId: catAudio.id, name: '에어팟 프로 2세대 (USB-C)', price: 359000, images: [audioImages[0]], desc: '언제 어디서나 몰입감 넘치는 사운드.' },

    // Smartwatches
    { catId: catSmartwatch.id, name: '애플워치 울트라 2', price: 1149000, images: [watchImages[0]], desc: '가장 튼튼하고 강력한 익스트림 워치.' },
    { catId: catSmartwatch.id, name: '갤럭시 워치 6 클래식', price: 429000, images: [watchImages[1]], desc: '회전 베젤의 아날로그 감성과 스마트한 기능.' },
    { catId: catSmartwatch.id, name: '가민 에픽스 프로', price: 1390000, images: [watchImages[2]], desc: 'AMOLED 화면을 탑재한 프리미엄 아웃도어 워치.' },

    // Accessories
    { catId: catAccessories.id, name: '로지텍 MX 마스터 3S', price: 139000, images: [accImages[0]], desc: '궁극의 생산성을 위한 인체공학적 무선 마우스.' },
    { catId: catAccessories.id, name: '매직 키보드 (Touch ID)', price: 179000, images: [accImages[1]], desc: '터치 아이디가 포함된 가장 완벽한 타이핑 경험.' },
    { catId: catAccessories.id, name: '키크론 Q1 Pro 기계식 키보드', price: 299000, images: [accImages[2]], desc: '풀 알루미늄 바디의 커스텀 무선 기계식 키보드.' }
  ];

  // Procedurally generate more products to make it "왕창"
  const generateMore = 30; // 30 more products per category
  const categoriesList = [
    { catId: catLaptop.id, nameBase: '프로 랩탑', images: laptopImages },
    { catId: catTablet.id, nameBase: '울트라 패드', images: tabletImages },
    { catId: catAudio.id, nameBase: '스튜디오 오디오', images: audioImages },
    { catId: catSmartwatch.id, nameBase: '스마트 피트니스 워치', images: watchImages },
    { catId: catAccessories.id, nameBase: '스튜디오 에센셜 기기', images: accImages },
  ];
  
  categoriesList.forEach((cat) => {
    for (let i = 1; i <= generateMore; i++) {
      productsData.push({
        catId: cat.catId,
        name: `${cat.nameBase} Gen${i} 에디션`,
        price: Math.floor(Math.random() * 200 + 5) * 10000,
        images: [cat.images[Math.floor(Math.random() * cat.images.length)]],
        desc: `혁신적인 기술이 집약된 ${cat.nameBase} Gen${i} 한정판 에디션입니다. 뛰어난 내구성과 세련된 디자인을 자랑합니다.`
      });
    }
  });

  for (let i = 0; i < productsData.length; i++) {
    const pData = productsData[i];
    
    const product = await prisma.mIN_PRODUCT.create({
      data: {
        categoryId: pData.catId,
        name: pData.name,
        description: pData.desc,
        price: pData.price,
        stock: Math.floor(Math.random() * 100) + 10,
        viewCount: Math.floor(Math.random() * 500),
        images: {
          create: pData.images.map((url, idx) => ({
            url,
            isMain: idx === 0
          }))
        },
        options: {
          create: [
            { name: '기본', value: '단일옵션', addPrice: 0, stock: 50 },
            { name: '프리미엄케어', value: '적용', addPrice: 150000, stock: 999 }
          ]
        }
      }
    });

    // Add 1~3 Random Reviews
    const reviewCount = Math.floor(Math.random() * 3) + 1;
    for (let r = 0; r < reviewCount; r++) {
      const user = dummyUsers[Math.floor(Math.random() * dummyUsers.length)];
      await prisma.mIN_REVIEW.create({
        data: {
          productId: product.id,
          userId: user.id,
          rating: Math.floor(Math.random() * 2) + 4, // 4 or 5
          content: ['너무 만족스럽습니다', '배송도 빠르고 제품도 좋아요', '고급스럽고 성능도 미쳤습니다', '비싸지만 돈값 확실히 하네요'][Math.floor(Math.random() * 4)]
        }
      });
    }
  }

  // Create Coupon
  await prisma.mIN_COUPON.create({
    data: {
      name: 'IT 기기 기획전 특별 10% 쿠폰',
      discountRate: 10,
      discountAmt: 0,
      minOrderAmt: 50000,
      expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    }
  })

  console.log('Massive Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

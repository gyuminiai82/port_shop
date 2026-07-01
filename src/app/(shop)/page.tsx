import { cookies } from "next/headers";
import { redis } from "@/lib/redis";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

async function getUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) return null;

  const sessionData = await redis.get(`session:${sessionToken}`);
  if (!sessionData) return null;

  return JSON.parse(sessionData);
}

export default async function Home(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const user = await getUser();
  
  const categoryFilter = typeof searchParams.category === 'string' ? searchParams.category : undefined;

  // Fetch all categories for filter tabs
  const categories = await prisma.mIN_CATEGORY.findMany({
    where: { parentId: null } // Top level categories
  });

  const defaultCategory = categories[0]?.name;
  const currentCategory = categoryFilter || defaultCategory;

  // Fetch products with their main image and category name
  const products = await prisma.mIN_PRODUCT.findMany({
    where: currentCategory ? {
      category: {
        name: currentCategory
      }
    } : undefined,
    include: {
      category: true,
      images: {
        where: { isMain: true },
        take: 1
      },
    },
    orderBy: { viewCount: 'desc' }
  });

  const getCategoryColor = (category: string | undefined) => {
    switch (category) {
      case "노트북": return "rgba(59, 130, 246, 0.25)"; // Blue
      case "태블릿": return "rgba(236, 72, 153, 0.25)"; // Pink
      case "오디오/음향": return "rgba(16, 185, 129, 0.25)"; // Emerald
      case "스마트워치": return "rgba(139, 92, 246, 0.25)"; // Purple
      case "주변기기": return "rgba(245, 158, 11, 0.25)"; // Amber
      default: return "rgba(59, 130, 246, 0.15)";
    }
  };

  return (
    <>
      <main className="main-content">
        <section className="hero" style={{ position: "relative", overflow: "hidden" }}>
          {/* Dynamic Ambient Background Glows */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: "none",
            zIndex: 0,
          }}>
            {/* Primary Glow */}
            <div style={{
              position: "absolute",
              top: "-30%",
              left: "10%",
              width: "70vw",
              height: "70vw",
              maxWidth: "800px",
              maxHeight: "800px",
              background: `radial-gradient(circle at center, ${getCategoryColor(currentCategory)} 0%, transparent 60%)`,
              filter: "blur(60px)",
              animation: "float 12s ease-in-out infinite",
              transition: "background 0.5s ease-in-out"
            }} />
            
            {/* Secondary Glow */}
            <div style={{
              position: "absolute",
              bottom: "-20%",
              right: "-10%",
              width: "60vw",
              height: "60vw",
              maxWidth: "600px",
              maxHeight: "600px",
              background: `radial-gradient(circle at center, ${getCategoryColor(currentCategory).replace('0.25', '0.15')} 0%, transparent 60%)`,
              filter: "blur(80px)",
              animation: "float 15s ease-in-out infinite reverse, pulse-slow 8s ease-in-out infinite",
              transition: "background 0.5s ease-in-out"
            }} />
            
            {/* Tertiary Subdued Glow */}
            <div style={{
              position: "absolute",
              top: "40%",
              left: "40%",
              width: "40vw",
              height: "40vw",
              maxWidth: "500px",
              maxHeight: "500px",
              background: `radial-gradient(circle at center, ${getCategoryColor(currentCategory).replace('0.25', '0.1')} 0%, transparent 70%)`,
              filter: "blur(100px)",
              animation: "float 18s ease-in-out infinite 2s",
              transition: "background 0.5s ease-in-out"
            }} />
          </div>

          <div className="hero-content" style={{ position: "relative", zIndex: 1 }}>
            <h1 style={{ transition: "color 0.3s ease" }}>{currentCategory ? `${currentCategory}` : 'Premium Lifestyle'}</h1>
            <p>{currentCategory ? `당신의 일상을 변화시킬 최고의 ${currentCategory}를 만나보세요.` : '세상을 바꿀 혁신적인 테크 기기'}</p>
          </div>
        </section>

        <section id="products" className="products">
          <div className="category-nav">
            {categories.map((cat) => (
              <Link 
                key={cat.id} 
                href={`/?category=${encodeURIComponent(cat.name)}`}
                className={`category-btn ${currentCategory === cat.name ? 'active' : ''}`}
                scroll={false}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="product-grid">
            {products.map((product) => (
              <Link href={`/product/${product.id}`} key={product.id} className="product-card">
                <div className="product-img-wrapper">
                  {product.images[0] ? (
                    <Image 
                      src={product.images[0].url} 
                      alt={product.name} 
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eee' }}>
                      No Image
                    </div>
                  )}
                </div>
                <div className="product-info">
                  <div className="product-category">{product.category.name}</div>
                  <h3>{product.name}</h3>
                  <div className="product-price">
                    ₩{product.price.toLocaleString()}
                  </div>
                  <div className="product-action">
                    <button className="btn btn-secondary" style={{ flex: 1 }}>자세히 보기</button>
                    <button className="btn-icon" aria-label="장바구니 담기">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                        <path d="M3 6h18" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              </Link>
            ))}
            
            {products.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                해당 카테고리의 상품이 없습니다.
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductActions from "@/components/ProductActions";

export default async function ProductDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const product = await prisma.mIN_PRODUCT.findUnique({
    where: { id },
    include: {
      category: true,
      images: {
        orderBy: { isMain: 'desc' }
      },
      options: true,
      reviews: {
        orderBy: { id: 'desc' }
      }
    }
  });

  if (!product) {
    notFound();
  }

  // Fetch users for reviews
  const userIds = [...new Set(product.reviews.map(r => r.userId))];
  const users = await prisma.mIN_SHOP_USER.findMany({
    where: { id: { in: userIds } }
  });
  const userMap = new Map(users.map(u => [u.id, u.name]));

  // Attach user names to reviews
  const reviewsWithUser = product.reviews.map(r => ({
    ...r,
    user: { name: userMap.get(r.userId) || "알 수 없는 사용자" }
  }));

  // Update view count
  await prisma.mIN_PRODUCT.update({
    where: { id },
    data: { viewCount: { increment: 1 } }
  });

  // Calculate average rating
  const avgRating = product.reviews.length > 0 
    ? (product.reviews.reduce((acc, rev) => acc + rev.rating, 0) / product.reviews.length).toFixed(1)
    : 0;

  return (
    <>
      <main className="main-content" style={{ padding: "4rem 2rem", maxWidth: "1440px", margin: "0 auto", marginTop: "var(--nav-height)" }}>
        
        {/* Product Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "6rem", marginBottom: "8rem" }} className="product-detail-grid">
          
          {/* Left: Images */}
          <div className="product-images" style={{ display: "flex", flexDirection: "column", gap: "1.5rem", position: "sticky", top: "calc(var(--nav-height) + 2rem)", alignSelf: "start" }}>
            <div className="glass" style={{ position: "relative", width: "100%", aspectRatio: "4/3", borderRadius: "32px", overflow: "hidden", background: "var(--glass-bg)" }}>
              {product.images[0] ? (
                <Image src={product.images[0].url} alt={product.name} fill style={{ objectFit: 'cover' }} priority sizes="(max-width: 768px) 100vw, 60vw" />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No Image</div>
              )}
            </div>
            
            {product.images.length > 1 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1rem" }}>
                {product.images.slice(1).map((img) => (
                  <div key={img.id} className="glass" style={{ position: "relative", aspectRatio: "1/1", borderRadius: "16px", overflow: "hidden", cursor: "pointer", border: "2px solid transparent", transition: "all 0.2s" }}>
                    <Image src={img.url} alt="Thumbnail" fill style={{ objectFit: 'cover' }} sizes="15vw" />
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
              <div className="glass" style={{ padding: "1.5rem", borderRadius: "16px", textAlign: "center" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🚚</div>
                <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>무료 배송</div>
              </div>
              <div className="glass" style={{ padding: "1.5rem", borderRadius: "16px", textAlign: "center" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🛡️</div>
                <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>100% 정품 보증</div>
              </div>
              <div className="glass" style={{ padding: "1.5rem", borderRadius: "16px", textAlign: "center" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>↩️</div>
                <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>무료 반품</div>
              </div>
            </div>

            <div style={{ width: "100%", height: "1px", background: "var(--glass-border)", margin: "0.5rem 0" }}></div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", padding: "0 0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", fontSize: "1.125rem" }}>
                <span style={{ width: "100px", color: "var(--text-secondary)", fontWeight: 600 }}>배송 안내</span>
                <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                  내일 도착 보장 
                  <span style={{ marginLeft: "0.5rem", color: "var(--accent-color)", background: "rgba(59, 130, 246, 0.1)", padding: "0.25rem 0.5rem", borderRadius: "6px", fontSize: "0.875rem", fontWeight: 700 }}>무료배송</span>
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", fontSize: "1.125rem" }}>
                <span style={{ width: "100px", color: "var(--text-secondary)", fontWeight: 600 }}>카드 혜택</span>
                <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>무이자 할부 최대 6개월</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", fontSize: "1.125rem" }}>
                <span style={{ width: "100px", color: "var(--text-secondary)", fontWeight: 600 }}>적립 혜택</span>
                <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>최대 5% 마일리지 적립</span>
              </div>
            </div>
          </div>

          {/* Right: Info */}
          <div className="product-info-detail" style={{ display: "flex", flexDirection: "column", padding: "2rem 0" }}>
            <div className="product-category" style={{ fontSize: "1rem", marginBottom: "1.5rem", color: "var(--accent-color)", fontWeight: 700, letterSpacing: "0.1em" }}>
              {product.category.name}
            </div>
            <h1 style={{ fontSize: "3.5rem", fontWeight: 800, marginBottom: "1.5rem", lineHeight: 1.1, letterSpacing: "-0.04em" }}>{product.name}</h1>
            
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", color: "#fbbf24", background: "rgba(251, 191, 36, 0.1)", padding: "0.5rem 1rem", borderRadius: "99px" }}>
                <span style={{ fontSize: "1.25rem" }}>★</span>
                <span style={{ marginLeft: "0.5rem", color: "var(--text-primary)", fontWeight: 700 }}>{avgRating}</span>
              </div>
              <span style={{ color: "var(--text-secondary)", fontSize: "1.125rem" }}>리뷰 {product.reviews.length}개</span>
              <span style={{ color: "var(--text-secondary)", fontSize: "1.125rem" }}>조회수 {product.viewCount}회</span>
            </div>

            <p style={{ fontSize: "1.125rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "2rem", wordBreak: "keep-all" }}>
              {product.description?.substring(0, 120) || "최고의 기술력과 디자인이 만났습니다. 당신의 일상을 업그레이드할 완벽한 선택이 될 것입니다."}
              {product.description && product.description.length > 120 ? "..." : ""}
            </p>

            <ProductActions product={product} />
          </div>
        </div>

        {/* Details & Reviews */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "4rem" }}>
          
          <div className="glass" style={{ padding: "5rem 4rem", borderRadius: "32px" }}>
            <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
              <h2 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "2rem", letterSpacing: "-0.03em" }}>프로급 성능, 압도적인 경험.</h2>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "1.25rem", marginBottom: "4rem" }}>
                {product.description}
              </p>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", textAlign: "left" }}>
                <div style={{ padding: "2rem", background: "rgba(0,0,0,0.02)", borderRadius: "24px", border: "1px solid var(--glass-border)" }}>
                  <h4 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem" }}>주요 스펙</h4>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, color: "var(--text-secondary)", lineHeight: 2 }}>
                    <li>• 최신 아키텍처 프로세서 탑재</li>
                    <li>• 초고해상도 다이나믹 디스플레이</li>
                    <li>• 올데이 배터리 라이프</li>
                    <li>• 1년 무상 보증 및 케어플러스 가입 가능</li>
                  </ul>
                </div>
                <div style={{ padding: "2rem", background: "rgba(0,0,0,0.02)", borderRadius: "24px", border: "1px solid var(--glass-border)" }}>
                  <h4 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem" }}>패키지 구성</h4>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, color: "var(--text-secondary)", lineHeight: 2 }}>
                    <li>• 기기 본체</li>
                    <li>• 초고속 충전 어댑터</li>
                    <li>• 프리미엄 패브릭 케이블</li>
                    <li>• 빠른 시작 설명서</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="glass" style={{ padding: "5rem 4rem", borderRadius: "32px", marginBottom: "4rem" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "3rem" }}>고객 리뷰 <span style={{ color: "var(--accent-color)" }}>{product.reviews.length}</span></h2>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "2rem" }}>
              {reviewsWithUser.length > 0 ? (
                reviewsWithUser.map(review => (
                  <div key={review.id} style={{ background: "rgba(0,0,0,0.02)", border: "1px solid var(--glass-border)", padding: "2rem", borderRadius: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--accent-color)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                          {review.user?.name ? review.user.name[0] : "U"}
                        </div>
                        <div style={{ fontWeight: 600, fontSize: "1.125rem" }}>{review.user?.name || "알 수 없는 사용자"}</div>
                      </div>
                      <div style={{ color: "#fbbf24", fontSize: "1.25rem" }}>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div>
                    </div>
                    <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, fontSize: "1.125rem" }}>{review.content}</p>
                  </div>
                ))
              ) : (
                <p style={{ color: "var(--text-secondary)", fontSize: "1.25rem", gridColumn: "1 / -1", textAlign: "center", padding: "4rem 0" }}>가장 먼저 리뷰를 남겨주세요!</p>
              )}
            </div>
          </div>
        </div>

      </main>

      <style>{`
        @media (max-width: 900px) {
          .product-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}

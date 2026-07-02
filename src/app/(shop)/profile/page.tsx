import { cookies } from "next/headers";
import { redis } from "@/lib/redis";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import CancelOrderButton from "./CancelOrderButton";
import CancelOrderItemButton from "./CancelOrderItemButton";

async function getUserSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;
  if (!sessionToken) return null;
  const sessionData = await redis.get(`session:${sessionToken}`);
  if (!sessionData) return null;
  return JSON.parse(sessionData as string);
}

export default async function ProfileOrdersPage() {
  const sessionUser = await getUserSession();
  
  if (!sessionUser) return null;

  const orders = await prisma.mIN_SHOP_ORDER.findMany({
    where: { userId: sessionUser.id },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: {
                where: { isMain: true },
                take: 1
              }
            }
          },
          option: true
        }
      },
      payment: true,
      delivery: true
    }
  });

  return (
    <div className="glass" style={{ padding: "3rem", borderRadius: "32px", background: "var(--glass-bg)" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "2rem", letterSpacing: "-0.04em" }}>결제 및 주문 내역</h1>
      
      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "5rem 0", color: "var(--text-secondary)" }}>
          <p style={{ fontSize: "1.125rem", marginBottom: "1.5rem" }}>아직 주문하신 내역이 없습니다.</p>
          <Link href="/" className="btn btn-primary" style={{ padding: "1rem 2rem", borderRadius: "12px", textDecoration: "none", fontWeight: 600, display: "inline-block" }}>
            쇼핑하러 가기
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {orders.map(order => (
            <div key={order.id} style={{ border: "1px solid var(--glass-border)", borderRadius: "16px", padding: "2rem", background: "rgba(255, 255, 255, 0.4)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem", borderBottom: "1px solid var(--glass-border)", paddingBottom: "1rem" }}>
                <div>
                  <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem", display: "block" }}>주문일자: {new Date(order.createdAt).toLocaleDateString('ko-KR')}</span>
                  <span style={{ color: "var(--text-secondary)", fontSize: "0.75rem", display: "block", marginTop: "4px" }}>주문번호: {order.id}</span>
                  {order.delivery && (
                    <div style={{ marginTop: "0.75rem", padding: "0.5rem", background: "rgba(255,255,255,0.5)", borderRadius: "8px", display: "inline-block" }}>
                      <span style={{ fontSize: "0.875rem", fontWeight: 700, color: order.delivery.status === 'DELIVERED' ? '#3730a3' : '#4b5563' }}>
                        {order.delivery.status === 'PREPARING' ? '배송준비중' : order.delivery.status === 'SHIPPING' ? '배송중' : order.delivery.status === 'DELIVERED' ? '배송완료' : order.delivery.status}
                      </span>
                      {order.delivery.trackingNo && (
                        <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginLeft: "0.5rem", borderLeft: "1px solid var(--glass-border)", paddingLeft: "0.5rem" }}>
                          송장번호: {order.delivery.trackingNo}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
                  <span style={{ fontWeight: 800, fontSize: "1.125rem", color: order.status === 'PAID' ? 'var(--accent-color)' : order.status === 'CANCELLED' ? '#ef4444' : 'var(--text-primary)' }}>
                    {order.status === 'PAID' ? '결제완료' : order.status === 'CANCELLED' ? '취소됨' : order.status}
                  </span>
                  {(order.status === 'PAID' || order.status === 'PENDING') && 
                   (!order.delivery || (order.delivery.status !== 'SHIPPING' && order.delivery.status !== 'DELIVERED')) && (
                    <CancelOrderButton orderId={order.id} />
                  )}
                </div>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {order.items.map((item: any) => {
                  const isCancelled = item.status === 'CANCELLED';
                  return (
                  <div key={item.id} style={{ display: "flex", gap: "1.5rem", alignItems: "center", opacity: isCancelled ? 0.5 : 1 }}>
                    <div style={{ width: "80px", height: "80px", borderRadius: "12px", background: "var(--glass-bg)", overflow: "hidden", position: "relative", flexShrink: 0 }}>
                      {item.product.images?.[0]?.url ? (
                        <Image src={item.product.images[0].url} alt={item.product.name} fill style={{ objectFit: "cover", filter: isCancelled ? "grayscale(100%)" : "none" }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: '0.75rem' }}>No Image</div>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <Link href={`/product/${item.product.id}`} style={{ fontWeight: 700, fontSize: "1.125rem", color: "var(--text-primary)", textDecoration: isCancelled ? "line-through" : "none", display: "block", marginBottom: "8px" }}>
                        {item.product.name}
                        {isCancelled && <span style={{ color: "#ef4444", fontSize: "0.875rem", marginLeft: "8px", textDecoration: "none" }}>(취소됨)</span>}
                      </Link>
                      <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem", display: "block", textDecoration: isCancelled ? "line-through" : "none" }}>수량: <strong style={{ color: "var(--text-primary)" }}>{item.quantity}</strong>개</span>
                      {item.option && (
                        <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem", display: "block", marginTop: "4px", textDecoration: isCancelled ? "line-through" : "none" }}>
                          옵션: {item.option.name} - {item.option.value} (+₩{item.option.addPrice.toLocaleString()})
                        </span>
                      )}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
                      <span style={{ fontWeight: 800, fontSize: "1.125rem", textDecoration: isCancelled ? "line-through" : "none" }}>
                        ₩{(item.price * item.quantity).toLocaleString()}
                      </span>
                      {!isCancelled && (order.status === 'PAID' || order.status === 'PENDING') &&
                       (!order.delivery || (order.delivery.status !== 'SHIPPING' && order.delivery.status !== 'DELIVERED')) && (
                        <CancelOrderItemButton orderId={order.id} itemId={item.id} itemName={item.product.name} />
                      )}
                    </div>
                  </div>
                  );
                })}
              </div>
              
              <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px dashed var(--glass-border)", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "1rem", color: "var(--text-secondary)" }}>
                  <span>주문 총액</span>
                  <span>₩{order.totalAmount.toLocaleString()}</span>
                </div>
                {/* @ts-ignore */}
                {order.refundAmount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "1rem", color: "#ef4444" }}>
                    <span>취소/환불 금액</span>
                    {/* @ts-ignore */}
                    <span>-₩{order.refundAmount.toLocaleString()}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 800, fontSize: "1.25rem", marginTop: "0.5rem" }}>
                  <span>최종 결제금액</span>
                  {/* @ts-ignore */}
                  <span style={{ color: "var(--accent-color)" }}>₩{(order.totalAmount - (order.refundAmount || 0)).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

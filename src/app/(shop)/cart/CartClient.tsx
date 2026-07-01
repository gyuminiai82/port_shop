"use client";

import { useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { updateCartItemQuantity, removeFromCart } from "@/app/actions/cart";

type CartItem = {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    images: { url: string }[];
  };
  option: {
    name: string;
    value: string;
    addPrice: number;
  } | null;
};

export default function CartClient({ items }: { items: CartItem[] }) {
  const [isPending, startTransition] = useTransition();

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    startTransition(async () => {
      await updateCartItemQuantity(itemId, newQuantity);
    });
  };

  const handleRemove = (itemId: string) => {
    startTransition(async () => {
      await removeFromCart(itemId);
    });
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const itemPrice = item.product.price + (item.option?.addPrice || 0);
      return total + itemPrice * item.quantity;
    }, 0);
  };

  if (items.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "6rem 0" }}>
        <p style={{ fontSize: "1.25rem", color: "var(--text-secondary)", marginBottom: "2rem" }}>장바구니가 비어 있습니다.</p>
        <Link href="/" className="btn btn-primary" style={{ padding: "1rem 2rem", borderRadius: "12px", textDecoration: "none" }}>
          쇼핑 계속하기
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "2rem", alignItems: "start" }} className="cart-grid">
      <div className="cart-items" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {items.map((item) => {
          const itemPrice = item.product.price + (item.option?.addPrice || 0);
          return (
            <div key={item.id} className="glass" style={{ display: "flex", gap: "1.5rem", padding: "1.5rem", borderRadius: "24px", alignItems: "center" }}>
              <Link href={`/product/${item.product.id}`}>
                <div style={{ position: "relative", width: "120px", height: "120px", borderRadius: "16px", overflow: "hidden", background: "var(--glass-bg)" }}>
                  {item.product.images[0] ? (
                    <Image src={item.product.images[0].url} alt={item.product.name} fill style={{ objectFit: 'cover' }} sizes="120px" />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>No Image</div>
                  )}
                </div>
              </Link>
              
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                  <Link href={`/product/${item.product.id}`} style={{ textDecoration: "none", color: "var(--text-primary)" }}>
                    {item.product.name}
                  </Link>
                </div>
                {item.option && (
                  <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                    옵션: {item.option.name} - {item.option.value} (+₩{item.option.addPrice.toLocaleString()})
                  </div>
                )}
                
                <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--glass-border)", borderRadius: "8px", overflow: "hidden" }}>
                    <button 
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={isPending || item.quantity <= 1}
                      style={{ padding: "0.5rem 1rem", background: "transparent", border: "none", cursor: "pointer", color: "var(--text-primary)" }}
                    >-</button>
                    <span style={{ padding: "0.5rem 1rem", minWidth: "40px", textAlign: "center", borderLeft: "1px solid var(--glass-border)", borderRight: "1px solid var(--glass-border)" }}>
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      disabled={isPending}
                      style={{ padding: "0.5rem 1rem", background: "transparent", border: "none", cursor: "pointer", color: "var(--text-primary)" }}
                    >+</button>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "1.125rem" }}>
                    ₩{(itemPrice * item.quantity).toLocaleString()}
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => handleRemove(item.id)}
                disabled={isPending}
                style={{ background: "transparent", border: "none", cursor: "pointer", padding: "0.5rem", color: "var(--text-secondary)" }}
                aria-label="삭제"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>

      <div className="cart-summary glass" style={{ position: "sticky", top: "calc(var(--nav-height) + 2rem)", padding: "2rem", borderRadius: "24px" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "2rem" }}>결제 예상 금액</h2>
        
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", color: "var(--text-secondary)", fontSize: "1.125rem" }}>
          <span>총 상품 금액</span>
          <span>₩{calculateTotal().toLocaleString()}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem", color: "var(--text-secondary)", fontSize: "1.125rem" }}>
          <span>배송비</span>
          <span>무료</span>
        </div>
        
        <div style={{ width: "100%", height: "1px", background: "var(--glass-border)", margin: "1.5rem 0" }}></div>
        
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem", fontWeight: 800, fontSize: "1.5rem", color: "var(--text-primary)" }}>
          <span>총 결제 금액</span>
          <span>₩{calculateTotal().toLocaleString()}</span>
        </div>
        
        <button className="btn btn-primary" style={{ width: "100%", padding: "1.25rem", borderRadius: "12px", fontSize: "1.125rem", fontWeight: 600 }}>
          결제하기
        </button>
      </div>

      <style jsx global>{`
        @media (max-width: 900px) {
          .cart-grid {
            grid-template-columns: 1fr !important;
          }
          .cart-summary {
            position: static !important;
          }
        }
      `}</style>
    </div>
  );
}

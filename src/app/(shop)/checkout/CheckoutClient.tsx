"use client";

import { useEffect, useRef, useState } from "react";
import { PaymentWidgetInstance, loadPaymentWidget } from "@tosspayments/payment-widget-sdk";

// 테스트용 공용 키
const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = "TEST_CUSTOMER_KEY"; 

type CheckoutClientProps = {
  user: any;
  items: any[];
  totalAmount: number;
  orderId: string;
};

export default function CheckoutClient({ user, items, totalAmount, orderId }: CheckoutClientProps) {
  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);
  const paymentMethodsWidgetRef = useRef<ReturnType<PaymentWidgetInstance["renderPaymentMethods"]> | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [usePoints, setUsePoints] = useState(0);

  // 최종 결제 금액 계산
  const finalAmount = Math.max(totalAmount - usePoints, 0);

  useEffect(() => {
    const initWidget = async () => {
      try {
        const paymentWidget = await loadPaymentWidget(clientKey, customerKey);
        
        // 결제 UI 렌더링
        const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
          "#payment-widget",
          { value: totalAmount },
          { variantKey: "DEFAULT" }
        );

        // 약관 UI 렌더링
        paymentWidget.renderAgreement(
          "#agreement", 
          { variantKey: "AGREEMENT" }
        );

        paymentWidgetRef.current = paymentWidget;
        paymentMethodsWidgetRef.current = paymentMethodsWidget;
        setIsReady(true);
      } catch (error) {
        console.error("결제 위젯 로드 실패:", error);
      }
    };

    initWidget();
  }, [totalAmount]);

  // 사용 포인트가 바뀔 때 토스 결제 위젯의 금액도 업데이트
  useEffect(() => {
    if (paymentMethodsWidgetRef.current) {
      paymentMethodsWidgetRef.current.updateAmount(finalAmount);
    }
  }, [finalAmount]);

  const handlePointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
    // 보유 포인트가 3000 미만이면 사용 불가
    if (user.points < 3000) return;
    
    // 최대 사용가능 포인트: 총 결제금액과 보유 포인트 중 작은 값
    const maxUsable = Math.min(totalAmount, user.points);
    // 10단위 절사 적용
    let appliedPoints = Math.floor(val / 10) * 10;
    
    if (appliedPoints > maxUsable) appliedPoints = Math.floor(maxUsable / 10) * 10;
    
    setUsePoints(appliedPoints);
  };

  const handleUseAllPoints = () => {
    if (user.points < 3000) return;
    const maxUsable = Math.min(totalAmount, user.points);
    setUsePoints(Math.floor(maxUsable / 10) * 10);
  };

  const handlePayment = async () => {
    // 0원 결제(전액 포인트 결제) 프리패스 로직
    if (finalAmount === 0) {
      const successUrl = new URL(`${window.location.origin}/checkout/success`);
      successUrl.searchParams.set("paymentKey", "FREE_PASS_" + Math.random().toString(36).substring(2, 9));
      successUrl.searchParams.set("orderId", orderId);
      successUrl.searchParams.set("amount", "0");
      successUrl.searchParams.set("usedPoints", usePoints.toString());
      window.location.href = successUrl.href;
      return;
    }

    const paymentWidget = paymentWidgetRef.current;
    
    try {
      const orderName = items.length > 1 
        ? `${items[0].product.name} 외 ${items.length - 1}건` 
        : items[0].product.name;

      // 성공 시 successUrl 쿼리파라미터로 사용한 포인트를 함께 전달하여 서버에서 처리하도록 함
      const successUrl = new URL(`${window.location.origin}/checkout/success`);
      successUrl.searchParams.set("usedPoints", usePoints.toString());

      await paymentWidget?.requestPayment({
        orderId: orderId,
        orderName: orderName,
        customerName: user.name || "비회원",
        customerEmail: user.email,
        customerMobilePhone: user.phone || "01012345678",
        successUrl: successUrl.href,
        failUrl: `${window.location.origin}/checkout/fail`,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="checkout-grid">
      <style>{`
        .checkout-grid {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 2rem;
          align-items: flex-start;
        }
        @media (max-width: 992px) {
          .checkout-grid {
            grid-template-columns: 1fr;
          }
          .checkout-sidebar {
            order: -1;
          }
        }
      `}</style>
      
      <div className="glass" style={{ padding: "2rem", borderRadius: "24px", minHeight: "400px", display: "flex", flexDirection: "column" }}>
        {/* 결제 UI */}
        <div id="payment-widget" style={{ width: "100%" }} />
        {/* 이용약관 UI */}
        <div id="agreement" style={{ width: "100%", marginTop: "1rem" }} />
      </div>

      <div className="glass checkout-sidebar" style={{ padding: "2rem", borderRadius: "24px", position: "sticky", top: "100px" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>주문 상품 내역</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {items.map(item => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--glass-border)", paddingBottom: "1rem", color: "var(--text-secondary)" }}>
              <span style={{ flex: 1, paddingRight: "1rem" }}>{item.product.name} <span style={{ fontWeight: 600 }}>x{item.quantity}</span></span>
              <span style={{ fontWeight: 600 }}>₩{((item.product.price + (item.option?.addPrice || 0)) * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          
          {/* 포인트 사용 영역 */}
          <div style={{ marginTop: "1rem", paddingTop: "1.5rem", borderTop: "1px dashed var(--glass-border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", alignItems: "center" }}>
              <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>포인트 사용</span>
              <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>보유: {user.points?.toLocaleString() || 0} P</span>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input 
                type="text" 
                value={usePoints === 0 ? '' : usePoints}
                onChange={handlePointChange}
                placeholder={user.points < 3000 ? "3,000P 이상 사용 가능" : "사용할 포인트 입력 (10P 단위)"}
                disabled={user.points < 3000}
                style={{ flex: 1, padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--glass-border)", outline: "none" }}
              />
              <button 
                onClick={handleUseAllPoints}
                disabled={user.points < 3000}
                style={{ padding: "0 1rem", borderRadius: "8px", background: "#f3f4f6", border: "1px solid #d1d5db", fontWeight: 600, color: "#4b5563", cursor: user.points < 3000 ? "not-allowed" : "pointer" }}
              >
                전액사용
              </button>
            </div>
            {usePoints > 0 && (
              <div style={{ color: "#ef4444", fontSize: "0.875rem", marginTop: "0.5rem", textAlign: "right" }}>
                - ₩{usePoints.toLocaleString()} 할인 적용됨
              </div>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: "1.5rem", marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px dashed var(--glass-border)" }}>
            <span>최종 결제 금액</span>
            <span style={{ color: "var(--accent-color)" }}>₩{finalAmount.toLocaleString()}</span>
          </div>
        </div>
        
        <button 
          onClick={handlePayment} 
          disabled={!isReady}
          className="btn btn-primary" 
          style={{ width: "100%", padding: "1.25rem", borderRadius: "12px", fontSize: "1.25rem", fontWeight: 700, marginTop: "2rem", background: isReady ? "var(--accent-color)" : "#ccc", border: "none", cursor: isReady ? "pointer" : "not-allowed", transition: "all 0.2s" }}
        >
          {isReady ? `₩${finalAmount.toLocaleString()} 결제하기` : "결제 모듈 로딩 중..."}
        </button>
      </div>
    </div>
  );
}

export default function ShippingPage() {
  return (
    <div className="glass" style={{ padding: "3rem", borderRadius: "24px" }}>
      <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "2rem" }}>배송 안내</h2>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
        <div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem" }}>배송 지역</h3>
          <p>전국 (일부 도서산간 지역 제외)</p>
        </div>
        
        <div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem" }}>배송 비용</h3>
          <p>
            전 상품 <strong>무료 배송</strong>을 원칙으로 합니다.<br />
            (단, 도서산간 지역의 경우 추가 배송비가 발생할 수 있습니다.)
          </p>
        </div>
        
        <div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem" }}>배송 기간</h3>
          <p>
            - 결제 완료 후 평균 1~3 영업일 이내 배송됩니다.<br />
            - <strong>내일 도착 보장</strong> 상품의 경우 오후 2시 이전 결제 시 다음날 도착합니다.<br />
            - 주말 및 공휴일은 배송 기간에서 제외됩니다.<br />
            - 재고 상황이나 택배사 사정에 따라 배송이 지연될 수 있습니다.
          </p>
        </div>
        
        <div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem" }}>배송 조회</h3>
          <p>
            상품 출고 시 카카오톡 알림톡 또는 SMS로 운송장 번호가 발송됩니다.<br />
            마이페이지의 '주문 내역'에서도 배송 상태 및 운송장 조회가 가능합니다.
          </p>
        </div>
      </div>
    </div>
  );
}

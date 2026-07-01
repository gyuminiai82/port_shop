export default function ReturnsPage() {
  return (
    <div className="glass" style={{ padding: "3rem", borderRadius: "24px" }}>
      <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "2rem" }}>교환 및 반품 안내</h2>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
        <div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem" }}>교환/반품 기간</h3>
          <p>
            - 상품 수령일로부터 <strong>7일 이내</strong>에 교환 및 반품이 가능합니다.<br />
            - 상품의 내용이 표시·광고의 내용과 다르거나 다르게 이행된 경우에는 상품을 수령한 날부터 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날부터 30일 이내에 교환/반품이 가능합니다.
          </p>
        </div>
        
        <div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem" }}>교환/반품 배송비</h3>
          <p>
            - <strong>단순 변심</strong>으로 인한 교환 및 반품 시 배송비는 고객님 부담입니다. (편도 3,000원 / 왕복 6,000원)<br />
            - 상품 불량 또는 오배송으로 인한 교환 및 반품 시 배송비는 당사에서 전액 부담합니다.
          </p>
        </div>
        
        <div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem" }}>교환/반품 불가 사유</h3>
          <ul style={{ paddingLeft: "1.5rem", margin: 0 }}>
            <li>포장을 개봉하여 상품 가치가 훼손된 경우 (단, 상품 확인을 위한 포장 개봉은 제외)</li>
            <li>고객님의 사용 또는 일부 소비에 의해 상품의 가치가 현저히 감소한 경우</li>
            <li>시간의 경과에 의해 재판매가 곤란할 정도로 상품의 가치가 현저히 감소한 경우</li>
            <li>복제가 가능한 상품의 포장을 훼손한 경우 (예: 소프트웨어 등)</li>
            <li>주문 제작 상품 등 고객님의 요청에 따라 개별적으로 생산되는 상품</li>
          </ul>
        </div>
        
        <div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem" }}>교환/반품 신청 방법</h3>
          <p>
            마이페이지 &gt; 주문 내역에서 직접 신청하시거나, <strong>고객센터 1:1 문의</strong>를 통해 접수해 주시면 신속하게 처리해 드리겠습니다.
          </p>
        </div>
      </div>
    </div>
  );
}

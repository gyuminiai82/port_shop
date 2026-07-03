"use client";

import React from "react";

export default function BenefitsPage() {
  return (
    <div className="glass" style={{ padding: "3rem", borderRadius: "24px" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "2rem", letterSpacing: "-0.03em" }}>
        포인트 및 등급 혜택 안내
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
        {/* 포인트 정책 */}
        <section>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem", color: "var(--accent-color)" }}>
            🪙 포인트 적립 및 사용
          </h2>
          <div style={{ background: "rgba(0,0,0,0.02)", padding: "2rem", borderRadius: "16px", border: "1px solid var(--glass-border)" }}>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              <li style={{ display: "flex", gap: "1rem" }}>
                <span style={{ fontWeight: 700, color: "var(--text-primary)", minWidth: "100px" }}>회원 가입</span>
                <span>신규 회원 가입 시 즉시 <strong>3,000P</strong> 적립!</span>
              </li>
              <li style={{ display: "flex", gap: "1rem" }}>
                <span style={{ fontWeight: 700, color: "var(--text-primary)", minWidth: "100px" }}>상품 구매</span>
                <span>실 결제 금액의 <strong>최대 5%</strong>가 구매 확정 시 자동 적립됩니다. (회원 등급별 차등 적용)</span>
              </li>
              <li style={{ display: "flex", gap: "1rem" }}>
                <span style={{ fontWeight: 700, color: "var(--text-primary)", minWidth: "100px" }}>리뷰 작성</span>
                <span>텍스트 리뷰 작성 시 <strong>500P</strong>, 포토 리뷰 작성 시 <strong>1,000P</strong> 적립!</span>
              </li>
              <li style={{ display: "flex", gap: "1rem" }}>
                <span style={{ fontWeight: 700, color: "var(--text-primary)", minWidth: "100px" }}>포인트 사용</span>
                <span>보유 포인트가 <strong>1,000P</strong> 이상일 때 상품 구매 시 1P 단위로 현금처럼 사용 가능합니다.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* 회원 등급 안내 */}
        <section>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem", color: "var(--accent-color)" }}>
            👑 회원 등급 혜택
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
            최근 6개월 간의 누적 결제 금액을 기준으로 매월 1일 등급이 산정됩니다.
          </p>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
            {/* BRONZE */}
            <div style={{ padding: "1.5rem", borderRadius: "16px", background: "white", border: "1px solid var(--glass-border)", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🥉</div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.5rem", color: "#cd7f32" }}>BRONZE</h3>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>가입 시 기본 등급</p>
              <div style={{ fontWeight: 700, background: "rgba(0,0,0,0.03)", padding: "0.5rem", borderRadius: "8px" }}>
                결제 금액의 1% 적립
              </div>
            </div>

            {/* SILVER */}
            <div style={{ padding: "1.5rem", borderRadius: "16px", background: "white", border: "1px solid var(--glass-border)", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🥈</div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.5rem", color: "#9ca3af" }}>SILVER</h3>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>누적 결제 30만원 이상</p>
              <div style={{ fontWeight: 700, background: "rgba(0,0,0,0.03)", padding: "0.5rem", borderRadius: "8px" }}>
                결제 금액의 2% 적립
                <div style={{ fontSize: "0.75rem", marginTop: "0.25rem", color: "var(--accent-color)" }}>+ 무료 배송 쿠폰 1장</div>
              </div>
            </div>

            {/* GOLD */}
            <div style={{ padding: "1.5rem", borderRadius: "16px", background: "white", border: "1px solid var(--glass-border)", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🥇</div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.5rem", color: "#fbbf24" }}>GOLD</h3>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>누적 결제 100만원 이상</p>
              <div style={{ fontWeight: 700, background: "rgba(0,0,0,0.03)", padding: "0.5rem", borderRadius: "8px" }}>
                결제 금액의 5% 적립
                <div style={{ fontSize: "0.75rem", marginTop: "0.25rem", color: "var(--accent-color)" }}>+ 상시 무료 배송</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

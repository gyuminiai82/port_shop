import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer style={{ background: "var(--glass-bg)", borderTop: "1px solid var(--glass-border)", padding: "4rem 2rem", marginTop: "auto" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "3rem" }}>
        
        {/* Brand / Company Info */}
        <div>
          <div style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "0.5rem" }}>
              <defs>
                <linearGradient id="brand-grad-footer" x1="0" y1="0" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--text-primary)" />
                  <stop offset="100%" stopColor="var(--accent-color)" />
                </linearGradient>
              </defs>
              <path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="url(#brand-grad-footer)" strokeWidth="2" strokeLinejoin="round" />
              <path d="M7 12L12 7L17 12" stroke="url(#brand-grad-footer)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: "1.5rem", fontWeight: 900, letterSpacing: "-0.05em", background: "linear-gradient(135deg, var(--text-primary) 30%, var(--accent-color) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              MINSTUDIO
            </span>
            <span style={{ fontSize: "1.5rem", fontWeight: 300, letterSpacing: "-0.02em", color: "var(--text-primary)", marginLeft: "0.25rem" }}>
              SHOP
            </span>
          </div>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1rem" }}>
            세상을 바꿀 프리미엄 디지털 라이프스타일.<br />
            혁신적인 테크 기기를 가장 완벽하게 만나는 곳.
          </p>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            대표: 김민수 | 사업자등록번호: 123-45-67890<br />
            서울특별시 강남구 테헤란로 123
          </p>
        </div>

        {/* Customer Service */}
        <div>
          <h4 style={{ fontWeight: 600, marginBottom: "1.5rem" }}>고객 서비스</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <li><Link href="/support/notice" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>공지사항</Link></li>
            <li><Link href="/support/inquiry" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>1:1 문의</Link></li>
            <li><Link href="/support/shipping" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>배송 안내</Link></li>
            <li><Link href="/support/returns" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>교환/반품 안내</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 style={{ fontWeight: 600, marginBottom: "1.5rem" }}>법적 고지</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <li><Link href="/privacy" style={{ color: "var(--text-primary)", fontWeight: 600, textDecoration: "none" }}>개인정보처리방침</Link></li>
            <li><Link href="/terms" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>이용약관</Link></li>
            <li><Link href="#" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>전자금융거래약관</Link></li>
          </ul>
        </div>

      </div>

      <div style={{ maxWidth: "1200px", margin: "4rem auto 0", paddingTop: "2rem", borderTop: "1px solid rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
        <div>&copy; {new Date().getFullYear()} MINSTUDIO SHOP. All rights reserved.</div>
      </div>
    </footer>
  );
}

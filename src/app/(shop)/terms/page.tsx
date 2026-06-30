import Link from "next/link";

export const metadata = {
  title: "이용약관 | MINSTUDIO SHOP",
  description: "MINSTUDIO SHOP 서비스 이용약관입니다.",
};

export default function TermsPage() {
  return (
    <main className="main-content" style={{ padding: "4rem 2rem", maxWidth: "800px", margin: "0 auto", marginTop: "var(--nav-height)" }}>
      <div className="glass" style={{ padding: "4rem", borderRadius: "24px" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "2rem", letterSpacing: "-0.03em" }}>이용약관</h1>
        
        <div style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "1.125rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem" }}>제1조(목적)</h2>
            <p>이 약관은 MINSTUDIO SHOP(전자상거래 사업자)이 운영하는 사이버 몰(이하 “몰”이라 한다)에서 제공하는 인터넷 관련 서비스(이하 “서비스”라 한다)를 이용함에 있어 사이버 몰과 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem" }}>제2조(정의)</h2>
            <p>① “몰”이란 회사가 재화 또는 용역(이하 “재화 등”이라 함)을 이용자에게 제공하기 위하여 컴퓨터 등 정보통신설비를 이용하여 재화 등을 거래할 수 있도록 설정한 가상의 영업장을 말하며, 아울러 사이버몰을 운영하는 사업자의 의미로도 사용합니다.</p>
            <p>② “이용자”란 “몰”에 접속하여 이 약관에 따라 “몰”이 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem" }}>제3조 (약관 등의 명시와 설명 및 개정)</h2>
            <p>① “몰”은 이 약관의 내용과 상호 및 대표자 성명, 영업소 소재지 주소, 전화번호, 모사전송번호, 전자우편주소, 사업자등록번호, 통신판매업 신고번호, 개인정보보호책임자등을 이용자가 쉽게 알 수 있도록 사이버몰의 초기 서비스화면(전면)에 게시합니다.</p>
            <p>② “몰”은 「전자상거래 등에서의 소비자보호에 관한 법률」, 「약관의 규제에 관한 법률」, 「전자문서 및 전자거래기본법」, 「전자금융거래법」, 「전자서명법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」, 「방문판매 등에 관한 법률」, 「소비자기본법」 등 관련 법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem" }}>제4조(서비스의 제공 및 변경)</h2>
            <p>① “몰”은 다음과 같은 업무를 수행합니다.<br/>
              1. 재화 또는 용역에 대한 정보 제공 및 구매계약의 체결<br/>
              2. 구매계약이 체결된 재화 또는 용역의 배송<br/>
              3. 기타 “몰”이 정하는 업무
            </p>
          </section>

          <p style={{ marginTop: "2rem", fontSize: "0.875rem", textAlign: "center" }}>본 약관은 2026년 6월 30일부터 적용됩니다.</p>
        </div>

        <div style={{ marginTop: "3rem", textAlign: "center" }}>
          <Link href="/" className="btn btn-secondary" style={{ padding: "1rem 2rem", borderRadius: "12px", fontWeight: 600 }}>
            메인으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}

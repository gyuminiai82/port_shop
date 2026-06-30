import Link from "next/link";

export const metadata = {
  title: "개인정보처리방침 | MINSTUDIO SHOP",
  description: "MINSTUDIO SHOP 개인정보처리방침입니다.",
};

export default function PrivacyPage() {
  return (
    <main className="main-content" style={{ padding: "4rem 2rem", maxWidth: "800px", margin: "0 auto", marginTop: "var(--nav-height)" }}>
      <div className="glass" style={{ padding: "4rem", borderRadius: "24px" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "2rem", letterSpacing: "-0.03em" }}>개인정보처리방침</h1>
        
        <div style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "1.125rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
          <p>MINSTUDIO SHOP(이하 "회사")은(는) 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.</p>
          
          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem" }}>제1조(개인정보의 처리 목적)</h2>
            <p>회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
            <p>1. 홈페이지 회원가입 및 관리<br/>
              회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 서비스 부정이용 방지 목적으로 개인정보를 처리합니다.<br/>
              2. 재화 또는 서비스 제공<br/>
              물품배송, 서비스 제공, 계약서·청구서 발송, 콘텐츠 제공, 맞춤 서비스 제공, 본인인증, 연령인증, 요금결제·정산을 목적으로 개인정보를 처리합니다.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem" }}>제2조(처리하는 개인정보의 항목)</h2>
            <p>회사는 다음의 개인정보 항목을 처리하고 있습니다.</p>
            <p>
              - 필수항목: 이메일, 비밀번호, 이름, 연락처<br/>
              - 선택항목: 배송지 주소, 생년월일
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem" }}>제3조(개인정보의 파기절차 및 파기방법)</h2>
            <p>① 회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.</p>
            <p>② 정보주체로부터 동의받은 개인정보 보유기간이 경과하거나 처리목적이 달성되었음에도 불구하고 다른 법령에 따라 개인정보를 계속 보존하여야 하는 경우에는, 해당 개인정보를 별도의 데이터베이스(DB)로 옮기거나 보관장소를 달리하여 보존합니다.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem" }}>제4조(개인정보 보호책임자)</h2>
            <p>① 회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.<br/>
              ▶ 개인정보 보호책임자<br/>
              - 성명 : XXX<br/>
              - 직책 : 대표<br/>
              - 연락처 : xxxxx@minstudio.app
            </p>
          </section>

          <p style={{ marginTop: "2rem", fontSize: "0.875rem", textAlign: "center" }}>본 개인정보처리방침은 2026년 6월 30일부터 적용됩니다.</p>
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

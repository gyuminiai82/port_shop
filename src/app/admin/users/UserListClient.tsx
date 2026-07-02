"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  tier: string;
  points: number;
  totalSpent: number;
  createdAt: Date;
};

export default function UserListClient({ users, currentPage, totalPages, searchQuery = "" }: { users: User[], currentPage: number, totalPages: number, searchQuery?: string }) {
  const router = useRouter();

  // 검색 상태
  const [query, setQuery] = useState(searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/admin/users?page=1${query.trim() ? `&q=${encodeURIComponent(query.trim())}` : ''}`);
  };

  // 모달 제어 상태
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // 폼 필드 상태
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editTier, setEditTier] = useState("");
  const [editPoints, setEditPoints] = useState<number>(0);

  const openModal = (user: User) => {
    setSelectedUser(user);
    setEditName(user.name || "");
    setEditPhone(user.phone || "");
    setEditTier(user.tier);
    setEditPoints(user.points);
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  const handleSave = async () => {
    if (!selectedUser) return;
    setIsUpdating(true);

    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          phone: editPhone,
          tier: editTier,
          points: editPoints
        })
      });

      if (!res.ok) {
        throw new Error("저장에 실패했습니다.");
      }

      closeModal();
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.5rem" }}>
        <form onSubmit={handleSearch} style={{ display: "flex", gap: "0.5rem" }}>
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="이름 또는 이메일 검색"
            style={{ padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none", width: "250px" }}
          />
          <button type="submit" style={{ padding: "0.5rem 1rem", background: "var(--accent-color)", color: "white", borderRadius: "8px", border: "none", fontWeight: 600, cursor: "pointer" }}>
            검색
          </button>
        </form>
      </div>

      <div className="glass" style={{ background: "white", padding: "2rem", borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", tableLayout: "fixed", minWidth: "1000px" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #f1f5f9", color: "#64748b" }}>
              <th style={{ width: "25%", padding: "1.5rem 1rem", fontWeight: 600 }}>이름/이메일</th>
              <th style={{ width: "15%", padding: "1.5rem 1rem", fontWeight: 600 }}>연락처</th>
              <th style={{ width: "10%", padding: "1.5rem 1rem", fontWeight: 600 }}>등급</th>
              <th style={{ width: "15%", padding: "1.5rem 1rem", fontWeight: 600 }}>포인트</th>
              <th style={{ width: "15%", padding: "1.5rem 1rem", fontWeight: 600 }}>총 결제금액</th>
              <th style={{ width: "10%", padding: "1.5rem 1rem", fontWeight: 600 }}>가입일</th>
              <th style={{ width: "10%", padding: "1.5rem 1rem", fontWeight: 600 }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: "3rem", textAlign: "center", color: "#9ca3af" }}>등록된 회원이 없습니다.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "1rem" }}>
                    <div style={{ fontWeight: 700, color: "#1f2937" }}>{user.name || '이름 없음'}</div>
                    <div style={{ fontSize: "0.875rem", color: "#64748b", marginTop: "0.25rem" }}>{user.email}</div>
                  </td>
                  <td style={{ padding: "1rem", color: "#64748b" }}>{user.phone || '-'}</td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{ 
                      padding: "0.25rem 0.75rem", 
                      borderRadius: "99px", 
                      background: user.tier === 'VIP' ? '#fef3c7' : user.tier === 'GOLD' ? '#fef08a' : '#f8f9fc', 
                      color: user.tier === 'VIP' ? '#b45309' : user.tier === 'GOLD' ? '#a16207' : '#64748b', 
                      fontWeight: 700, 
                      fontSize: "0.875rem" 
                    }}>
                      {user.tier}
                    </span>
                  </td>
                  <td style={{ padding: "1rem", fontWeight: 600, color: "#1f2937" }}>
                    {user.points.toLocaleString()} P
                  </td>
                  <td style={{ padding: "1rem", fontWeight: 600, color: "#1f2937" }}>
                    {user.totalSpent.toLocaleString()}원
                  </td>
                  <td style={{ padding: "1rem", color: "#64748b", fontSize: "0.875rem" }}>
                    {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <button 
                      onClick={() => openModal(user)}
                      style={{ padding: "0.5rem 1rem", background: "white", border: "1px solid #e2e8f0", borderRadius: "8px", fontWeight: 600, color: "#374151", cursor: "pointer", transition: "all 0.2s" }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--accent-color)"}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
                    >
                      상세
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 페이징 컨트롤 */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", marginTop: "2rem" }}>
          <button 
            onClick={() => router.push(`/admin/users?page=${Math.max(1, currentPage - 1)}`)}
            disabled={currentPage === 1}
            style={{ padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #e2e8f0", background: "white", cursor: currentPage === 1 ? "not-allowed" : "pointer", opacity: currentPage === 1 ? 0.5 : 1 }}
          >
            이전
          </button>
          
          <div style={{ display: "flex", gap: "0.25rem" }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
              <button
                key={pageNum}
                onClick={() => router.push(`/admin/users?page=${pageNum}`)}
                style={{
                  width: "2.5rem", height: "2.5rem",
                  borderRadius: "8px",
                  border: pageNum === currentPage ? "none" : "1px solid #e2e8f0",
                  background: pageNum === currentPage ? "var(--accent-color)" : "white",
                  color: pageNum === currentPage ? "white" : "#374151",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button 
            onClick={() => router.push(`/admin/users?page=${Math.min(totalPages, currentPage + 1)}`)}
            disabled={currentPage === totalPages}
            style={{ padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #e2e8f0", background: "white", cursor: currentPage === totalPages ? "not-allowed" : "pointer", opacity: currentPage === totalPages ? 0.5 : 1 }}
          >
            다음
          </button>
        </div>
      )}

      {/* 유저 정보 수정 모달 */}
      {selectedUser && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "white", padding: "2rem", borderRadius: "16px", width: "100%", maxWidth: "480px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem", color: "#1f2937" }}>회원 상세 및 수정</h2>
            <p style={{ color: "#6b7280", fontSize: "0.875rem", marginBottom: "1.5rem" }}>{selectedUser.email} 계정의 정보를 수정합니다.</p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* 이름 */}
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem", color: "#374151" }}>이름</label>
                <input 
                  type="text" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="사용자 이름"
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none", fontSize: "0.875rem" }}
                />
              </div>

              {/* 연락처 */}
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem", color: "#374151" }}>연락처</label>
                <input 
                  type="text" 
                  value={editPhone} 
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="010-0000-0000"
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none", fontSize: "0.875rem" }}
                />
              </div>

              {/* 등급 (자동 처리) */}
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem", color: "#374151" }}>
                  등급 <span style={{ color: "#9ca3af", fontWeight: 400, fontSize: "0.75rem", marginLeft: "0.5rem" }}>(누적 결제액에 따라 자동 산정)</span>
                </label>
                <select 
                  value={editTier} 
                  disabled
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#f9fafb", outline: "none", fontSize: "0.875rem", color: "#9ca3af", cursor: "not-allowed" }}
                >
                  <option value="BRONZE">BRONZE</option>
                  <option value="SILVER">SILVER</option>
                  <option value="GOLD">GOLD</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>

              {/* 포인트 */}
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem", color: "#374151" }}>포인트 지급/수정</label>
                <div style={{ position: "relative" }}>
                  <input 
                    type="number" 
                    value={editPoints} 
                    onChange={(e) => setEditPoints(Number(e.target.value))}
                    style={{ width: "100%", padding: "0.75rem", paddingRight: "2.5rem", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none", fontSize: "0.875rem" }}
                  />
                  <span style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", color: "#6b7280", fontWeight: 600, fontSize: "0.875rem" }}>P</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "2rem", justifyContent: "flex-end" }}>
              <button 
                onClick={closeModal}
                disabled={isUpdating}
                style={{ padding: "0.75rem 1.25rem", borderRadius: "8px", border: "1px solid #d1d5db", background: "white", fontWeight: 600, cursor: "pointer", color: "#4b5563" }}
              >
                취소
              </button>
              <button 
                onClick={handleSave}
                disabled={isUpdating}
                style={{ padding: "0.75rem 1.25rem", borderRadius: "8px", border: "none", background: "var(--accent-color)", color: "white", fontWeight: 600, cursor: "pointer" }}
              >
                {isUpdating ? "저장 중..." : "저장하기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

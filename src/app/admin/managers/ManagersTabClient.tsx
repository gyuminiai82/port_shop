"use client";

import React, { useState } from "react";
import ManagerListClient from "./ManagerListClient";
import RoleListClient from "./RoleListClient";

export default function ManagersTabClient() {
  const [activeTab, setActiveTab] = useState<"managers" | "roles">("managers");

  return (
    <div>
      <div style={{ display: "flex", gap: "1rem", borderBottom: "2px solid #e5e7eb", marginBottom: "2rem" }}>
        <button
          onClick={() => setActiveTab("managers")}
          style={{
            padding: "0.75rem 1.5rem",
            background: "none",
            border: "none",
            borderBottom: activeTab === "managers" ? "3px solid var(--accent-color)" : "3px solid transparent",
            color: activeTab === "managers" ? "var(--accent-color)" : "var(--text-secondary)",
            fontWeight: activeTab === "managers" ? 700 : 500,
            fontSize: "1rem",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
        >
          운영진 목록
        </button>
        <button
          onClick={() => setActiveTab("roles")}
          style={{
            padding: "0.75rem 1.5rem",
            background: "none",
            border: "none",
            borderBottom: activeTab === "roles" ? "3px solid var(--accent-color)" : "3px solid transparent",
            color: activeTab === "roles" ? "var(--accent-color)" : "var(--text-secondary)",
            fontWeight: activeTab === "roles" ? 700 : 500,
            fontSize: "1rem",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
        >
          역할(Role) 관리
        </button>
      </div>

      <div style={{ animation: "fadeIn 0.3s ease" }}>
        {activeTab === "managers" && <ManagerListClient />}
        {activeTab === "roles" && <RoleListClient />}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type ViewedProduct = {
  id: string;
  name: string;
  image: string;
};

export default function RecentlyViewedSidebar() {
  const [items, setItems] = useState<ViewedProduct[]>([]);

  const loadItems = () => {
    try {
      const stored = localStorage.getItem('recentlyViewed');
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    // 초기 로드
    loadItems();
    
    // 다른 탭/창에서의 변경 및 동일 창에서의 이벤트 리스닝
    window.addEventListener('recentlyViewedUpdated', loadItems);
    window.addEventListener('storage', loadItems);
    
    return () => {
      window.removeEventListener('recentlyViewedUpdated', loadItems);
      window.removeEventListener('storage', loadItems);
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      right: '2rem',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '90px',
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(0, 0, 0, 0.05)',
      borderRadius: '20px',
      padding: '1rem 0.5rem',
      boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-primary)', textAlign: 'center', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
        최근 본<br/>상품
      </div>
      
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
        {items.map((item) => (
          <Link key={item.id} href={`/product/${item.id}`} style={{ display: 'block', textDecoration: 'none' }}>
            <div style={{
              position: 'relative',
              width: '64px',
              height: '64px',
              borderRadius: '14px',
              overflow: 'hidden',
              border: '2px solid transparent',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-color)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
            }}
            title={item.name}
            >
              <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} sizes="64px" />
            </div>
          </Link>
        ))}
      </div>
      
      <button 
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        style={{
          marginTop: '0.5rem',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'var(--text-primary)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.2rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          transition: 'transform 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        title="위로 가기"
      >
        ↑
      </button>
    </div>
  );
}

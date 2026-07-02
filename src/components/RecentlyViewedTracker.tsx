"use client";

import { useEffect } from "react";

type ProductData = {
  id: string;
  name: string;
  image: string;
};

export default function RecentlyViewedTracker({ product }: { product: ProductData }) {
  useEffect(() => {
    if (!product.image) return; // 이미지 없으면 스킵

    try {
      const stored = localStorage.getItem('recentlyViewed');
      let items: ProductData[] = stored ? JSON.parse(stored) : [];
      
      // 이미 있으면 제거하고 최상단으로 올리기 위함
      items = items.filter(item => item.id !== product.id);
      
      // 맨 앞에 추가
      items.unshift(product);
      
      // 최대 5개까지만 유지
      if (items.length > 5) {
        items = items.slice(0, 5);
      }
      
      localStorage.setItem('recentlyViewed', JSON.stringify(items));
      
      // 사이드바에 업데이트 이벤트 발생
      window.dispatchEvent(new Event('recentlyViewedUpdated'));
    } catch (e) {
      console.error('Failed to save recently viewed product', e);
    }
  }, [product]);

  return null;
}

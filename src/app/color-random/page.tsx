'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const colors = ['red', 'green', 'blue'] as const;
type Color = (typeof colors)[number];

export default function ColorRandomPage() {
  const [currentColor, setCurrentColor] = useState<Color>('red');
  const [isAnimating, setIsAnimating] = useState(false);

  const changeColor = useCallback(() => {
    // 모든 색상 중에서 랜덤 선택 (같은 색상도 가능)
    const randomIndex = Math.floor(Math.random() * colors.length);
    setIsAnimating(true);
    setCurrentColor(colors[randomIndex]);

    // 애니메이션 완료 후 상태 리셋
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        changeColor();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [changeColor]);

  const colorClasses = {
    red: 'bg-red-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-8">
      <div
        className={cn(
          'h-64 w-64 rounded-lg transition-colors duration-300',
          colorClasses[currentColor],
          isAnimating && 'animate-color-pulse',
        )}
      />
      <Button onClick={changeColor} size="lg">
        색상 변경
      </Button>
      <p className="text-muted-foreground text-sm">
        현재 색상:{' '}
        {currentColor === 'red'
          ? '빨강'
          : currentColor === 'green'
            ? '초록'
            : '파랑'}
      </p>
      <p className="text-muted-foreground text-xs">
        스페이스바를 눌러도 색상을 변경할 수 있습니다
      </p>
    </div>
  );
}

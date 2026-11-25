import { useEffect } from 'react';

// 배경 스크롤 잠금 (AGENTS.md 5.1.1 오버레이): 잠글 때 body overflow hidden, 풀리거나 언마운트되면 이전 값으로 복원
// Modal·Loading(전체 화면)에서 사용
export const useScrollLock = (isLocked: boolean) => {
    useEffect(() => {
        if (!isLocked) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isLocked]);
};

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import Portal from '../components/common/Portal';
import Toast from '../components/common/Toast';
import { TOAST_DURATION } from '../constants';
import { ToastContext } from '../hooks/useToast';
import type { ToastItem, ToastOptions } from '../types';

// Toast 상태 Provider (docs/components/Toast.md, D9) — Layout·MemberLayout에서 1회 감쌉니다.
// 표시 UI(Toast.tsx)는 #modalWrap Portal로 렌더링합니다.
interface ToastProviderProps {
    children: ReactNode;
}

const ToastProvider = ({ children }: ToastProviderProps) => {
    const [items, setItems] = useState<ToastItem[]>([]);
    const nextIdRef = useRef(0);
    const timersRef = useRef(new Map<string, number>());

    const closeToast = useCallback((id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
        const timer = timersRef.current.get(id);
        if (timer !== undefined) {
            window.clearTimeout(timer);
            timersRef.current.delete(id);
        }
    }, []);

    const showToast = useCallback(
        (message: string, options: ToastOptions = {}) => {
            nextIdRef.current += 1;
            const id = `toast${nextIdRef.current}`;
            const item: ToastItem = { id, message, type: options.type ?? 'default', position: options.position ?? 'bottom-right' };
            setItems((prev) => [...prev, item]);
            timersRef.current.set(id, window.setTimeout(() => closeToast(id), options.duration ?? TOAST_DURATION));
        },
        [closeToast]
    );

    // 언마운트 시 남은 타이머 정리
    useEffect(() => {
        const timers = timersRef.current;
        return () => timers.forEach((timer) => window.clearTimeout(timer));
    }, []);

    const value = useMemo(() => ({ showToast }), [showToast]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            <Portal>
                <Toast items={items} onClose={closeToast} />
            </Portal>
        </ToastContext.Provider>
    );
};

export default ToastProvider;

import { createContext, useContext } from 'react';
import type { ToastOptions } from '../types';

// Toast 띄우기 (docs/components/Toast.md): const { showToast } = useToast(); showToast('저장했습니다.', { type: 'success' });
// Context 값은 providers/ToastProvider.tsx가 채웁니다.
interface ToastContextValue {
    showToast: (message: string, options?: ToastOptions) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast는 ToastProvider 안에서 사용합니다.');
    return context;
};

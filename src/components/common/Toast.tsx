import type { ToastItem, ToastPosition, ToastType } from '../../types';
import { toCamelCase } from '../../utils/classNames';

// 토스트 표시 UI (docs/components/Toast.md, shadcn/ui Sonner 참고)
// 상태·띄우기는 providers/ToastProvider.tsx + hooks/useToast.ts. 이 컴포넌트는 ToastProvider가 #modalWrap에 렌더링합니다.
// 위치별 목록은 항상 렌더링해 두어(aria-live) 새 알림이 읽히게 하고, error는 role="alert"
interface ToastProps {
    items: ToastItem[];
    onClose: (id: string) => void;
}

const POSITIONS: ToastPosition[] = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'];

const TYPE_ICONS: Record<ToastType, string> = {
    default: '',
    success: 'iconCircleCheck',
    info: 'iconInfo',
    warning: 'iconTriangleAlert',
    error: 'iconCircleAlert'
};

const Toast = ({ items, onClose }: ToastProps) => {
    return (
        <div className="toastRoot">
            {POSITIONS.map((position) => (
                <div key={position} className={`toastList ${toCamelCase(position)}`} role="status" aria-live="polite">
                    {items
                        .filter((item) => item.position === position)
                        .map((item) => (
                            <div key={item.id} className={`toastItem ${item.type}`} role={item.type === 'error' ? 'alert' : undefined}>
                                {TYPE_ICONS[item.type] && <span className={`iconMask ${TYPE_ICONS[item.type]} toastIcon`} aria-hidden="true" />}
                                <p className="toastMessage">{item.message}</p>
                                <button type="button" className="toastClose" aria-label="알림 닫기" onClick={() => onClose(item.id)}>
                                    <span className="iconMask iconClose" aria-hidden="true" />
                                </button>
                            </div>
                        ))}
                </div>
            ))}
        </div>
    );
};

export default Toast;

import { useEffect, useId, useRef } from 'react';
import type { KeyboardEvent, MouseEvent, ReactNode } from 'react';
import Portal from './Portal';
import { useScrollLock } from '../../hooks/useScrollLock';

// 모달 (docs/components/Modal.md, shadcn/ui Dialog·Alert Dialog 참고). Alert Dialog는 size="alert"로 통합 (D6)
// #modalWrap Portal, role=dialog|alertdialog, aria-modal, ESC 닫기, 포커스 트랩, 닫으면 연 버튼으로 포커스 복귀, 배경 스크롤 잠금
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    size?: 'alert' | 'small' | 'medium' | 'large' | 'full';
    title?: string;
    footer?: ReactNode;
    children: ReactNode;
}

const FOCUSABLE_SELECTOR =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const getFocusable = (container: HTMLElement) => Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

const Modal = ({ isOpen, onClose, size = 'medium', title, footer, children }: ModalProps) => {
    const titleId = useId();
    const dialogRef = useRef<HTMLDivElement>(null);
    const isAlert = size === 'alert';

    useScrollLock(isOpen);

    // 열면 안쪽 첫 포커스 요소로, 닫히면 연 버튼으로 포커스 이동
    useEffect(() => {
        if (!isOpen) return;
        const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        const dialog = dialogRef.current;
        if (dialog) (getFocusable(dialog)[0] ?? dialog).focus();
        return () => opener?.focus();
    }, [isOpen]);

    if (!isOpen) return null;

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Escape') {
            event.stopPropagation();
            onClose();
            return;
        }
        if (event.key !== 'Tab' || !dialogRef.current) return;
        const focusable = getFocusable(dialogRef.current);
        if (focusable.length === 0) {
            event.preventDefault();
            return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    };

    // 바깥(딤) 클릭으로 닫기. alert는 버튼으로만 닫습니다.
    const handleOverlayMouseDown = (event: MouseEvent<HTMLDivElement>) => {
        if (!isAlert && event.target === event.currentTarget) onClose();
    };

    return (
        <Portal>
            <div className="modalOverlay" onMouseDown={handleOverlayMouseDown}>
                <div
                    ref={dialogRef}
                    className={`modal ${size}`}
                    role={isAlert ? 'alertdialog' : 'dialog'}
                    aria-modal="true"
                    aria-labelledby={titleId}
                    tabIndex={-1}
                    onKeyDown={handleKeyDown}
                >
                    <div className="modalHeader">
                        <h2 id={titleId} className={title ? 'modalTitle' : 'srOnly'}>
                            {title ?? '알림'}
                        </h2>
                        {!isAlert && (
                            <button type="button" className="modalClose" aria-label="닫기" onClick={onClose}>
                                <span className="iconMask iconClose" aria-hidden="true" />
                            </button>
                        )}
                    </div>
                    <div className="modalBody">{children}</div>
                    {footer && <div className="modalFooter">{footer}</div>}
                </div>
            </div>
        </Portal>
    );
};

export default Modal;

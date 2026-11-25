import { useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { Placement } from '../../types';
import { classNames, toCamelCase } from '../../utils/classNames';

// 팝오버 (docs/components/Popover.md, shadcn/ui Popover 참고)
// Portal 없이 트리거 옆. 바깥 클릭·ESC로 닫기, ESC로 닫으면 트리거로 포커스 복귀. 트리거 aria-expanded·aria-controls
interface PopoverProps {
    trigger: ReactNode;
    title?: string;
    placement?: Placement;
    size?: 'sm' | 'md' | 'lg';
    children: ReactNode;
}

const Popover = ({ trigger, title, placement = 'bottom', size = 'md', children }: PopoverProps) => {
    const panelId = useId();
    const titleId = useId();
    const [isOpen, setIsOpen] = useState(false);
    const wrapRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        const handlePointerDown = (event: PointerEvent) => {
            if (event.target instanceof Node && !wrapRef.current?.contains(event.target)) setIsOpen(false);
        };
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Escape') return;
            setIsOpen(false);
            triggerRef.current?.focus();
        };
        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    return (
        <div className="popoverWrap" ref={wrapRef}>
            <button
                ref={triggerRef}
                type="button"
                className={classNames('popoverTrigger', isOpen && 'on')}
                aria-haspopup="dialog"
                aria-expanded={isOpen}
                aria-controls={isOpen ? panelId : undefined}
                onClick={() => setIsOpen((prev) => !prev)}
            >
                {trigger}
            </button>
            {isOpen && (
                <div id={panelId} role="dialog" aria-labelledby={title ? titleId : undefined} className={classNames('popover', size, toCamelCase(placement))}>
                    {title && (
                        <strong id={titleId} className="popoverTitle">
                            {title}
                        </strong>
                    )}
                    <div className="popoverBody">{children}</div>
                </div>
            )}
        </div>
    );
};

export default Popover;

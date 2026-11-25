import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { classNames } from '../../utils/classNames';

// 드롭다운 메뉴 (docs/components/DropdownMenu.md, shadcn/ui Dropdown Menu 참고)
// WAI-ARIA Menu Button: 트리거 aria-haspopup="menu"·aria-expanded, 메뉴 role="menu" > role="menuitem"
// ↓·Enter·Space로 열고 첫 항목, ↑로 열고 마지막 항목 / 메뉴 안 ↑↓·Home·End 이동, ESC는 닫고 트리거로, Tab은 닫기
interface DropdownMenuItem {
    id: string;
    label: string;
    onSelect?: () => void;
    disabled?: boolean;
    isDanger?: boolean;
}

interface DropdownMenuProps {
    label: string;
    items: DropdownMenuItem[];
    align?: 'start' | 'end';
}

const DropdownMenu = ({ label, items, align = 'start' }: DropdownMenuProps) => {
    const triggerId = useId();
    const menuId = useId();
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const wrapRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const enabledIndexes = items.flatMap((item, index) => (item.disabled ? [] : [index]));

    // 열린 상태에서 활성 항목으로 포커스 이동
    useEffect(() => {
        if (isOpen && activeIndex >= 0) itemRefs.current[activeIndex]?.focus();
    }, [isOpen, activeIndex]);

    // 바깥 클릭으로 닫기
    useEffect(() => {
        if (!isOpen) return;
        const handlePointerDown = (event: PointerEvent) => {
            if (event.target instanceof Node && !wrapRef.current?.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener('pointerdown', handlePointerDown);
        return () => document.removeEventListener('pointerdown', handlePointerDown);
    }, [isOpen]);

    const openMenu = (index: number) => {
        setActiveIndex(index);
        setIsOpen(true);
    };

    const closeMenu = (shouldFocusTrigger: boolean) => {
        setIsOpen(false);
        setActiveIndex(-1);
        if (shouldFocusTrigger) triggerRef.current?.focus();
    };

    const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openMenu(enabledIndexes[0] ?? -1);
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            openMenu(enabledIndexes[enabledIndexes.length - 1] ?? -1);
        }
    };

    const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        const position = enabledIndexes.indexOf(activeIndex);
        let nextIndex: number | undefined;
        if (event.key === 'ArrowDown') nextIndex = enabledIndexes[(position + 1) % enabledIndexes.length];
        else if (event.key === 'ArrowUp') nextIndex = enabledIndexes[(position - 1 + enabledIndexes.length) % enabledIndexes.length];
        else if (event.key === 'Home') nextIndex = enabledIndexes[0];
        else if (event.key === 'End') nextIndex = enabledIndexes[enabledIndexes.length - 1];
        else if (event.key === 'Escape') {
            event.preventDefault();
            closeMenu(true);
            return;
        } else if (event.key === 'Tab') {
            closeMenu(false);
            return;
        }
        if (nextIndex === undefined) return;
        event.preventDefault();
        setActiveIndex(nextIndex);
    };

    const handleSelect = (item: DropdownMenuItem) => {
        if (item.disabled) return;
        item.onSelect?.();
        closeMenu(true);
    };

    return (
        <div className="dropdown" ref={wrapRef}>
            <button
                ref={triggerRef}
                id={triggerId}
                type="button"
                className={classNames('dropdownTrigger', isOpen && 'on')}
                aria-haspopup="menu"
                aria-expanded={isOpen}
                aria-controls={isOpen ? menuId : undefined}
                onClick={() => (isOpen ? closeMenu(false) : openMenu(-1))}
                onKeyDown={handleTriggerKeyDown}
            >
                <span>{label}</span>
                <span className="iconMask iconChevronDown dropdownIcon" aria-hidden="true" />
            </button>
            {isOpen && (
                <div id={menuId} role="menu" aria-labelledby={triggerId} className={`dropdownMenu ${align}`} onKeyDown={handleMenuKeyDown}>
                    {items.map((item, index) => (
                        <button
                            key={item.id}
                            ref={(element) => {
                                itemRefs.current[index] = element;
                            }}
                            type="button"
                            role="menuitem"
                            tabIndex={-1}
                            aria-disabled={item.disabled || undefined}
                            className={classNames('dropdownItem', item.isDanger && 'danger', item.disabled && 'disabled')}
                            onClick={() => handleSelect(item)}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DropdownMenu;

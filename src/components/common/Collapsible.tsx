import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import { classNames } from '../../utils/classNames';

// 단일 접기/펼치기 (docs/components/Collapsible.md, shadcn/ui Collapsible 참고). 여러 항목 묶음은 Accordion을 사용합니다.
// isOpen을 넘기면 제어형, 없으면 defaultOpen으로 내부 상태 사용
interface CollapsibleProps {
    title: string;
    isOpen?: boolean;
    defaultOpen?: boolean;
    onChange?: (isOpen: boolean) => void;
    disabled?: boolean;
    children: ReactNode;
}

const Collapsible = ({ title, isOpen, defaultOpen = false, onChange, disabled = false, children }: CollapsibleProps) => {
    const contentId = useId();
    const [innerOpen, setInnerOpen] = useState(defaultOpen);
    const isControlled = isOpen !== undefined;
    const isCurrentOpen = isControlled ? isOpen : innerOpen;

    const handleToggle = () => {
        const next = !isCurrentOpen;
        if (!isControlled) setInnerOpen(next);
        onChange?.(next);
    };

    return (
        <div className={classNames('collapsible', isCurrentOpen && 'on', disabled && 'disabled')}>
            <button type="button" className="collapsibleTrigger" aria-expanded={isCurrentOpen} aria-controls={contentId} disabled={disabled} onClick={handleToggle}>
                <span>{title}</span>
                <span className="iconMask iconChevronDown collapsibleIcon" aria-hidden="true" />
            </button>
            <div id={contentId} className="collapsibleContent" hidden={!isCurrentOpen}>
                {children}
            </div>
        </div>
    );
};

export default Collapsible;

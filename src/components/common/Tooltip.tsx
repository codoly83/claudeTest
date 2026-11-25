import { cloneElement, useId, useState } from 'react';
import type { ReactElement } from 'react';
import { classNames } from '../../utils/classNames';

// 툴팁 (docs/components/Tooltip.md, shadcn/ui Tooltip 참고)
// Portal 없이 트리거 옆에 렌더링. hover·focus 모두에서 표시, ESC로 숨김, role="tooltip" + 트리거 aria-describedby
// children은 포커스 가능한 요소(버튼 등) 하나여야 합니다.
interface TooltipProps {
    content: string;
    placement?: 'top' | 'right' | 'bottom' | 'left';
    hasArrow?: boolean;
    children: ReactElement<{ 'aria-describedby'?: string }>;
}

const Tooltip = ({ content, placement = 'top', hasArrow = true, children }: TooltipProps) => {
    const tooltipId = useId();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <span
            className="tooltipWrap"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setIsOpen(false)}
            onKeyDown={(event) => {
                if (event.key === 'Escape') setIsOpen(false);
            }}
        >
            {cloneElement(children, { 'aria-describedby': tooltipId })}
            <span id={tooltipId} role="tooltip" className={classNames('tooltip', placement, hasArrow && 'hasArrow', isOpen && 'on')}>
                {content}
            </span>
        </span>
    );
};

export default Tooltip;

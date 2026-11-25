import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { classNames } from '../../utils/classNames';

// 아코디언 (docs/components/Accordion.md, shadcn/ui Accordion 참고)
// WAI-ARIA Accordion: 버튼 aria-expanded·aria-controls, 패널 role="region", ↑↓·Home·End 이동
interface AccordionItem {
    id: string;
    title: string;
    content: ReactNode;
    disabled?: boolean;
}

interface AccordionProps {
    items: AccordionItem[];
    isMultiple?: boolean;
    isCollapsible?: boolean;
    defaultOpenIds?: string[];
}

const Accordion = ({ items, isMultiple = false, isCollapsible = true, defaultOpenIds = [] }: AccordionProps) => {
    const baseId = useId();
    const [openIds, setOpenIds] = useState<string[]>(defaultOpenIds);
    const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const handleToggle = (id: string) => {
        setOpenIds((prev) => {
            const isOpen = prev.includes(id);
            if (isMultiple) return isOpen ? prev.filter((openId) => openId !== id) : [...prev, id];
            if (isOpen) return isCollapsible ? [] : prev;
            return [id];
        });
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
        const enabled = items.flatMap((item, itemIndex) => (item.disabled ? [] : [itemIndex]));
        const position = enabled.indexOf(index);
        let nextIndex: number | undefined;
        if (event.key === 'ArrowDown') nextIndex = enabled[(position + 1) % enabled.length];
        else if (event.key === 'ArrowUp') nextIndex = enabled[(position - 1 + enabled.length) % enabled.length];
        else if (event.key === 'Home') nextIndex = enabled[0];
        else if (event.key === 'End') nextIndex = enabled[enabled.length - 1];
        if (nextIndex === undefined) return;
        event.preventDefault();
        triggerRefs.current[nextIndex]?.focus();
    };

    return (
        <div className="accordion">
            {items.map((item, index) => {
                const isOpen = openIds.includes(item.id);
                const triggerId = `${baseId}trigger${index}`;
                const panelId = `${baseId}panel${index}`;
                return (
                    <div key={item.id} className={classNames('accordionItem', isOpen && 'on', item.disabled && 'disabled')}>
                        <h3 className="accordionHeading">
                            <button
                                ref={(element) => {
                                    triggerRefs.current[index] = element;
                                }}
                                id={triggerId}
                                type="button"
                                className="accordionTrigger"
                                aria-expanded={isOpen}
                                aria-controls={panelId}
                                disabled={item.disabled}
                                onClick={() => handleToggle(item.id)}
                                onKeyDown={(event) => handleKeyDown(event, index)}
                            >
                                <span>{item.title}</span>
                                <span className="iconMask iconChevronDown accordionIcon" aria-hidden="true" />
                            </button>
                        </h3>
                        <div id={panelId} role="region" aria-labelledby={triggerId} className="accordionPanel" hidden={!isOpen}>
                            {item.content}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Accordion;

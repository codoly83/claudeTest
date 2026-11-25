import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { classNames } from '../../utils/classNames';

// 탭 (docs/components/Tabs.md, shadcn/ui Tabs 참고)
// WAI-ARIA Tabs: role=tablist/tab/tabpanel, aria-selected, 로빙 tabindex, ←→·Home·End (자동 활성화)
interface TabItem {
    id: string;
    label: string;
    content: ReactNode;
    disabled?: boolean;
}

interface TabsProps {
    items: TabItem[];
    label?: string;
    appearance?: 'default' | 'line';
    activeIndex?: number;
    onChange?: (index: number) => void;
}

const Tabs = ({ items, label, appearance = 'default', activeIndex, onChange }: TabsProps) => {
    const baseId = useId();
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const [innerIndex, setInnerIndex] = useState(() => Math.max(0, items.findIndex((item) => !item.disabled)));
    const currentIndex = activeIndex ?? innerIndex;

    const handleSelect = (index: number) => {
        if (activeIndex === undefined) setInnerIndex(index);
        onChange?.(index);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
        const enabled = items.flatMap((item, itemIndex) => (item.disabled ? [] : [itemIndex]));
        const position = enabled.indexOf(index);
        let nextIndex: number | undefined;
        if (event.key === 'ArrowRight') nextIndex = enabled[(position + 1) % enabled.length];
        else if (event.key === 'ArrowLeft') nextIndex = enabled[(position - 1 + enabled.length) % enabled.length];
        else if (event.key === 'Home') nextIndex = enabled[0];
        else if (event.key === 'End') nextIndex = enabled[enabled.length - 1];
        if (nextIndex === undefined) return;
        event.preventDefault();
        tabRefs.current[nextIndex]?.focus();
        handleSelect(nextIndex);
    };

    return (
        <div className={`tabs ${appearance}`}>
            <div role="tablist" aria-label={label} className="tabList">
                {items.map((item, index) => {
                    const isOn = index === currentIndex;
                    return (
                        <button
                            key={item.id}
                            ref={(element) => {
                                tabRefs.current[index] = element;
                            }}
                            id={`${baseId}tab${index}`}
                            type="button"
                            role="tab"
                            aria-selected={isOn}
                            aria-controls={`${baseId}panel${index}`}
                            tabIndex={isOn ? 0 : -1}
                            disabled={item.disabled}
                            className={classNames('tabItem', isOn && 'on', item.disabled && 'disabled')}
                            onClick={() => handleSelect(index)}
                            onKeyDown={(event) => handleKeyDown(event, index)}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </div>
            {items.map((item, index) => (
                <div
                    key={item.id}
                    id={`${baseId}panel${index}`}
                    role="tabpanel"
                    aria-labelledby={`${baseId}tab${index}`}
                    tabIndex={0}
                    className="tabPanel"
                    hidden={index !== currentIndex}
                >
                    {item.content}
                </div>
            ))}
        </div>
    );
};

export default Tabs;

import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import { DndContext, KeyboardSensor, PointerSensor, TouchSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { classNames } from '../../utils/classNames';

// 순서 바꾸기 목록 (docs/components/SortableList.md) — @dnd-kit
// 그립 핸들 드래그(마우스·터치 길게 누르기), 핸들에서 Space → ↑↓ → Space(키보드), 항목마다 '위로·아래로' 버튼을 함께 제공
// 순서가 바뀌면 aria-live로 안내합니다.
interface SortableListProps<T extends { id: string }> {
    items: T[];
    onChange?: (items: T[]) => void;
    renderItem: (item: T) => ReactNode;
    getItemLabel: (item: T) => string;
    label: string;
}

interface SortableRowProps {
    id: string;
    itemLabel: string;
    index: number;
    count: number;
    onMove: (from: number, to: number) => void;
    children: ReactNode;
}

const SortableRow = ({ id, itemLabel, index, count, onMove, children }: SortableRowProps) => {
    const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id });

    return (
        <li
            ref={setNodeRef}
            className={classNames('sortableItem', isDragging && 'on')}
            // [inline-style] 드래그 중 위치: @dnd-kit이 포인터 위치로 계산하는 동적 값 (transform, transition)
            style={{ transform: CSS.Transform.toString(transform), transition }}
        >
            <button type="button" ref={setActivatorNodeRef} className="sortableHandle" aria-label={`${itemLabel} 끌어서 이동`} {...attributes} {...listeners}>
                <span className="iconMask iconGripVertical" aria-hidden="true" />
            </button>
            <div className="sortableContent">{children}</div>
            <div className="sortableButtons">
                <button type="button" className="sortableMove" aria-label={`${itemLabel} 위로`} disabled={index === 0} onClick={() => onMove(index, index - 1)}>
                    <span className="iconMask iconArrowUp" aria-hidden="true" />
                </button>
                <button type="button" className="sortableMove" aria-label={`${itemLabel} 아래로`} disabled={index === count - 1} onClick={() => onMove(index, index + 1)}>
                    <span className="iconMask iconArrowDown" aria-hidden="true" />
                </button>
            </div>
        </li>
    );
};

const SortableList = <T extends { id: string }>({ items, onChange, renderItem, getItemLabel, label }: SortableListProps<T>) => {
    const dndId = useId();
    const [message, setMessage] = useState('');
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleMove = (from: number, to: number) => {
        if (to < 0 || to >= items.length || from === to) return;
        onChange?.(arrayMove(items, from, to));
        setMessage(`${getItemLabel(items[from])}을(를) ${to + 1}번째로 옮겼습니다.`);
    };

    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        if (!over || active.id === over.id) return;
        handleMove(
            items.findIndex((item) => item.id === active.id),
            items.findIndex((item) => item.id === over.id)
        );
    };

    return (
        <div className="sortableList">
            <DndContext id={dndId} sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                    <ul className="sortableItems" aria-label={label}>
                        {items.map((item, index) => (
                            <SortableRow key={item.id} id={item.id} itemLabel={getItemLabel(item)} index={index} count={items.length} onMove={handleMove}>
                                {renderItem(item)}
                            </SortableRow>
                        ))}
                    </ul>
                </SortableContext>
            </DndContext>
            <p className="srOnly" aria-live="polite">
                {message}
            </p>
        </div>
    );
};

export default SortableList;

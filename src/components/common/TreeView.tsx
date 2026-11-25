import { useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TreeNode, TreeNodeId } from '../../types';
import { classNames } from '../../utils/classNames';

// 트리 (docs/components/TreeView.md) — WAI-ARIA Tree View
// ↑↓ 이동 · → 펼치기/첫 자식 · ← 접기/부모 · Home·End · Enter 펼치기 · Space 체크(체크 모드)
// 들여쓰기는 중첩 ul(role=group) 패딩으로 처리합니다. 드래그 정렬(isDraggable)은 같은 부모 안에서만, @dnd-kit 사용.
interface TreeViewProps {
    nodes: TreeNode[];
    label: string;
    defaultOpenIds?: TreeNodeId[];
    checkedIds?: TreeNodeId[];
    onCheckedChange?: (ids: TreeNodeId[]) => void;
    isCascade?: boolean;
    isDraggable?: boolean;
    onChange?: (nodes: TreeNode[]) => void;
    renderLabel?: (node: TreeNode) => ReactNode;
}

interface TreeItemProps {
    node: TreeNode;
    level: number;
    tree: TreeContext;
}

// TreeItem에 넘기는 공용 값 (재귀 렌더링용)
interface TreeContext {
    childrenOf: (id: TreeNodeId) => TreeNode[];
    openIds: Set<TreeNodeId>;
    focusedId: TreeNodeId | undefined;
    isCheckMode: boolean;
    isDraggable: boolean;
    getCheckState: (id: TreeNodeId) => boolean | 'mixed';
    renderLabel?: (node: TreeNode) => ReactNode;
    onToggleOpen: (id: TreeNodeId) => void;
    onToggleCheck: (id: TreeNodeId) => void;
    onFocusItem: (id: TreeNodeId) => void;
    registerItem: (id: TreeNodeId, element: HTMLLIElement | null) => void;
}

const TreeItem = ({ node, level, tree }: TreeItemProps) => {
    const children = tree.childrenOf(node.id);
    const hasChildren = children.length > 0;
    const isOpen = tree.openIds.has(node.id);
    const checkState = tree.getCheckState(node.id);
    const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id: node.id, disabled: !tree.isDraggable });

    return (
        <li
            ref={(element) => {
                setNodeRef(element);
                tree.registerItem(node.id, element);
            }}
            role="treeitem"
            aria-level={level}
            aria-expanded={hasChildren ? isOpen : undefined}
            aria-checked={tree.isCheckMode ? checkState : undefined}
            tabIndex={tree.focusedId === node.id ? 0 : -1}
            className={classNames('treeItem', isDragging && 'on')}
            // [inline-style] 드래그 중 위치: @dnd-kit이 포인터 위치로 계산하는 동적 값 (transform, transition)
            style={{ transform: CSS.Transform.toString(transform), transition }}
            onFocus={(event) => {
                if (event.target === event.currentTarget) tree.onFocusItem(node.id);
            }}
        >
            <div className="treeRow">
                {tree.isDraggable && (
                    <button type="button" ref={setActivatorNodeRef} className="treeHandle" aria-label={`${node.text} 순서 이동`} {...attributes} {...listeners} tabIndex={-1}>
                        <span className="iconMask iconGripVertical" aria-hidden="true" />
                    </button>
                )}
                <span
                    className={classNames('treeToggle', hasChildren && isOpen && 'on')}
                    aria-hidden="true"
                    onClick={(event) => {
                        event.stopPropagation();
                        if (hasChildren) tree.onToggleOpen(node.id);
                    }}
                >
                    {hasChildren && <span className="iconMask iconChevronRight" />}
                </span>
                <span
                    className="treeLabel"
                    onClick={() => (tree.isCheckMode ? tree.onToggleCheck(node.id) : hasChildren && tree.onToggleOpen(node.id))}
                >
                    {tree.isCheckMode && <span className={classNames('treeCheck', checkState === true && 'on', checkState === 'mixed' && 'mixed')} aria-hidden="true" />}
                    <span className={classNames('iconMask', node.isFolder || hasChildren ? 'iconFolder' : 'iconFile')} aria-hidden="true" />
                    {tree.renderLabel ? tree.renderLabel(node) : node.text}
                </span>
            </div>
            {hasChildren && isOpen && (
                <SortableContext items={children.map((child) => child.id)} strategy={verticalListSortingStrategy}>
                    <ul role="group" className="treeGroup">
                        {children.map((child) => (
                            <TreeItem key={child.id} node={child} level={level + 1} tree={tree} />
                        ))}
                    </ul>
                </SortableContext>
            )}
        </li>
    );
};

const TreeView = ({ nodes, label, defaultOpenIds = [], checkedIds, onCheckedChange, isCascade = true, isDraggable = false, onChange, renderLabel }: TreeViewProps) => {
    const [openIds, setOpenIds] = useState<Set<TreeNodeId>>(() => new Set(defaultOpenIds));
    const [focusedId, setFocusedId] = useState<TreeNodeId | undefined>(undefined);
    const itemRefs = useRef(new Map<TreeNodeId, HTMLLIElement>());
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

    const ids = new Set(nodes.map((node) => node.id));
    const childrenOf = (id: TreeNodeId) => nodes.filter((node) => node.parent === id);
    const roots = nodes.filter((node) => !ids.has(node.parent));
    const parentOf = (id: TreeNodeId) => nodes.find((node) => node.id === id)?.parent;
    const descendantsOf = (id: TreeNodeId): TreeNodeId[] => childrenOf(id).flatMap((child) => [child.id, ...descendantsOf(child.id)]);

    const isCheckMode = checkedIds !== undefined;
    const checked = new Set(checkedIds ?? []);

    // 체크 상태: 자식이 있으면 자손 기준(전부 true / 일부 mixed), 없으면 자기 값
    const getCheckState = (id: TreeNodeId): boolean | 'mixed' => {
        const descendants = descendantsOf(id);
        if (!isCascade || descendants.length === 0) return checked.has(id);
        const leaves = descendants.filter((descendantId) => childrenOf(descendantId).length === 0);
        const count = leaves.filter((leafId) => checked.has(leafId)).length;
        if (count === 0) return false;
        return count === leaves.length ? true : 'mixed';
    };

    const handleToggleCheck = (id: TreeNodeId) => {
        const next = new Set(checked);
        const shouldCheck = getCheckState(id) !== true;
        const targets = isCascade ? [id, ...descendantsOf(id)] : [id];
        targets.forEach((targetId) => (shouldCheck ? next.add(targetId) : next.delete(targetId)));
        // 상위 폴더는 자손 결과에 맞춰 다시 계산
        if (isCascade) {
            let parent = parentOf(id);
            while (parent !== undefined && ids.has(parent)) {
                const leaves = descendantsOf(parent).filter((descendantId) => childrenOf(descendantId).length === 0);
                if (leaves.every((leafId) => next.has(leafId))) next.add(parent);
                else next.delete(parent);
                parent = parentOf(parent);
            }
        }
        onCheckedChange?.([...next]);
    };

    const handleToggleOpen = (id: TreeNodeId) => {
        setOpenIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    // 화면에 보이는 순서 (펼친 노드만)
    const getVisibleIds = (): TreeNodeId[] => {
        const walk = (list: TreeNode[]): TreeNodeId[] => list.flatMap((node) => [node.id, ...(openIds.has(node.id) ? walk(childrenOf(node.id)) : [])]);
        return walk(roots);
    };

    const focusItem = (id: TreeNodeId | undefined) => {
        if (id === undefined) return;
        setFocusedId(id);
        itemRefs.current.get(id)?.focus();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
        const target = event.target as HTMLElement;
        if (target.getAttribute('role') !== 'treeitem') return;
        const visible = getVisibleIds();
        const current = focusedId ?? visible[0];
        const index = visible.indexOf(current);
        const hasChildren = current !== undefined && childrenOf(current).length > 0;
        // 키보드 순서 변경: Alt + ↑↓ (드래그 대체 수단)
        if (isDraggable && event.altKey && (event.key === 'ArrowUp' || event.key === 'ArrowDown') && current !== undefined) {
            event.preventDefault();
            const siblings = childrenOf(parentOf(current) ?? '');
            const siblingIndex = siblings.findIndex((node) => node.id === current);
            const target = siblings[siblingIndex + (event.key === 'ArrowUp' ? -1 : 1)];
            if (target) moveNode(current, target.id);
            return;
        }
        const keyActions: Record<string, () => void> = {
            ArrowDown: () => focusItem(visible[index + 1]),
            ArrowUp: () => focusItem(visible[index - 1]),
            Home: () => focusItem(visible[0]),
            End: () => focusItem(visible[visible.length - 1]),
            ArrowRight: () => {
                if (!hasChildren) return;
                if (!openIds.has(current)) handleToggleOpen(current);
                else focusItem(childrenOf(current)[0]?.id);
            },
            ArrowLeft: () => {
                if (hasChildren && openIds.has(current)) handleToggleOpen(current);
                else {
                    const parent = parentOf(current);
                    if (parent !== undefined && ids.has(parent)) focusItem(parent);
                }
            },
            Enter: () => hasChildren && handleToggleOpen(current),
            ' ': () => (isCheckMode ? handleToggleCheck(current) : hasChildren && handleToggleOpen(current))
        };
        const action = keyActions[event.key];
        if (!action || current === undefined) return;
        event.preventDefault();
        action();
    };

    // 같은 부모 안에서만 순서 변경: activeId를 overId 자리로
    const moveNode = (activeId: TreeNodeId, overId: TreeNodeId) => {
        const parent = parentOf(activeId);
        if (parent === undefined || parent !== parentOf(overId)) return;
        const positions = nodes.flatMap((node, position) => (node.parent === parent ? [position] : []));
        const siblings = positions.map((position) => nodes[position]);
        const moved = arrayMove(
            siblings,
            siblings.findIndex((node) => node.id === activeId),
            siblings.findIndex((node) => node.id === overId)
        );
        const next = [...nodes];
        positions.forEach((position, order) => {
            next[position] = moved[order];
        });
        onChange?.(next);
    };

    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        if (over && active.id !== over.id) moveNode(active.id, over.id);
    };

    const tree: TreeContext = {
        childrenOf,
        openIds,
        focusedId: focusedId ?? roots[0]?.id,
        isCheckMode,
        isDraggable,
        getCheckState,
        renderLabel,
        onToggleOpen: handleToggleOpen,
        onToggleCheck: handleToggleCheck,
        onFocusItem: setFocusedId,
        registerItem: (id, element) => {
            if (element) itemRefs.current.set(id, element);
            else itemRefs.current.delete(id);
        }
    };

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={roots.map((node) => node.id)} strategy={verticalListSortingStrategy}>
                <ul role="tree" aria-label={label} className="treeView" onKeyDown={handleKeyDown}>
                    {roots.map((node) => (
                        <TreeItem key={node.id} node={node} level={1} tree={tree} />
                    ))}
                </ul>
            </SortableContext>
        </DndContext>
    );
};

export default TreeView;

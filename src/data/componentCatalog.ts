import type { ComponentCategory } from '../types';

// 공통 컴포넌트 분류표 (가벼운 목록 — 왼쪽 메뉴·명세 메뉴용)
// - 왼쪽 메뉴(navData → specData)는 이 표만 읽습니다. 샘플·라이브러리가 든 스토리(componentStories.ts)는
//   명세 화면 탭에서만 필요할 때 불러와 첫 화면 용량을 줄입니다.
// - 스토리의 category와 이 표가 같아야 합니다 (scripts/check-project.mjs에서 검사).

export const CATEGORY_ORDER: ComponentCategory[] = ['layout', 'atom', 'internal'];

export const CATEGORY_LABEL: Record<ComponentCategory, string> = {
    layout: '배치 컴포넌트',
    atom: 'Atom 컴포넌트',
    internal: '내부 유틸'
};

// 컴포넌트 이름(= docs/components/{이름}.md) → 분류
export const COMPONENT_CATALOG: Record<string, ComponentCategory> = {
    Card: 'layout',
    Grid: 'layout',
    Section: 'layout',
    Stack: 'layout',
    Table: 'layout',
    Accordion: 'atom',
    Alert: 'atom',
    Avatar: 'atom',
    Breadcrumb: 'atom',
    Button: 'atom',
    Chart: 'atom',
    Checkbox: 'atom',
    Chip: 'atom',
    Collapsible: 'atom',
    DatePicker: 'atom',
    DropdownMenu: 'atom',
    EmptyState: 'atom',
    Icon: 'atom',
    Input: 'atom',
    InputStepper: 'atom',
    Kbd: 'atom',
    Loading: 'atom',
    Modal: 'atom',
    Pagination: 'atom',
    Popover: 'atom',
    Portal: 'internal',
    Progress: 'atom',
    Radio: 'atom',
    RangeSlider: 'atom',
    ScrollArea: 'atom',
    Select: 'atom',
    Separator: 'atom',
    Skeleton: 'atom',
    Slider: 'atom',
    SortableList: 'atom',
    Switch: 'atom',
    Tabs: 'atom',
    Textarea: 'atom',
    TextList: 'atom',
    Toast: 'atom',
    ToggleGroup: 'atom',
    Tooltip: 'atom',
    TreeView: 'atom'
};

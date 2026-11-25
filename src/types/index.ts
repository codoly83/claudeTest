import type { ReactNode } from 'react';

// 공용 타입 (AGENTS.md 5.1, docs/design.md 3장)
// 여러 파일에서 공유하는 타입만 둡니다. design.md 3장의 예시 타입은 실제로 쓰일 때 추가합니다.

// 일반 페이지 왼쪽 메뉴·메뉴 검색 (docs/design.md 1.2, src/data/navData.ts)
export interface NavItem {
    label: string;
    href: string;
    searchText?: string;   // 메뉴 검색에서 함께 찾을 본문 (명세 문서 내용)
}

// 공통 컴포넌트에서 여러 파일이 함께 쓰는 타입 (docs/components/Chip.md, Table.md)
export type ChipColor = 'green' | 'blue' | 'yellow' | 'red' | 'purple' | 'gray';

export interface TableColumn<T> {
    key: keyof T & string;
    header: string;
    align?: 'start' | 'center';
    render?: (row: T) => ReactNode;   // 없으면 row[key]를 글자로 표시
}

// Table type="result" 상세형 항목: 왼쪽 머리글(label) + 값 (docs/components/Table.md)
export interface TableResultItem {
    key: string;
    label: string;
    value: ReactNode;                 // 비어 있으면 '-' 표시
}

// 아이콘 이름 = src/assets/icons/{name}.svg = common.css 클래스 (docs/components/Icon.md)
export type IconName =
    | 'iconArrowDown' | 'iconArrowUp' | 'iconCalendar' | 'iconCheck' | 'iconChevronDown' | 'iconChevronLeft' | 'iconChevronRight'
    | 'iconChevronUp' | 'iconChevronsLeft' | 'iconChevronsRight' | 'iconCircleAlert' | 'iconCircleCheck' | 'iconClose' | 'iconFile'
    | 'iconFolder' | 'iconGripVertical' | 'iconInbox' | 'iconInfo' | 'iconLoader' | 'iconMinus' | 'iconPause' | 'iconPlay'
    | 'iconPlus' | 'iconSearch' | 'iconTriangleAlert';

// TreeView 노드 (docs/components/TreeView.md) — 평면 배열, parent는 상위 id (최상위는 0)
export type TreeNodeId = string | number;
export interface TreeNode {
    id: TreeNodeId;
    parent: TreeNodeId;
    text: string;
    isFolder?: boolean;
}

// 배치 간격 단계: Stack·Grid·Section gap, Card padding (docs/component-ssot.md 2.3)
export type SpaceSize = 'sm' | 'md' | 'lg';

// 제목 단계: Section·Card (docs/component-ssot.md 2.3.3 제목 단계)
export type HeadingLevel = 2 | 3 | 4;

// ---- 컴포넌트 스토리 (src/data/componentStories.ts — 명세 화면 탭 샘플·Playground·API) ----

// 메뉴 분류: 배치 / Atom / 내부 유틸
export type ComponentCategory = 'layout' | 'atom' | 'internal';

// API 표 한 행 (Props·이벤트)
export interface ApiRow {
    name: string;
    type: string;
    defaultValue: string;             // 'required' = 필수, '-' = 없음
    desc: string;
}

// 기능별 샘플: 실제 UI + 사용 코드
export interface StorySample {
    title: string;
    desc?: string;
    preview: ReactNode;
    code: string;
}

export type ControlValue = string | number | boolean;
export type ControlValues = Record<string, ControlValue>;

// Playground 조작 항목 (Storybook Controls)
export interface PlaygroundControl {
    name: string;                     // Props 이름 (isProp false면 예제용 값)
    type: 'select' | 'boolean' | 'text' | 'number';
    defaultValue: ControlValue;
    options?: string[];               // select
    min?: number;                     // number
    max?: number;
    isProp?: boolean;                 // 기본 true. false면 코드에 Props로 쓰지 않음
}

export interface StoryPlayground {
    controls: PlaygroundControl[];
    render: (values: ControlValues) => ReactNode;
    code: (values: ControlValues, controls: PlaygroundControl[]) => string;
}

export interface ComponentStory {
    id: string;                       // camelCase 파일명 (check-project 검사 기준)
    name: string;                     // 컴포넌트 이름 = docs/components/{name}.md
    category: ComponentCategory;
    path: string;
    summary: string;                  // API 설명 (접근성·동작 요약)
    api: ApiRow[];
    samples: StorySample[];
    playground?: StoryPlayground;
}

// 명세 문서 보기 (/spec/:slug, src/data/specData.ts)
export interface SpecItem {
    slug: string;
    label: string;
    groupTitle: string;
    docPath: string;       // 원본 문서 경로 (예: docs/components/Button.md)
    markdown: string;      // 화면에 그릴 마크다운
    storyName?: string;    // 구현된 공통 컴포넌트면 스토리 이름 → 샘플·Playground·API 탭 표시
}

export interface SpecGroup {
    id: string;
    title: string;
    items: SpecItem[];
}

export interface NavGroup {
    id: string;
    title: string;
    items: NavItem[];
}

// IA 관리 화면 (docs/ia-spec.md 원본 구조 유지)
// Task 상태: 0 Undone(코딩중), 1 Done(코딩완료), 2 Modify(완료 후 수정), 3 Delete(완료 후 삭제)
export type TaskKey = '0' | '1' | '2' | '3';

export interface Cell {
    className: string;
    text: string;
}

export interface HeaderCell {
    className: string;
    text: string;
}

export interface IaTable {
    id: string;
    title: string;
    path: string;
    headers: HeaderCell[];
    rows: Cell[][];
}

// 오버레이 위치 (docs/components/Popover.md, Tooltip.md)
export type Placement =
    | 'top' | 'top-start' | 'top-end'
    | 'bottom' | 'bottom-start' | 'bottom-end'
    | 'left' | 'left-start' | 'left-end'
    | 'right' | 'right-start' | 'right-end';

// Toast (docs/components/Toast.md) — Toast.tsx·ToastProvider·useToast가 함께 사용
export type ToastType = 'default' | 'success' | 'info' | 'warning' | 'error';
export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

export interface ToastOptions {
    type?: ToastType;
    position?: ToastPosition;
    duration?: number;   // ms, 기본 TOAST_DURATION
}

export interface ToastItem {
    id: string;
    message: string;
    type: ToastType;
    position: ToastPosition;
}

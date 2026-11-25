# TreeView

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 7장 결정 D1~D12)
> 출처: <https://codoly83.github.io/publishTemplate/guide/tree-view>
> 상태: **구현됨** — `src/components/common/TreeView.tsx`, 명세 화면 탭(샘플·Playground·API, 스토리 id `treeView`) (2026-11-25). 구현 범위는 아래 "구현 범위" 참고.
> 마지막 수정: 2026-11-25

---

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/common/TreeView.tsx` |
| 스토리 id | `treeView` |
| 원본 variant·size | — |
| 외부 의존 | 드래그 시 @dnd-kit (사전 승인) |
| 판정 | **구현됨 (2026-11-25)** |

## 정의

- **위치 / 스토리 id:** `common/TreeView.tsx` / `#treeView`
- **원본 옵션:** `treeData: { id, parent, droppable, text }[]`(평면 배열), `renderNode(node, { depth, isOpen, onToggle, handleRef, isChecked, onCheckToggle })`, `dragEnabled`, `enablePlaceholder`, `dropTargetOffsetPx`, `onTreeDataChange`, `checkedIds`/`onCheckedIdsChange`/`checkCascade`, 인라인 수정, 추가/삭제
- **SSOT 조건:** 기본 펼침/접힘·체크는 직접 구현, 드래그 정렬은 사전 승인된 **@dnd-kit**으로 구현 (원본의 트리 전용 DnD 라이브러리는 미승인). 원본 lucide 아이콘(Folder, File, Chevron) 금지 → 디자인 에셋.
  ```ts
  type TreeNodeId = string | number;
  interface TreeNode { id: TreeNodeId; parent: TreeNodeId; text: string; isFolder?: boolean; }  // 원본 droppable
  interface TreeViewProps {
      nodes: TreeNode[];
      label: string;
      checkedIds?: TreeNodeId[];                       // 있으면 체크 모드
      onCheckedChange?: (ids: TreeNodeId[]) => void;
      isCascade?: boolean;                             // 원본 checkCascade
      renderLabel?: (node: TreeNode) => ReactNode;     // 수정·삭제 버튼 등은 페이지에서 주입
  }
  ```
- **접근성:** WAI-ARIA Tree View — `role=tree/treeitem/group`, `aria-expanded`, `aria-level`, `aria-checked`, ↑↓ 이동·←→ 접기/펼치기·Home·End
- **들여쓰기:** 원본 `style={{ marginLeft: depth * 10 }}` → `aria-level` 기반 CSS 또는 `--depth` 변수 인라인(데이터 기반 동적 값) = **인라인 예외 기록**

## 구현 범위 (2026-11-25)

- 사용자 요청("미구현 명세도 정상적으로 나오게", 라이브러리 설치 승인)으로 구현했습니다. 스토리: `src/data/storiesAtomPlus.tsx`.
- Props: `nodes`, `label`, `defaultOpenIds`, `checkedIds`·`onCheckedChange`, `isCascade`, `isDraggable`·`onChange`, `renderLabel`.
- 메모: WAI-ARIA Tree View 키보드(↑↓·→←·Home·End·Enter·Space). 체크 모드는 `aria-checked`(true·false·mixed), 하위 연동은 잎 노드 기준으로 계산. 드래그는 @dnd-kit으로 **같은 폴더 안에서만**, 키보드 대체로 Alt+↑↓. 들여쓰기는 `--depth` 인라인 대신 중첩 `ul[role=group]` 패딩으로 처리(인라인 없음). 드래그 위치 `transform`만 인라인 예외(design.md 6.2). `defaultOpenIds` 추가.

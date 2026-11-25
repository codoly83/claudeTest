# SortableList — @dnd-kit 사전 승인 (D4)

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 7장 결정 D1~D12)
> 출처: <https://codoly83.github.io/publishTemplate/guide/sortable-list>
> 상태: **구현됨** — `src/components/common/SortableList.tsx`, 명세 화면 탭(샘플·Playground·API, 스토리 id `sortableList`) (2026-11-25). 구현 범위는 아래 "구현 범위" 참고.
> 마지막 수정: 2026-11-25

---

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/common/SortableList.tsx` |
| 스토리 id | `sortableList` |
| 원본 variant·size | — |
| 외부 의존 | @dnd-kit (사전 승인) |
| 판정 | **구현됨 (2026-11-25)** |

## 정의

- **원본:** @dnd-kit, 그립 핸들 드래그, 모바일 길게 누르기, 키보드 방향키, 선택 후 외부 "위로/아래로" 버튼, `items`, `onReorder`, `renderItem({ item, dragHandleProps, isDragging })`
- **SSOT 조건:** @dnd-kit(`core`·`sortable`·`utilities`) 사용. 드래그만으로 순서를 바꾸게 두지 않고 키보드 이동(@dnd-kit KeyboardSensor)과 "위로/아래로" 버튼을 함께 제공.
  ```ts
  interface SortableListProps<T extends { id: string }> {
      items: T[];
      onChange?: (items: T[]) => void;       // 원본 onReorder
      renderItem: (item: T) => ReactNode;
      label: string;
  }
  ```
- 원본 `GripVertical`(lucide) 아이콘은 금지 → 디자인 에셋 필요. 순서 변경 결과는 `aria-live`로 안내

## 구현 범위 (2026-11-25)

- 사용자 요청("미구현 명세도 정상적으로 나오게", 라이브러리 설치 승인)으로 구현했습니다. 스토리: `src/data/storiesAtomPlus.tsx`.
- Props: `items`, `onChange`, `renderItem`, `getItemLabel`, `label`.
- 메모: `getItemLabel`(항목 이름)을 추가 — 버튼 이름("{이름} 위로/아래로", "{이름} 끌어서 이동")과 aria-live 안내에 사용. @dnd-kit Pointer·Touch(길게 누르기 250ms)·Keyboard 센서, 그립 핸들(iconGripVertical)만 드래그. 드래그 위치 `transform`은 인라인 예외(design.md 6.2).

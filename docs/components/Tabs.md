# Tabs

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 7장 결정 D1~D12)
> 출처: <https://codoly83.github.io/publishTemplate/guide/tabs>
> 상태: **구현됨(일부)** — `src/components/common/Tabs.tsx`, 스토리 id `tabs` (2026-11-25, shadcn/ui 참고). 구현 범위는 아래 "구현 범위" 참고.
> 마지막 수정: 2026-11-25

---

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/common/Tabs.tsx` |
| 스토리 id | `tabs` |
| 원본 variant·size | default/btn · default/sm · default/line · 가로/세로 |
| 외부 의존 | Radix → 직접 구현 |
| 판정 | 채택 가능 |

## 정의

- **위치 / 스토리 id:** `common/Tabs.tsx` / `#tabs`
- **원본 옵션:** `variant: default|btn`(아이콘·카운트), `size: default|sm`, `type: line`, `orientation: horizontal|vertical`, `defaultValue`, `scrollSpy`(`TabsScrollSpyPanel`, `scrollContainerRef`, `sectionIds`, `scrollOffsetPx`, `activeLineRatio`), `useTabActive()`
- **Props (SSOT)**
  ```ts
  interface TabItem { id: string; label: string; content: ReactNode; icon?: IconName; count?: number; disabled?: boolean; }
  interface TabsProps {
      items: TabItem[];
      variant?: 'default' | 'btn';
      size?: 'md' | 'sm';                       // 원본 default → 'md'
      appearance?: 'default' | 'line';          // 원본 type (HTML type과 혼동 방지)
      orientation?: 'horizontal' | 'vertical';
      activeIndex?: number;                     // 외부 제어 시에만
      onChange?: (index: number) => void;
  }
  ```
- **접근성:** WAI-ARIA Tabs — `role=tablist/tab/tabpanel`, `aria-selected`, 로빙 tabindex, ←→(세로는 ↑↓)·Home·End, 활성 탭 `.on`
- **scrollSpy 모드:** 탭 전환과 앵커 네비는 다른 패턴(Tabs ≠ 목차). 필요 시 별도 컴포넌트/훅(`useScrollSpy`)로 분리하고 Tabs Props에 넣지 않음 — 승인 필요
- **`useTabActive`:** Context 필요 → 실제 수요가 있을 때만

## 구현 범위 (2026-11-25)

- 구현: `items`(id·label·content·disabled), `label`(tablist aria-label, 추가), `appearance`(`default` 묶음형·`line` 밑줄형), `activeIndex`·`onChange`. 방향키 이동 시 바로 선택(자동 활성화).
- 아직 구현하지 않음: `variant: btn`(아이콘·카운트), `size: sm`, `orientation: vertical`, scrollSpy.

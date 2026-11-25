# EmptyState

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 7장 결정)
> 출처: <https://ui.shadcn.com/docs/components/empty>
> 상태: **구현됨** — `src/components/common/EmptyState.tsx`, 스토리 id `emptyState` (2026-11-25, 사용자 요청: shadcn/ui 참고 컴포넌트 추가)
> 마지막 수정: 2026-11-25

---

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/common/EmptyState.tsx` |
| 스토리 id | `emptyState` |
| 원본 variant·size | — |
| 외부 의존 | Radix·Lucide → 직접 구현, 아이콘은 `src/assets/icons` SVG |
| 판정 | 채택 (메인 컴포넌트 목록·명세 화면) |

## 정의

- **위치 / 스토리 id:** `common/EmptyState.tsx` / `#emptyState`
- **Props (SSOT)**
  ```ts
  interface EmptyStateProps {
      title: string;
      description?: string;
      action?: ReactNode;    // 버튼 영역
  }
  ```
- **마크업·클래스:** `div.emptyState > span.emptyStateMedia > span.iconMask.iconInbox` + `strong.emptyStateTitle` + `p.emptyStateDesc` + `div.emptyStateAction`
- **접근성·조건:** 아이콘 장식용. 이름은 원본 `Empty` 대신 의미가 분명한 `EmptyState`.
- **스타일:** `common.css` 03 섹션, `#wrap` 토큰만 사용 (다크모드 자동 전환)

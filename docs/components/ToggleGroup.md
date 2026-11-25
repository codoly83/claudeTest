# ToggleGroup

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 7장 결정)
> 출처: <https://ui.shadcn.com/docs/components/toggle-group>
> 상태: **구현됨** — `src/components/common/ToggleGroup.tsx`, 스토리 id `toggleGroup` (2026-11-25, 사용자 요청: shadcn/ui 참고 컴포넌트 추가)
> 마지막 수정: 2026-11-25

---

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/common/ToggleGroup.tsx` |
| 스토리 id | `toggleGroup` |
| 원본 variant·size | size 기본/sm/lg · outline |
| 외부 의존 | Radix·Lucide → 직접 구현, 아이콘은 `src/assets/icons` SVG |
| 판정 | 채택 (메인 컴포넌트 목록·명세 화면) |

## 정의

- **위치 / 스토리 id:** `common/ToggleGroup.tsx` / `#toggleGroup`
- **Props (SSOT)**
  ```ts
  interface ToggleOption { value: string; label: string; disabled?: boolean; }
  interface ToggleGroupProps {
      options: ToggleOption[];
      value: string;                 // 하나만 선택
      onChange?: (value: string) => void;
      label: string;                 // group aria-label
      size?: 'md' | 'sm';            // 36 / 30px, 기본 'md'
  }
  ```
- **마크업·클래스:** `div.toggleGroup.{size}[role=group] > button.toggleItem(.on|.disabled)[aria-pressed]`
- **접근성·조건:** 버튼마다 `aria-pressed`. 원본의 여러 개 선택(`type="multiple"`)·단독 Toggle·아이콘 토글은 제외(필요 시 추가).
- **스타일:** `common.css` 03 섹션, `#wrap` 토큰만 사용 (다크모드 자동 전환)

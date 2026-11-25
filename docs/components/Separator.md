# Separator

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 7장 결정)
> 출처: <https://ui.shadcn.com/docs/components/separator>
> 상태: **구현됨** — `src/components/common/Separator.tsx`, 스토리 id `separator` (2026-11-25, 사용자 요청: shadcn/ui 참고 컴포넌트 추가)
> 마지막 수정: 2026-11-25

---

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/common/Separator.tsx` |
| 스토리 id | `separator` |
| 원본 variant·size | horizontal/vertical |
| 외부 의존 | Radix·Lucide → 직접 구현, 아이콘은 `src/assets/icons` SVG |
| 판정 | 채택 (메인 컴포넌트 목록·명세 화면) |

## 정의

- **위치 / 스토리 id:** `common/Separator.tsx` / `#separator`
- **Props (SSOT)**
  ```ts
  interface SeparatorProps {
      orientation?: 'horizontal' | 'vertical';   // 기본 'horizontal'
      isDecorative?: boolean;                    // 기본 true
  }
  ```
- **마크업·클래스:** `div.separator.{orientation}`
- **접근성·조건:** 장식용은 `role="none"`, 의미가 있으면 `role="separator"` + `aria-orientation`.
- **스타일:** `common.css` 03 섹션, `#wrap` 토큰만 사용 (다크모드 자동 전환)

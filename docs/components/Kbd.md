# Kbd

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 7장 결정)
> 출처: <https://ui.shadcn.com/docs/components/kbd>
> 상태: **구현됨** — `src/components/common/Kbd.tsx`, 스토리 id `kbd` (2026-11-25, 사용자 요청: shadcn/ui 참고 컴포넌트 추가)
> 마지막 수정: 2026-11-25

---

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/common/Kbd.tsx` |
| 스토리 id | `kbd` |
| 원본 variant·size | — |
| 외부 의존 | Radix·Lucide → 직접 구현, 아이콘은 `src/assets/icons` SVG |
| 판정 | 채택 (메인 컴포넌트 목록·명세 화면) |

## 정의

- **위치 / 스토리 id:** `common/Kbd.tsx` / `#kbd`
- **Props (SSOT)**
  ```ts
  interface KbdProps { label: string; }   // 조합 키는 Kbd를 나란히
  ```
- **마크업·클래스:** `kbd.kbd`
- **접근성·조건:** 네이티브 `kbd` 요소로 키 의미 전달.
- **스타일:** `common.css` 03 섹션, `#wrap` 토큰만 사용 (다크모드 자동 전환)

# Chip

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 7장 결정 D1~D12)
> 출처: <https://codoly83.github.io/publishTemplate/guide/chip>
> 상태: **구현됨(일부)** — `src/components/common/Chip.tsx`, 스토리 id `chip` (2026-11-24). 구현 범위는 아래 "구현 범위" 참고.
> 마지막 수정: 2026-11-24

---

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/common/Chip.tsx` |
| 스토리 id | `chip` |
| 원본 variant·size | tint/solid/stateYes/stateNo/iconData × 6색 |
| 외부 의존 | — |
| 판정 | 채택 가능 |

## 정의

- **위치 / 스토리 id:** `common/Chip.tsx` / `#chip`
- **원본 옵션:** `variant: tint|solid` × `color: blue|green|yellow|red|purple|gray`, `variant: stateYes|stateNo|iconData`, `asChild`(a 태그)
- **Props (SSOT)**
  ```ts
  interface ChipProps {
      variant?: 'tint' | 'solid' | 'stateYes' | 'stateNo' | 'iconData';  // 기본 'tint'
      color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';   // tint/solid에서만 사용
      icon?: IconName;            // stateYes/stateNo/iconData의 아이콘 (Icon 컴포넌트 재사용)
      href?: string;              // 원본 asChild → 있으면 <a>로 렌더링
      label: string;
  }
  ```
- **마크업:** `span.chip.{variant}.{color}` / `a.chip…`
- **주의:** 색만으로 상태를 전달하지 않도록 텍스트 유지. 외부 링크는 `target="_blank" rel="noreferrer"` + 새 창 안내

## 구현 범위 (2026-11-24)

- 구현: `label`, `color`(`green`·`blue`·`yellow`·`red`·`purple`·`gray`, 기본 `green`) — solid 스타일만.
- 아직 구현하지 않음: `variant`(`tint`·`stateYes`·`stateNo`·`iconData`), `icon`, `href`.
- 색상: green=`--color-primary`, blue·yellow·red·purple=같은 이름 토큰, gray=`--color-text-muted`. 글자 `--color-on-primary`.

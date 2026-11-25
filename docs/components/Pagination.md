# Pagination

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 7장 결정 D1~D12)
> 출처: <https://codoly83.github.io/publishTemplate/guide/pagination>
> 상태: **구현됨(일부)** — `src/components/common/Pagination.tsx`, 스토리 id `pagination` (2026-11-25, shadcn/ui 참고). 구현 범위는 아래 "구현 범위" 참고.
> 마지막 수정: 2026-11-25

---

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/common/Pagination.tsx` |
| 스토리 id | `pagination` |
| 원본 variant·size | — |
| 외부 의존 | — |
| 판정 | 채택 가능 |

## 정의

- **위치 / 스토리 id:** `common/Pagination.tsx` / `#pagination`
- **원본 옵션:** `total`, `current`, `onPageChange`, `ellipsis`(기본 false), `max`(기본 5, `<<`·`>>` 점프 거리 겸용), `getHref`
- **Props (SSOT)**
  ```ts
  interface PaginationProps {
      total: number;
      current: number;
      onChange?: (page: number) => void;     // 원본 onPageChange (값 전달 규칙 통일)
      max?: number;                          // 기본 5
      hasEllipsis?: boolean;                 // 원본 ellipsis, 기본 false
      getHref?: (page: number) => string;    // 있으면 <a>, 없으면 <button>
  }
  ```
- **마크업·접근성:** `nav.pagination[aria-label="페이지 이동"] > ul > li > a|button`, 현재 페이지 `.on` + `aria-current="page"`, `<<`·`<`·`>`·`>>`는 `aria-label`("이전 5페이지" 등), 경계에서 `disabled`
- **원본 동작 유지:** `<<`·`>>` 항상 표시, 이동 거리 = `max`

## 구현 범위 (2026-11-25)

- 구현: SSOT Props 전체. 번호는 `max`개 단위 묶음으로 표시, `hasEllipsis`면 첫·마지막 페이지와 `…` 추가. 아이콘 `iconChevronsLeft`·`iconChevronLeft`·`iconChevronRight`·`iconChevronsRight`.

# Breadcrumb

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 7장 결정)
> 출처: <https://ui.shadcn.com/docs/components/breadcrumb>
> 상태: **구현됨** — `src/components/common/Breadcrumb.tsx`, 스토리 id `breadcrumb` (2026-11-25, 사용자 요청: shadcn/ui 참고 컴포넌트 추가)
> 마지막 수정: 2026-11-25

---

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/common/Breadcrumb.tsx` |
| 스토리 id | `breadcrumb` |
| 원본 variant·size | — |
| 외부 의존 | Radix·Lucide → 직접 구현, 아이콘은 `src/assets/icons` SVG |
| 판정 | 채택 (메인 컴포넌트 목록·명세 화면) |

## 정의

- **위치 / 스토리 id:** `common/Breadcrumb.tsx` / `#breadcrumb`
- **Props (SSOT)**
  ```ts
  interface BreadcrumbItem { label: string; href?: string; }   // href는 React Router 경로
  interface BreadcrumbProps { items: BreadcrumbItem[]; }
  ```
- **마크업·클래스:** `nav.breadcrumb[aria-label="현재 위치"] > ol.breadcrumbList > li.breadcrumbItem > a.breadcrumbLink | span.breadcrumbText(.on)` + 구분 아이콘 `iconChevronRight`
- **접근성·조건:** 마지막 항목은 링크 없이 `aria-current="page"`, 구분 아이콘 `aria-hidden`. 원본의 말줄임(…)·드롭다운 경로는 제외.
- **스타일:** `common.css` 03 섹션, `#wrap` 토큰만 사용 (다크모드 자동 전환)

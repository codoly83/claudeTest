# ScrollArea

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 7장 결정 D1~D12)
> 출처: <https://codoly83.github.io/publishTemplate/guide/scrollarea>
> 상태: **구현됨** — `src/components/common/ScrollArea.tsx`, 명세 화면 탭(샘플·Playground·API, 스토리 id `scrollArea`) (2026-11-25). 구현 범위는 아래 "구현 범위" 참고.
> 마지막 수정: 2026-11-25

---

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/common/ScrollArea.tsx` |
| 스토리 id | `scrollArea` |
| 원본 variant·size | vertical/horizontal/both |
| 외부 의존 | Radix → CSS 대체 |
| 판정 | **구현됨 (2026-11-25)** |

## 정의

- **위치 / 스토리 id:** `common/ScrollArea.tsx` / `#scrollArea`
- **원본:** Radix ScrollArea(커스텀 스크롤바), `ScrollBar orientation="horizontal"`, 높이는 className(`h-64`)
- **SSOT 조건:** 라이브러리 없이 `overflow: auto` + `common.css` 스크롤바 스타일(guide.css의 `::-webkit-scrollbar` 패턴 참고)로 구현.
  ```ts
  interface ScrollAreaProps {
      orientation?: 'vertical' | 'horizontal' | 'both';   // 기본 'vertical'
      size?: 'sm' | 'md' | 'lg';                           // 최대 높이 프리셋 (디자인 값 확정 후)
      label: string;                                       // 키보드 스크롤 영역 이름
      children: ReactNode;
  }
  ```
- **접근성:** `tabIndex={0}`, `role="region"`, `aria-label` (키보드로 스크롤 가능)
- **D8 결정:** 높이는 `size` 프리셋 클래스(`#wrap .scrollArea.md { max-height: … }`). 값은 디자인 원본에서 확정

## 구현 범위 (2026-11-25)

- 사용자 요청("미구현 명세도 정상적으로 나오게", 라이브러리 설치 승인)으로 구현했습니다. 스토리: `src/data/storiesAtomPlus.tsx`.
- Props: `label`, `orientation`(vertical·horizontal·both), `size`(sm 160·md 240·lg 360px 최대 높이), `children`.
- 메모: 라이브러리 없이 `overflow` + 얇은 스크롤바(`scrollbar-width`·`::-webkit-scrollbar`). `role="region"` + `aria-label` + `tabIndex=0`. **size 값은 디자인 확정 전 임시 값**(design.md 6장 미결정 항목).

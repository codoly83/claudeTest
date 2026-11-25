# Accordion

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 7장 결정 D1~D12)
> 출처: <https://codoly83.github.io/publishTemplate/guide/accordion>
> 상태: **구현됨(일부)** — `src/components/common/Accordion.tsx`, 스토리 id `accordion` (2026-11-25, shadcn/ui 참고). 구현 범위는 아래 "구현 범위" 참고.
> 마지막 수정: 2026-11-25

---

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/common/Accordion.tsx` |
| 스토리 id | `accordion` |
| 원본 variant·size | single/multiple |
| 외부 의존 | Radix → 직접 구현 |
| 판정 | 채택 가능 |

## 정의

- **위치 / 스토리 id:** `common/Accordion.tsx` / `#accordion`
- **원본 옵션:** `type: single|multiple`, `collapsible`, `defaultValue`, 항목별 `disabled`, className 커스텀(컴팩트·강조)
- **Props (SSOT)**
  ```ts
  interface AccordionItem { id: string; title: string; content: ReactNode; disabled?: boolean; }
  interface AccordionProps {
      items: AccordionItem[];
      isMultiple?: boolean;        // 원본 type="multiple", 기본 false
      isCollapsible?: boolean;     // single에서 열린 항목 재클릭 시 닫힘, 기본 true
      defaultOpenIds?: string[];   // 원본 defaultValue
  }
  ```
- **마크업·클래스:** `.accordion` > `.accordionItem(.on|.disabled)` > `h3 > button.accordionTrigger` + `div.accordionPanel`
- **접근성:** WAI-ARIA Accordion — `aria-expanded`, `aria-controls`, 패널 `role="region"` + `aria-labelledby`(useId). Enter/Space 토글, ↑↓·Home·End 이동
- **제외:** className 커스텀 예시(컴팩트·강조)는 디자인 원본에 있으면 `variant`로 추가
- **9.2:** 키보드 · 반복 UI · disabled 상태

## 구현 범위 (2026-11-25)

- 구현: `items`(id·title·content·disabled), `isMultiple`, `isCollapsible`, `defaultOpenIds`. WAI-ARIA 키보드(↑↓·Home·End), 패널 `role="region"`.
- 아이콘: `iconChevronDown`(mask), 열림 시 180° 회전. 아직 구현하지 않음: 컴팩트·강조 variant.

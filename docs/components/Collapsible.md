# Collapsible

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 7장 결정 D1~D12)
> 출처: <https://codoly83.github.io/publishTemplate/guide/collapsible>
> 상태: **구현됨(일부)** — `src/components/common/Collapsible.tsx`, 스토리 id `collapsible` (2026-11-25, shadcn/ui 참고). 구현 범위는 아래 "구현 범위" 참고.
> 마지막 수정: 2026-11-25

---

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/common/Collapsible.tsx` |
| 스토리 id | `collapsible` |
| 원본 variant·size | — |
| 외부 의존 | Radix → 직접 구현 |
| 판정 | 단일만 채택, Group은 Accordion |

## 정의

- **위치 / 스토리 id:** `common/Collapsible.tsx` / `#collapsible`
- **원본 옵션:** `defaultOpen`, `open`/`onOpenChange`(제어형), Trigger `disabled`, `CollapsibleGroup(type single|multiple)`, `collapsibleChevronClassName`
- **SSOT 조건:** `CollapsibleGroup`은 Accordion과 기능이 같으므로 **Accordion으로 통합**하고, Collapsible은 **단일 접기/펼치기**만 담당합니다.
  ```ts
  interface CollapsibleProps {
      title: string;              // 트리거 라벨
      isOpen?: boolean;           // 제어형 (외부 버튼 연동 시)
      defaultOpen?: boolean;
      onChange?: (isOpen: boolean) => void;
      disabled?: boolean;
      children: ReactNode;
  }
  ```
- **마크업:** `div.collapsible(.on) > button.collapsibleTrigger[aria-expanded] > span + img.collapsibleIcon` + `div.collapsibleContent`
- **동작:** 아이콘 회전은 `.collapsible.on .collapsibleIcon` CSS로 (원본 className 상수 불필요)

## 구현 범위 (2026-11-25)

- 구현: SSOT Props 전체(`title`, `isOpen` 제어형, `defaultOpen`, `onChange`, `disabled`, `children`).
- 마크업 변경: 아이콘은 `img` 대신 `span.iconMask.iconChevronDown.collapsibleIcon`(색 상속, AGENTS 5.4).

# Tooltip

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 7장 결정 D1~D12)
> 출처: <https://codoly83.github.io/publishTemplate/guide/tooltip>
> 상태: **구현됨(일부)** — `src/components/common/Tooltip.tsx`, 스토리 id `tooltip` (2026-11-25, shadcn/ui 참고). 구현 범위는 아래 "구현 범위" 참고.
> 마지막 수정: 2026-11-25

---

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/common/Tooltip.tsx` |
| 스토리 id | `tooltip` |
| 원본 variant·size | default/light/dark/error/success · sm/md/lg |
| 외부 의존 | Radix → 직접 구현 |
| 판정 | 채택 가능 |

## 정의

- **위치 / 스토리 id:** `common/Tooltip.tsx` / `#tooltip`
- **원본 옵션:** `TooltipProvider`, `variant: default|light|dark|error|success`, `size: sm|md|lg`, `arrow`(기본 true), 다양한 트리거(버튼·텍스트·아바타·카드)
- **Props (SSOT)**
  ```ts
  interface TooltipProps {
      content: string;
      variant?: 'default' | 'light' | 'dark' | 'error' | 'success';
      size?: 'sm' | 'md' | 'lg';
      hasArrow?: boolean;            // 원본 arrow, 기본 true
      placement?: Placement;         // types 공유, 기본 'top'
      children: ReactElement;        // 트리거 (포커스 가능한 요소여야 함)
  }
  ```
- **SSOT 조건:** Provider 불필요. Portal 없이 트리거 옆. hover **와 focus** 모두에서 표시, ESC로 숨김, `role="tooltip"` + 트리거 `aria-describedby`(useId). 원본의 `span`·아바타 트리거처럼 포커스 불가 요소는 `tabIndex=0` 필요 → 가급적 버튼 사용
- **9.2:** 키보드(포커스 시 표시) · variant/size 모양

## 구현 범위 (2026-11-25)

- 구현: `content`, `placement`(top·right·bottom·left 4종), `hasArrow`, `children`(포커스 가능한 요소, `aria-describedby` 자동 연결). hover·focus 표시, ESC 숨김.
- 아직 구현하지 않음: `variant`(light·dark·error·success), `size`, start·end 정렬.

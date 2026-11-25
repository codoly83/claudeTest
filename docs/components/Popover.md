# Popover

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 7장 결정 D1~D12)
> 출처: <https://codoly83.github.io/publishTemplate/guide/popover>
> 상태: **구현됨(일부)** — `src/components/common/Popover.tsx`, 스토리 id `popover` (2026-11-25, shadcn/ui 참고). 구현 범위는 아래 "구현 범위" 참고.
> 마지막 수정: 2026-11-25

---

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/common/Popover.tsx` |
| 스토리 id | `popover` |
| 원본 variant·size | size sm/md/lg · placement 12 |
| 외부 의존 | Radix → 직접 구현 |
| 판정 | 채택 가능 |

## 정의

- **위치 / 스토리 id:** `common/Popover.tsx` / `#popover`
- **원본 옵션:** `placement`(top/bottom/left/right × start/center/end 12종) 또는 `side`+`align`, `sideOffset`, `size: sm|md|lg`, `container`(Portal 대상), `PopoverHeader/Title/Description/Close`, 바깥 클릭 닫기
- **Props (SSOT)**
  ```ts
  type Placement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end'
                 | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end';
  interface PopoverProps {
      trigger: ReactNode;               // 트리거 버튼 라벨
      title?: string;
      placement?: Placement;            // 기본 'bottom'
      size?: 'sm' | 'md' | 'lg';        // 기본 'md'
      children: ReactNode;
  }
  ```
- **SSOT 조건:** `side/align` 중복 API 제거(placement만). `container` 제거 — Portal 없이 트리거 옆, 잘릴 때만 `#modalWrap`. `sideOffset`은 CSS 고정 간격. 바깥 클릭·ESC 닫기, 닫으면 트리거로 포커스 복귀, 트리거 `aria-expanded`·`aria-controls`
- `Placement` 타입은 Tooltip과 공유 → `src/types/index.ts`

## 구현 범위 (2026-11-25)

- 구현: SSOT Props 전체, `placement` 12종(`Placement` 타입은 `src/types`, 클래스는 camelCase 변환: `bottom-start` → `.bottomStart`). 바깥 클릭·ESC 닫기, ESC 시 트리거로 포커스 복귀. 트리거는 테두리형 버튼(`.popoverTrigger`).

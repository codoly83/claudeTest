# Switch

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 7장 결정 D1~D12)
> 출처: <https://codoly83.github.io/publishTemplate/guide/switch>
> 상태: **구현됨(일부)** — `src/components/common/Switch.tsx`, 스토리 id `switch` (2026-11-25, shadcn/ui 참고). 구현 범위는 아래 "구현 범위" 참고.
> 마지막 수정: 2026-11-25

---

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/common/Switch.tsx` |
| 스토리 id | `switch` |
| 원본 variant·size | default/sm |
| 외부 의존 | Radix → 직접 구현 |
| 판정 | 채택 가능 |

## 정의

- **위치 / 스토리 id:** `common/Switch.tsx` / `#switch`
- **원본 옵션:** `size: default|sm`, `checked/onCheckedChange`, `disabled`, `onLabel/offLabel`(기본 ON/OFF)
- **Props (SSOT)**
  ```ts
  interface SwitchProps {
      checked: boolean;
      onChange?: (checked: boolean) => void;
      label: string;                 // 접근성 이름 (원본 aria-label)
      onLabel?: string;              // 기본 'ON'
      offLabel?: string;             // 기본 'OFF'
      size?: 'md' | 'sm';            // 원본 default → 'md'
      disabled?: boolean;
  }
  ```
- **마크업·접근성:** `button.switch(.on|.disabled)[role=switch][aria-checked]`, Space/Enter 토글
- **주의:** 원본 `className="w-20"`(긴 라벨 폭) → 라벨 길이에 맞게 CSS `min-width`로 자동 대응

## 구현 범위 (2026-11-25)

- 구현: SSOT Props 전체(`size` md 68×32 / sm 52×24). Header 다크모드 스위치도 이 컴포넌트로 교체(보이는 문구 "다크모드 설정" + `label`).

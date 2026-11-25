# Radio

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 7장 결정 D1~D12)
> 출처: <https://codoly83.github.io/publishTemplate/guide/radio>
> 상태: **구현됨(일부)** — `src/components/common/Radio.tsx`, 스토리 id `radio` (2026-11-25, shadcn/ui 참고). 구현 범위는 아래 "구현 범위" 참고.
> 마지막 수정: 2026-11-25

---

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/common/Radio.tsx` |
| 스토리 id | `radio` (D10) |
| 원본 variant·size | — |
| 외부 의존 | Radix → 직접 구현 |
| 판정 | 채택 가능 |

## 정의

- **위치 / 스토리 id:** `common/Radio.tsx` / `#radio` (D10)
- **원본 옵션:** `RadioGroup(defaultValue|value, onValueChange)`, `Radio(value, label, disabled, children)`, `aria-invalid`
- **Props (SSOT)** — 라디오는 항상 그룹이므로 그룹 단위 컴포넌트로 정의
  ```ts
  interface RadioOption { value: string; label: string; description?: string; disabled?: boolean; }
  interface RadioProps {
      options: RadioOption[];
      value: string;
      onChange?: (value: string) => void;
      legend: string;                      // fieldset > legend
      name?: string;                       // 미지정 시 useId
      hasError?: boolean;
      errorMessage?: string;
  }
  ```
- **마크업:** `fieldset.radioGroup > legend + label.radio(.on|.disabled) > input[type=radio] + span.radioIcon + span.radioLabel`
- **접근성:** 네이티브 radio 사용 → 방향키 이동 자동 지원

## 구현 범위 (2026-11-25)

- 구현: SSOT Props 전체. 항목 `description` 지원, 오류 시 각 radio에 `aria-invalid`·`aria-describedby`.

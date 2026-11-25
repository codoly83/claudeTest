# InputStepper

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 7장 결정 D1~D12)
> 출처: <https://codoly83.github.io/publishTemplate/guide/input-stepper>
> 상태: **구현됨** — `src/components/common/InputStepper.tsx`, 명세 화면 탭(샘플·Playground·API, 스토리 id `inputStepper`) (2026-11-25). 구현 범위는 아래 "구현 범위" 참고.
> 마지막 수정: 2026-11-25

---

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/common/InputStepper.tsx` |
| 스토리 id | `inputStepper` |
| 원본 variant·size | plusMinus/chevron · number/date |
| 외부 의존 | — |
| 판정 | **구현됨 (2026-11-25)** |

## 정의

- **위치 / 스토리 id:** `common/InputStepper.tsx` / `#inputStepper`
- **원본 옵션:** `mode: number|date`, `stepperVariant: plusMinus|chevron`, `min/max/step`(date는 일 단위), `disabled`, `readOnly`, `aria-invalid`
- **Props (SSOT)**
  ```ts
  interface InputStepperProps {
      value: string;                       // number: '1.5' / date: 'YYYY-MM-DD'
      onChange?: (value: string) => void;
      mode?: 'number' | 'date';            // 기본 'number'
      variant?: 'plusMinus' | 'chevron';   // 원본 stepperVariant
      min?: number | string;
      max?: number | string;
      step?: number;                       // 기본 1
      label: string;                       // 버튼 이름에 사용 ("수량 감소")
      disabled?: boolean;
      readOnly?: boolean;                  // 스테퍼 버튼도 비활성
      hasError?: boolean;
      errorMessage?: string;
  }
  ```
- **동작:** min/max 도달 시 해당 버튼 `disabled`. ↑↓ 키 증감(spinbutton 패턴)

## 구현 범위 (2026-11-25)

- 사용자 요청("미구현 명세도 정상적으로 나오게", 라이브러리 설치 승인)으로 구현했습니다. 스토리: `src/data/storiesAtomPlus.tsx`.
- Props: `value`, `onChange`, `label`, `mode`(number·date), `variant`(plusMinus·chevron), `min`·`max`, `step`, `disabled`, `readOnly`, `hasError`·`errorMessage`.
- 메모: number는 `role="spinbutton"` + `aria-valuenow/min/max`, ↑↓ 키 증감, 소수 step 오차 정리. date는 `input[type=date]` + date-fns로 일 단위 증감. min/max 도달 시 해당 버튼 disabled, 범위를 넘으면 경계값. 버튼 이름은 "{label} 감소/증가".

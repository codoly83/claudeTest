# Checkbox

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 7장 결정 D1~D12)
> 출처: <https://codoly83.github.io/publishTemplate/guide/checkbox>
> 상태: **구현됨(일부)** — `src/components/common/Checkbox.tsx`, 스토리 id `checkbox` (2026-11-24). 구현 범위는 아래 "구현 범위" 참고.
> 마지막 수정: 2026-11-24

---

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/common/Checkbox.tsx` |
| 스토리 id | `checkbox` |
| 원본 variant·size | default/spec/btn |
| 외부 의존 | Radix → 직접 구현 |
| 판정 | 채택 가능 |

## 정의

- **위치 / 스토리 id:** `common/Checkbox.tsx` / `#checkbox` (+ 2곳 이상이면 `CheckboxGroup.tsx`)
- **원본 옵션:** `variant: default|spec|btn`, `label` 또는 children(라벨+설명), `disabled`, `aria-invalid`, `CheckboxGroup(value[], onValueChange)`
- **Props (SSOT)**
  ```ts
  interface CheckboxProps {
      checked: boolean;
      onChange?: (checked: boolean) => void;
      label?: string;
      description?: string;              // 원본 custom label의 설명 줄
      variant?: 'default' | 'spec' | 'btn';
      disabled?: boolean;
      hasError?: boolean;
      errorMessage?: string;
  }
  interface CheckboxGroupProps {
      options: { value: string; label: string; disabled?: boolean }[];
      value: string[];
      onChange?: (value: string[]) => void;
      legend: string;                    // fieldset > legend
  }
  ```
- **마크업:** `label.checkbox.{variant}(.on|.disabled) > input[type=checkbox] + span.checkboxIcon + span.checkboxLabel` — 실제 `<input>` 유지(네이티브 키보드), id는 `useId`
- **주의:** `variant="spec"`(아이콘 전용)은 `aria-label` 필수
- **9.2:** 폼(라벨 클릭 포커스·오류 연결) · 상태(checked/disabled/checked+disabled)

## 구현 범위 (2026-11-24)

- 구현: `checked`·`onChange(checked)`(제어형), `label`, `name`, `disabled`, `hasError`·`errorMessage`. 실제 `<input type="checkbox">`를 쓰고(키보드 Space, 라벨 클릭) 화면에는 20px 상자를 그립니다. 체크 표시는 디자인 에셋 `iconCheck.svg`를 마스크로 사용.
- 상태 클래스: 선택 `on`, 비활성 `disabled`.
- 아직 구현하지 않음: `variant`(`spec`·`btn`), `description`, `CheckboxGroup` — 여러 개 묶음은 페이지에서 `fieldset`·`legend`로 구성합니다.
- 모양: 상자 테두리 `--color-border-strong`·모서리 6px, 선택 시 배경 `--color-text`·체크 `--color-text-inverse`, 오류 시 테두리 `--color-red`.

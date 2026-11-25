# Input

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 7장 결정 D1~D12)
> 출처: <https://codoly83.github.io/publishTemplate/guide/input>
> 상태: **구현됨(일부)** — `src/components/common/Input.tsx`, 스토리 id `input` (2026-11-24). 구현 범위는 아래 "구현 범위" 참고.
> 마지막 수정: 2026-11-24

---

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/common/Input.tsx` |
| 스토리 id | `input` |
| 원본 variant·size | default/search/searchBtn |
| 외부 의존 | — |
| 판정 | 채택 가능 |

## 정의

- **위치 / 스토리 id:** `common/Input.tsx` / `#input`
- **원본 옵션:** `disabled`, `type="password"`, `aria-invalid`, `resetEnabled`, `InputGroup`(addon `inline-start|inline-end|block-start|block-end`, `InputGroupText`, `InputGroupButton`), search / `type="btnType"` 검색
- **SSOT 조건:** InputGroup 복합 구조를 Props로 단순화합니다.
  ```ts
  interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'prefix' | 'className'> {
      value: string;
      onChange?: (value: string) => void;
      label?: string;
      variant?: 'default' | 'search' | 'searchBtn';   // 원본 search / search-btnType
      prefix?: ReactNode;          // inline-start (텍스트·아이콘)
      suffix?: ReactNode;          // inline-end (예: KRW)
      topText?: ReactNode;         // block-start
      helpText?: string;           // block-end 안내 → aria-describedby
      hasReset?: boolean;          // 값이 있을 때만 리셋 버튼, suffix 바로 앞
      onSearch?: () => void;       // search 변형 버튼 클릭
      hasError?: boolean;
      errorMessage?: string;
  }
  ```
- **마크업:** `div.inputField(.disabled) > label + div.inputBox > span.inputPrefix + input + button.inputReset + span.inputSuffix` + `p.inputHelp` / `p.inputError`
- **접근성:** 리셋·검색 버튼 `aria-label`("입력값 지우기", "검색"), 리셋 후 input으로 포커스 복귀
- **9.2:** 폼 · 상태(disabled, error)

## 구현 범위 (2026-11-24)

- 구현: `label`(필수 — 화면에 보이는 라벨로 접근 가능한 이름 보장), `value`·`onChange(value)`(제어형), `type` 등 input 기본 속성(`name`, `placeholder`, `autoComplete`, `inputMode`, `maxLength`, `required`, `disabled`), `helpText`, `hasError`·`errorMessage`(`aria-invalid`·`aria-describedby`, `useId`).
- `required`면 라벨 옆에 빨간 `*`(장식용, `aria-hidden`)를 표시합니다. 필수 여부는 `required` 속성으로 보조기술에 전달됩니다.
- 아직 구현하지 않음: `variant`(`search`·`searchBtn`), `prefix`·`suffix`·`topText`, `hasReset`.
- 모양: 높이 36px, 테두리 `--color-border-strong`·모서리 8px, 포커스 시 `--color-primary`, 오류 시 `--color-red`, placeholder `--color-text-disabled`.

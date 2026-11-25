# Select

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 7장 결정 D1~D12)
> 출처: <https://codoly83.github.io/publishTemplate/guide/select>
> 상태: **구현됨(일부)** — `src/components/common/Select.tsx`, 스토리 id `select` (2026-11-25, shadcn/ui 참고). 구현 범위는 아래 "구현 범위" 참고.
> 마지막 수정: 2026-11-25

---

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/common/Select.tsx` |
| 스토리 id | `select` |
| 원본 variant·size | default/btnType · default/sm · multiple |
| 외부 의존 | Radix → 직접 구현 |
| 판정 | 채택 가능 |

## 정의

- **위치 / 스토리 id:** `common/Select.tsx` / `#select`
- **원본 옵션:** `defaultValue`, `placeholder`, `disabled`, Trigger `aria-invalid`, 항목 `disabled`, `resetEnabled`, `SelectMultiple(label, options, value[])`, `SelectSimple(label, options)`, Trigger `size: default|sm`, `variant: btnType`, `SelectGroup/Label/Separator`, `position="popper"`, 긴 목록 스크롤
- **SSOT 조건:** `Select` / `SelectSimple` / `SelectMultiple` 3종은 **하나의 `Select`로 통합** (중복 금지).
  ```ts
  interface SelectOption { value: string; label: string; disabled?: boolean; group?: string; }
  interface SelectProps {
      options: SelectOption[];            // group 값이 있으면 그룹 라벨 + 구분선 렌더링
      value: string | string[];           // multiple이면 string[]
      onChange?: (value: string | string[]) => void;
      multiple?: boolean;                 // HTML 속성명과 동일 → 접두어 없음
      label?: string;
      placeholder?: string;
      size?: 'md' | 'sm';                 // 원본 default → 'md'
      variant?: 'default' | 'btnType';
      hasReset?: boolean;
      disabled?: boolean;
      hasError?: boolean;
      errorMessage?: string;
  }
  ```
- **구현 방식 결정:** ① 네이티브 `<select>` (접근성·모바일 유리, 디자인 제약) ② 커스텀 리스트박스 (WAI-ARIA Select-Only Combobox 패턴: ↑↓·Home·End·Enter·ESC·타이핑 검색). 원본 디자인(체크 표시·리셋 버튼·multiple 칩)은 ②가 필요
- **드롭다운:** Portal 없이 트리거 아래, 긴 목록은 최대 높이 + 스크롤
- multiple 선택 요약 표시(원본: "이메일, 푸시 알림 / 2개")
- **9.2:** 키보드 · 폼 · 상태

## 구현 범위 (2026-11-25)

- 구현 방식 ① 네이티브 `<select>` 단일 선택: `options`(value·label·disabled·group → optgroup), `value: string`, `onChange(value)`, `label`(필수로 변경 — 접근 가능한 이름), `name`, `placeholder`(value `""`), `size` md 36 / sm 32px, `disabled`, `hasError`, `errorMessage`.
- 아직 구현하지 않음: `multiple`, `variant: btnType`, `hasReset`, 체크 표시가 있는 커스텀 목록(방식 ②).

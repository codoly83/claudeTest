# Textarea

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 7장 결정 D1~D12)
> 출처: <https://codoly83.github.io/publishTemplate/guide/textarea>
> 상태: **구현됨(일부)** — `src/components/common/Textarea.tsx`, 스토리 id `textarea` (2026-11-25, shadcn/ui 참고). 구현 범위는 아래 "구현 범위" 참고.
> 마지막 수정: 2026-11-25

---

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/common/Textarea.tsx` |
| 스토리 id | `textarea` |
| 원본 variant·size | — |
| 외부 의존 | — |
| 판정 | 채택 가능 |

## 정의

- **위치 / 스토리 id:** `common/Textarea.tsx` / `#textarea`
- **원본 옵션:** `rows`, `maxLength` + 글자 수 카운터(90% 이상 빨강, `aria-live`), InputGroup 상단 라벨·하단 액션(첨부·업로드 버튼)
- **Props (SSOT)**
  ```ts
  interface TextareaProps {
      value: string;
      onChange?: (value: string) => void;
      label?: string;
      placeholder?: string;
      rows?: number;                 // 기본 4
      maxLength?: number;
      hasCounter?: boolean;          // maxLength 있을 때 '0 / 500'
      helpText?: string;
      footer?: ReactNode;            // 원본 block-end 액션 영역
      disabled?: boolean;
      hasError?: boolean;
      errorMessage?: string;
  }
  ```
- **조건:** 원본의 `id="textarea-hint"`·`"textarea-count"` 하드코딩 → `useId()` (9.1 자동 검사 대상). 경고 색은 `.textareaCount.on`(90% 이상) 클래스 토글
- **9.2:** 폼(라벨·aria-describedby에 안내+카운터 연결)

## 구현 범위 (2026-11-25)

- 구현: SSOT Props 전체 + `name`·`required`. `label`은 필수로 변경(접근 가능한 이름). 라벨·안내·오류 클래스는 Input과 공유(`inputLabel`·`inputHelp`·`inputError`).

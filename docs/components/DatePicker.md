# DatePicker / DateRangePicker — react-day-picker·date-fns 사전 승인 (D4)

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 7장 결정 D1~D12)
> 출처: <https://codoly83.github.io/publishTemplate/guide/datepicker>
> 상태: **구현됨** — `src/components/common/DatePicker.tsx`, 명세 화면 탭(샘플·Playground·API, 스토리 id `datePicker`) (2026-11-25). 구현 범위는 아래 "구현 범위" 참고.
> 마지막 수정: 2026-11-25

---

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/common/DatePicker.tsx`, `src/components/common/DateRangePicker.tsx` |
| 스토리 id | `datePicker` |
| 원본 variant·size | default/btnType |
| 외부 의존 | react-day-picker, date-fns (사전 승인) |
| 판정 | **구현됨 (2026-11-25)** |

## 정의

- **원본 옵션:** `variant: default|btnType`, `placeholder`(YYYY.MM.DD), `defaultValue`, `disabled`, `aria-invalid`, `resetEnabled`, `value/onValueChange`, `calendarProps.disabled`(Matcher: before/after/배열/함수), `fromDate/toDate`, `formatString`, `DateRangePickerTwoPickers`
- **SSOT 조건:** react-day-picker + date-fns 사용 (사전 승인). 라이브러리 기본 CSS를 쓰면 공식 CSS import 후 재정의는 `common.css`에 `#wrap .datePicker …`로 범위 한정.
  ```ts
  type DateMatcher = { before: Date } | { after: Date } | ((date: Date) => boolean);
  interface DatePickerProps {
      value?: Date;
      onChange?: (value: Date | undefined) => void;
      variant?: 'default' | 'btnType';
      placeholder?: string;           // 기본 'YYYY.MM.DD'
      format?: string;                // 기본 'yyyy.MM.dd'
      minDate?: Date;                 // 원본 fromDate
      maxDate?: Date;                 // 원본 toDate
      disabledDates?: DateMatcher[];
      hasReset?: boolean;             // 원본 resetEnabled
      label?: string;
      disabled?: boolean;
      hasError?: boolean;
      errorMessage?: string;
  }
  interface DateRangePickerProps extends Omit<DatePickerProps, 'value' | 'onChange'> {
      value?: { from?: Date; to?: Date };
      onChange?: (value: { from?: Date; to?: Date }) => void;
  }
  ```
- **달력 팝업:** Portal 없이 트리거 옆 렌더링(5.1.1), 잘리는 경우만 `#modalWrap`. 달력은 WAI-ARIA Date Picker Dialog 패턴 (방향키 날짜 이동, ESC 닫기, 포커스 복귀)
- **`TwoPickers`:** DatePicker 2개 조합은 페이지에서 구성 (별도 컴포넌트 만들지 않음)

## 구현 범위 (2026-11-25)

- 사용자 요청("미구현 명세도 정상적으로 나오게", 라이브러리 설치 승인)으로 구현했습니다. 스토리: `src/data/storiesAtomPlus.tsx`.
- Props: `mode`(`single`·`range`), `value`, `onChange`, `label`, `variant`(default·btnType), `placeholder`, `format`, `minDate`·`maxDate`, `disabledDates`(react-day-picker `Matcher[]`), `hasReset`, `disabled`, `hasError`·`errorMessage`.
- 메모: DateRangePicker를 따로 만들지 않고 `mode="range"`로 통합(같은 기능 분리 금지, AGENTS 5.1.1). react-day-picker 10 + 한국어 locale, 공식 CSS(`react-day-picker/style.css`) import 후 `#wrap .datePopup .rdp-root` 변수만 재정의. 달력은 Portal 없이 트리거 아래(`.datePopup[role=dialog]`), 열면 선택일(없으면 오늘)로 포커스, ESC·바깥 클릭으로 닫고 트리거로 포커스 복귀. 스토리 id는 파일명 기준 `datePicker`.

# Progress

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 7장 결정)
> 출처: <https://ui.shadcn.com/docs/components/progress>
> 상태: **구현됨** — `src/components/common/Progress.tsx`, 스토리 id `progress` (2026-11-25, 사용자 요청: shadcn/ui 참고 컴포넌트 추가)
> 마지막 수정: 2026-11-25

---

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/common/Progress.tsx` |
| 스토리 id | `progress` |
| 원본 variant·size | — |
| 외부 의존 | Radix·Lucide → 직접 구현, 아이콘은 `src/assets/icons` SVG |
| 판정 | 채택 (메인 컴포넌트 목록·명세 화면) |

## 정의

- **위치 / 스토리 id:** `common/Progress.tsx` / `#progress`
- **Props (SSOT)**
  ```ts
  interface ProgressProps {
      value: number;
      label: string;            // label[for]로 progress와 연결
      max?: number;             // 기본 100
      hasValueText?: boolean;   // % 표시, 기본 true
  }
  ```
- **마크업·클래스:** `div.progressField > div.progressHead(label.progressLabel + span.progressValue) + progress.progress`
- **접근성·조건:** 네이티브 `<progress>` 사용 → 진행 값 의미 제공, 채움 막대는 `::-webkit-progress-value`·`::-moz-progress-bar`로 그려 인라인 스타일이 필요 없음.
- **스타일:** `common.css` 03 섹션, `#wrap` 토큰만 사용 (다크모드 자동 전환)

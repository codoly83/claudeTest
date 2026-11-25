# Chart — recharts 사전 승인 (D4)

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 7장 결정 D1~D12)
> 출처: <https://codoly83.github.io/publishTemplate/guide/chart>
> 상태: **구현됨** — `src/components/common/Chart.tsx`, 명세 화면 탭(샘플·Playground·API, 스토리 id `chart`) (2026-11-25). 구현 범위는 아래 "구현 범위" 참고.
> 마지막 수정: 2026-11-25

---

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/common/Chart.tsx` |
| 스토리 id | `chart` |
| 원본 variant·size | line/area/bar/pie/radar |
| 외부 의존 | recharts (사전 승인) |
| 판정 | **구현됨 (2026-11-25)** |

## 정의

- **원본:** recharts 기반 `ChartLine / ChartArea / ChartBar / ChartPie / ChartRadar`, Props `data`, `xKey`(또는 `angleKey`), `series: { dataKey, name, color }[]`
- **SSOT 조건:** recharts는 사전 승인됨. Chart를 실제로 구현할 때 설치합니다 (AGENTS 2장).
  ```ts
  interface ChartSeries { dataKey: string; name: string; color: string; }
  interface ChartProps<T> {
      type: 'line' | 'area' | 'bar' | 'pie' | 'radar';
      data: T[];
      xKey: keyof T;
      series: ChartSeries[];
      title: string;           // 접근성: 차트 요약용 (sr-only 텍스트)
  }
  ```
  - `series.color`는 데이터 색상 → 인라인 허용 범위(5.3.1)이나, 가능하면 토큰(`var(--color-primary)`) 문자열 사용
  - 차트 외에 표 형태 대체 데이터 제공 권장

## 구현 범위 (2026-11-25)

- 사용자 요청("미구현 명세도 정상적으로 나오게", 라이브러리 설치 승인)으로 구현했습니다. 스토리: `src/data/storiesAtomPlus.tsx`.
- Props: `type`(line·area·bar·pie·radar), `data`, `xKey`, `series`(dataKey·name·color), `title`, `size`(sm 200·md 280·lg 360px), `hasLegend`.
- 메모: `series.color`는 임의 색 문자열 대신 **토큰 이름**(`green`·`blue`·`yellow`·`red`·`purple`·`gray`, Chip과 같은 `ChipColor`)으로 받아 `var(--color-*)`로 그립니다(인라인 색 금지). 파이는 첫 series만 쓰고 조각 색은 토큰 순서. 보조기술용으로 `figcaption`과 같은 데이터의 숨김 표(srOnly)를 함께 제공. 축 글자·격자·툴팁 색은 `common.css`에서 재정의(툴팁은 라이브러리 인라인 스타일이라 `!important`).

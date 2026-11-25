# Grid

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 2.3 콘텐츠 배치 규칙, 7장 결정)
> 출처: 프로젝트 자체 정의 (사용자 요청 "배치 관련 컴포넌트·간격 sm/md/lg", 2026-11-25)
> 상태: **구현됨** — `src/components/common/Grid.tsx`, 스토리 id `grid` (2026-11-25)
> 마지막 수정: 2026-11-25

---

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/common/Grid.tsx` |
| 스토리 id | `grid` |
| variant·size | columns `1`·`2`·`3`·`4` · gap `sm`·`md`·`lg` |
| 외부 의존 | — |
| 판정 | 채택 (배치 컴포넌트) |

## 정의

- **역할:** 같은 폭의 열로 자식을 나눕니다. 카드 목록, 통계 카드, 2단 폼 등.
- **Props (SSOT)**
  ```ts
  interface GridProps {
      columns?: 1 | 2 | 3 | 4;        // 데스크톱(1024px 이상) 열 수, 기본 2
      gap?: 'sm' | 'md' | 'lg';       // 기본 'md' (8 / 16 / 24px)
      children: ReactNode;
  }
  ```
- **반응형 (모바일 우선, 고정 규칙):**

  | 폭 | 열 수 |
  | --- | --- |
  | 0~767px | 1열 |
  | 768~1023px | `min(columns, 2)`열 |
  | 1024px 이상 | `columns`열 |

- **마크업·클래스:** `div.grid.cols{1~4}.gap{Sm|Md|Lg}` (CSS Grid, `repeat(n, minmax(0, 1fr))`).
- **규칙:** 열 수는 프리셋만 씁니다(숫자 인라인 금지, D8). 한 칸을 여러 열로 합치는 기능은 디자인 원본에 생길 때 추가합니다.

## 9.2 수동 검수 포인트

- 360px 1열, 768px 최대 2열, 1024px 이상 지정 열 수로 바뀐다.
- 칸 안 내용이 길어도 가로로 넘치지 않는다.

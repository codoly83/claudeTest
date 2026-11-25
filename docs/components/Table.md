# Table

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 7장 결정 D1~D12)
> 출처: <https://codoly83.github.io/publishTemplate/guide/table>
> 상태: **구현됨(일부)** — `src/components/common/Table.tsx`, 스토리 id `table` (2026-11-24). 구현 범위는 아래 "구현 범위" 참고.
> 마지막 수정: 2026-11-25

---

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/common/Table.tsx` |
| 스토리 id | `table` |
| 원본 variant·size | horizontal/vertical · default/sub |
| 외부 의존 | — |
| 판정 | 채택 가능 |

## 정의

- **위치 / 스토리 id:** `common/Table.tsx` / `#table`
- **원본 옵션:** `type: horizontal(행 머리글)|vertical(열 머리글)`, `variant: default|sub`(테두리 없음), `TableCaption`, `colgroup` 폭, 셀 안 Input·Checkbox
- **Props (SSOT)**
  ```ts
  interface TableColumn<T> {
      key: string;
      header: ReactNode;
      width?: 'xs' | 'sm' | 'md' | 'lg';          // 원본 colgroup 폭 → 클래스 프리셋 (값은 디자인 확정)
      render?: (row: T) => ReactNode;             // 입력폼 셀 (Input, Checkbox)
  }
  interface TableProps<T extends { id: string }> {
      caption: string;                            // 필수 (원본 TableCaption)
      columns: TableColumn<T>[];
      rows: T[];
      type?: 'vertical' | 'horizontal';           // 기본 'vertical'
      variant?: 'default' | 'sub';
  }
  ```
- **마크업·접근성:** `table.table.{type}.{variant}`, `caption`(시각적 숨김 가능), `th scope="col"`(vertical) / `scope="row"`(horizontal), 모바일 넘침은 `div.tableWrap { overflow-x:auto }` + `tabIndex=0`
- **D8 결정:** 열 폭은 `columns[].width` 프리셋 → `<col className="colSm">` 등 클래스. 값은 디자인 원본에서 확정

## 구현 범위 (2026-11-24)

- 구현: `caption`(필수, 시각적으로 숨김), `columns`(`key`·`header`·`align`(`start`·`center`)·`render`), `rows`, `getRowKey` — 세로형(열 머리글) sub 스타일 1종.
- 아직 구현하지 않음: `type="horizontal"`, `variant`, 열 폭 프리셋(`width`).
- 모양: 머리글 배경 `--color-btn-gray`·글자 `--color-on-primary`·가운데 정렬, 칸 경계 `--color-border-strong`, 좁은 화면은 가로 스크롤.

## 구현 범위 확장 — 목록형·상세형 (2026-11-25, 배치 규칙 — component-ssot.md 2.3)

원본 `type: vertical | horizontal`을 용도 이름으로 바꿔 **`type: 'list' | 'result'`** 하나의 컴포넌트로 둡니다 (같은 기능 분리 금지, AGENTS 5.1.1).

| type | 별칭 | 머리글 | 용도 |
| --- | --- | --- | --- |
| `list` (기본) | table-list, 원본 vertical | 위쪽 열 머리글 `th scope="col"` | 여러 행 목록 (게시판, 작업 목록) |
| `result` | table-result, 원본 horizontal | 왼쪽 행 머리글 `th scope="row"` | 한 건의 항목:값 (상세, 조회 결과, 신청 내용 확인) |

```ts
// src/types/index.ts
interface TableResultItem {
    key: string;
    label: string;
    value: ReactNode;                  // 비어 있으면 '-' 표시
}

interface TableListProps<T> {
    type?: 'list';
    caption: string;
    columns: TableColumn<T>[];
    rows: T[];
    getRowKey: (row: T) => string;
}
interface TableResultProps {
    type: 'result';
    caption: string;
    items: TableResultItem[];
    itemsPerRow?: 1 | 2;               // 한 줄에 항목 몇 쌍, 기본 1
}
type TableProps<T> = TableListProps<T> | TableResultProps;
```

- 마크업: `table.table.list` / `table.table.result.perRow{1|2}`. `result`의 머리글 칸은 배경 `--color-bg-subtle`, 글자 `--color-text`, 왼쪽 정렬, 폭 고정(1쌍 160px·2쌍 140px).
- `itemsPerRow={2}`에서 항목 수가 홀수면 마지막 값 칸이 남은 칸을 채웁니다(`colSpan`).
- 아직 구현하지 않음: `variant`(테두리 없음), 열 폭 프리셋(`width`).

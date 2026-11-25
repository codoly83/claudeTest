# TextList

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 7장 결정 D1~D12)
> 출처: <https://codoly83.github.io/publishTemplate/guide/text-list>
> 상태: **구현됨** — `src/components/common/TextList.tsx`, 명세 화면 탭(샘플·Playground·API, 스토리 id `textList`) (2026-11-25). 구현 범위는 아래 "구현 범위" 참고.
> 마지막 수정: 2026-11-25

---

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/common/TextList.tsx` |
| 스토리 id | `textList` |
| 원본 variant·size | dot/decimal/circled/star/square · sm/md/lg |
| 외부 의존 | — |
| 판정 | **구현됨 (2026-11-25)** |

## 정의

- **위치 / 스토리 id:** `common/TextList.tsx` / `#textList`
- **원본 옵션:** `type: dot|decimal|circled|star|square`, `size: sm|md|lg`, `gap`(숫자), `start`, `items: (string | { content, type, marker, number, markerType })[]`, `TextList.Item` JSX 합성
- **Props (SSOT)**
  ```ts
  type TextListType = 'dot' | 'decimal' | 'circled' | 'star' | 'square';
  interface TextListItem { content: ReactNode; type?: TextListType; marker?: string; number?: number; }
  interface TextListProps {
      items: (string | TextListItem)[];
      type?: TextListType;           // 기본 'dot'
      size?: 'sm' | 'md' | 'lg';     // 기본 'md'
      start?: number;                // 기본 1 (decimal/circled)
  }
  ```
- **SSOT 조건:** `gap` 숫자 → size별 CSS 간격으로 고정(임의 숫자 인라인 금지). `TextList.Item` 합성 API는 배열 Props 규칙과 중복이므로 **제외**. 원본의 `markerType`/`type` 중복 필드 → `type` 하나로 통일
- **마크업:** 순서형(decimal·circled)은 `ol`, 그 외 `ul`. 마커는 `span.textListMarker[aria-hidden]`

## 구현 범위 (2026-11-25)

- 사용자 요청("미구현 명세도 정상적으로 나오게", 라이브러리 설치 승인)으로 구현했습니다. 스토리: `src/data/storiesAtomPlus.tsx`.
- Props: `items`(string | { content, type, marker, number }), `type`(dot·decimal·circled·star·square), `size`(sm·md·lg), `start`.
- 메모: 순서형(decimal·circled)은 `ol`, 나머지 `ul`. 마커는 `span.textListMarker[aria-hidden]` 글자(•·1.·①·★·■, `marker`로 덮어쓰기). 간격은 size별 고정.

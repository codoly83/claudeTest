# Stack

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 2.3 콘텐츠 배치 규칙, 7장 결정)
> 출처: 프로젝트 자체 정의 (사용자 요청 "배치 관련 컴포넌트·간격 sm/md/lg", 2026-11-25)
> 상태: **구현됨** — `src/components/common/Stack.tsx`, 스토리 id `stack` (2026-11-25)
> 마지막 수정: 2026-11-25

---

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/common/Stack.tsx` |
| 스토리 id | `stack` |
| variant·size | direction `column`·`row` · gap `sm`·`md`·`lg` |
| 외부 의존 | — |
| 판정 | 채택 (배치 컴포넌트) |

## 정의

- **역할:** 자식 요소를 한 방향으로 쌓고 **형제 사이 간격**을 정합니다. 페이지 블록 쌓기, 폼 필드 묶음, 버튼 줄 등.
- **Props (SSOT)**
  ```ts
  interface StackProps {
      direction?: 'column' | 'row';                          // 기본 'column'
      gap?: 'sm' | 'md' | 'lg';                              // 기본 'md' (8 / 16 / 24px)
      align?: 'start' | 'center' | 'end' | 'stretch';        // 교차축 정렬, 기본 'stretch'
      justify?: 'start' | 'center' | 'end' | 'between';      // 주축 정렬, 기본 'start'
      isWrap?: boolean;                                      // row에서 줄바꿈, 기본 false
      children: ReactNode;
  }
  ```
- **마크업·클래스:** `div.stack.{column|row}.gap{Sm|Md|Lg}` + 정렬 클래스 `items{Start|Center|End}`(Table 칸 정렬 `.alignCenter`와 구분)·`justify{Center|End|Between}`·`isWrap`. 기본값(`stretch`·`start`)은 클래스를 붙이지 않습니다.
- **접근성:** 의미 없는 배치용 `div`. 목록 의미가 필요하면 Stack 안에 `ul`을 직접 씁니다.
- **규칙:** 자식에게 `margin`으로 간격을 주지 않습니다 (2.3). `direction="row"`는 모바일에서도 가로이므로, 화면 폭에 따라 열을 바꾸려면 `Grid`를 씁니다.

## 9.2 수동 검수 포인트

- gap `sm`·`md`·`lg`가 8·16·24px로 보인다.
- `row` + `isWrap`에서 좁은 폭일 때 줄이 바뀐다.

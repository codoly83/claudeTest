# Section

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 2.3 콘텐츠 배치 규칙, 7장 결정)
> 출처: 프로젝트 자체 정의 (사용자 요청 "배치 관련 컴포넌트·간격 sm/md/lg", 2026-11-25)
> 상태: **구현됨** — `src/components/common/Section.tsx`, 스토리 id `section` (2026-11-25)
> 마지막 수정: 2026-11-25

---

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/common/Section.tsx` |
| 스토리 id | `section` |
| variant·size | gap `sm`·`md`·`lg` · headingLevel `2`·`3`·`4` |
| 외부 의존 | — |
| 판정 | 채택 (배치 컴포넌트) |

## 정의

- **역할:** 페이지 안의 한 구역입니다. 제목·설명·오른쪽 버튼(머리) + 콘텐츠(몸통)를 묶습니다. 배경·테두리가 없는 점이 Card와 다릅니다.
- **Props (SSOT)**
  ```ts
  interface SectionProps {
      title: string;                  // 필수 — section의 접근 가능한 이름
      description?: string;
      action?: ReactNode;             // 머리 오른쪽 (버튼 등)
      headingLevel?: 2 | 3 | 4;       // 기본 3 (페이지 제목 h2 아래)
      gap?: 'sm' | 'md' | 'lg';       // 머리와 몸통 사이, 기본 'md'
      children: ReactNode;
  }
  ```
- **마크업·클래스:** `section.section.gap{Sm|Md|Lg}[aria-labelledby] > div.sectionHead(div.sectionHeadText > h{n}.sectionTitle + p.sectionDesc, div.sectionAction) + div.sectionBody`
- **접근성:** 제목 id는 `useId()`. 제목 단계는 문서 구조에 맞게 `headingLevel`로 지정합니다 (2.3 제목 단계 규칙).
- **규칙:** 구역 사이 간격은 Section끼리 감싼 부모 `Stack gap="lg"`로 줍니다.
- **페이지 루트:** 페이지 제목·설명·버튼은 `Section headingLevel={2} gap="lg"`로 만듭니다. `h2.sectionTitle`은 페이지 제목 크기(24px/36px), `h3`·`h4`는 구역 제목 크기(18px/26px)입니다 (2026-11-25, Dashboard·Payout 적용).

## 9.2 수동 검수 포인트

- 제목·설명·버튼이 한 줄로 정렬되고, 좁은 폭에서 버튼이 아래로 내려가도 겹치지 않는다.
- 스크린리더에서 제목 이름으로 구역(region)이 읽힌다.

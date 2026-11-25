# Card

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 7장 결정 D1~D12)
> 출처: <https://codoly83.github.io/publishTemplate/guide/card>
> 상태: **구현됨(일부)** — `src/components/common/Card.tsx`, 스토리 id `card` (2026-11-24). 구현 범위는 아래 "구현 범위" 참고.
> 마지막 수정: 2026-11-25

---

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/common/Card.tsx` |
| 스토리 id | `card` |
| 원본 variant·size | — |
| 외부 의존 | — |
| 판정 | 채택 가능 |

## 정의

- **위치 / 스토리 id:** `common/Card.tsx` / `#card`
- **원본 옵션:** `CardHeader / CardTitle / CardDescription / CardAction / CardContent / CardFooter`
- **Props (SSOT)**
  ```ts
  interface CardProps {
      title?: string;
      description?: string;
      action?: ReactNode;     // 헤더 우측 (원본 CardAction)
      footer?: ReactNode;
      children: ReactNode;
  }
  ```
- **마크업:** `section.card > header.cardHeader(h3.cardTitle, p.cardDesc, div.cardAction) + div.cardBody + footer.cardFooter`
- **제외:** `max-w-[420px]` 등 폭은 부모에서 지정

## 구현 범위 (2026-11-24)

- 구현: `title`(있으면 `section` + `aria-labelledby`, 없으면 `div`), `size`(`md` 제목 16px/600, `sm` 제목 14px/500), `action`(헤더 우측), `children`.
- 아직 구현하지 않음: `description`, `footer` — 필요해지면 추가합니다.
- 모양: 배경 `--color-bg`, 그림자 `--shadow-sm`(다크모드는 그림자 대신 테두리), 모서리 4px, 위아래 16px·좌우 16px 여백.

## 구현 범위 확장 (2026-11-25, 배치 규칙 — component-ssot.md 2.3)

```ts
interface CardProps {
    title?: string;
    description?: string;              // 제목 아래 보조 설명 (p.cardDesc)
    size?: 'md' | 'sm';                // 제목 크기
    padding?: 'sm' | 'md' | 'lg';      // 안쪽 여백 8 / 16 / 24px, 기본 'md' (--gap-*)
    headingLevel?: 2 | 3 | 4;          // 기본 3. Section 안의 Card는 4
    action?: ReactNode;
    footer?: ReactNode;                // 하단 영역 (div.cardFooter, 위 구분선)
    children: ReactNode;
}
```

- 마크업: `section.card.padding{Sm|Lg}`(md는 클래스 없음) `> div.cardHeader(div.cardHeadText > h{n}.cardTitle + p.cardDesc, div.cardAction) + div.cardBody + div.cardFooter`
- 안쪽 여백은 `padding` 프리셋 하나(`--card-padding`)로 정하고, 헤더·본문·하단 사이 간격은 그 절반입니다 (md: 여백 16px·사이 8px — 기존 모양 유지).
- 폭은 부모(`Grid`·`Stack`)가 정합니다.

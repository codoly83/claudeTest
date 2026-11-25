# 컴포넌트 SSOT 조건 정의 (`component-ssot.md`)

> **문서 구성:** 이 파일은 **공통 변환 원칙·기본설정·Hooks·결정 기록과 컴포넌트 목차**입니다. 컴포넌트별 조건은 **`docs/components/{컴포넌트명}.md`**에 한 파일씩 있습니다 (5장 목차).

> **출처:** Publish Template 가이드 <https://codoly83.github.io/publishTemplate/guide/ialist> (2026-11-24 조회)
> **기준 규칙:** `AGENTS.md`(SSOT) → `design.md` (`guide-spec.md`는 2026-11-25 `/Guide` 폐지로 삭제)
> **문서 상태:** 변환 기준 `확정`(결정 D1~D12 반영, 7장) / 컴포넌트 채택 `제안` — `AGENTS.md` 6.4 **2단계(화면 분석) 입력 자료**입니다. 디자인 원본에서 사용이 확인되어 승인된 컴포넌트만 `design.md` 2장 표와 `tasks.md` Phase 3에 옮기며, 그 전에는 코드를 작성하지 않습니다.
> 마지막 수정: 2026-11-25 (2.3 콘텐츠 배치 규칙, D13)

---

## 0. 이 문서를 읽는 법

출처 사이트는 **Tailwind + SCSS(module) + Radix/shadcn 계열 + 외부 라이브러리(lucide, sonner, dnd-kit, recharts 등)** 기반입니다. 이 프로젝트의 `AGENTS.md`는 이 중 상당수를 금지하므로, 원본 API를 그대로 옮기지 않고 아래 **변환 원칙**으로 바꿔 정의했습니다.

### 0.1 공통 변환 원칙 (원본 → 이 프로젝트)

| 원본 방식 | 이 프로젝트 규칙 | 근거 |
| --- | --- | --- |
| Tailwind 유틸리티 + `*.module.scss` | `src/assets/css/common.css` 한 파일, 모든 선택자 `#wrap` 시작, 클래스 camelCase | AGENTS 2장, 5.3 |
| `components/ui/Button/Button.tsx` (폴더 단위) | `src/components/common/Button.tsx` (파일 하나) | AGENTS 4.1 |
| `className` Props로 모양 커스텀 | **금지.** 배치·간격은 부모가, 새 모양은 variant 추가 + 스토리(명세 화면) 갱신 | AGENTS 5.1.1 |
| 복합 컴포넌트 `<AccordionItem><AccordionTrigger>…` | 반복 UI는 **배열 Props** (`items: XxxItem[]`) | AGENTS 5.1.1 반복 UI |
| `defaultValue` + `onValueChange` (비제어 기본) | 폼: **제어형** `value`/`checked` + `onChange(value)` / 반복 UI: 내부 `useState`, 필요 시 `activeIndex`+`onChange` | AGENTS 5.1.1 |
| `asChild` (Radix Slot) | 사용하지 않음. 링크가 필요하면 `href` Props로 `<a>` 렌더링 | 규칙에 없는 패턴, 단순화 |
| `resetEnabled`, `arrow`, `collapsible`, `enabled` 등 Boolean | HTML 속성과 같지 않으면 `is`/`has` 접두어: `hasReset`, `hasArrow`, `isCollapsible`… | AGENTS 5.1.1 Props 규칙 |
| `aria-invalid="true"` 직접 전달 | `hasError?: boolean` + `errorMessage?: string` → 내부에서 `aria-invalid`, `aria-describedby`(useId) 연결 | AGENTS 5.1.1 폼 |
| 상태 클래스 `data-state=open`, `checked` 등 | 상태 클래스는 **`on`, `disabled`만** | AGENTS 5.1.1 상태 클래스 |
| Portal 기본 대상 `document.body` | Modal·Toast·전체 Loading → **`#modalWrap`**. Tooltip·Popover·드롭다운은 Portal 없이 기준 요소 옆 | AGENTS 5.1.1 오버레이 |
| lucide-react / 자체 SVG 아이콘 | **디자인 원본 에셋만** `src/assets/icons/`에서 사용 | AGENTS 5.4 |
| `function Xxx()` 선언 | `const Xxx = () => {}` + 파일 끝 `export default` | AGENTS 5.1 |
| `style={{ … }}` | 런타임 동적 값만 허용 + `[inline-style]` 주석 + `design.md` 6.2 기록 | AGENTS 5.3.1 |
| 하드코딩 ID (`id="textarea-hint"`) | `useId()` 사용 | AGENTS 5.1.1 폼 |

### 0.2 컴포넌트 정의 템플릿

각 컴포넌트 문서(`docs/components/{컴포넌트명}.md`)는 머리말(출처·상태) → 요약표 → 정의 순서이며, 정의는 아래 항목으로 작성합니다. 새 컴포넌트를 추가할 때도 같은 형식으로 파일을 만들고 5장 목차에 한 줄을 추가합니다.

- **위치 / 스토리 id** — `src/components/common/Xxx.tsx`, 스토리 `id: 'xxx'`(camelCase 파일명, 명세 화면 `/spec/{컴포넌트}` 탭)
- **원본 옵션** — 출처 가이드에 실제로 있는 variant·size·옵션 (디자인 원본에 없는 값은 만들지 않음)
- **Props (SSOT)** — 이 프로젝트 규칙으로 변환한 `interface XxxProps`
- **마크업·클래스** — 루트 클래스, 변형 클래스, 상태 클래스
- **접근성·동작** — ARIA, 키보드
- **외부 의존 / 승인 필요** — 설치 정책상 사전 승인 대상
- **9.2 수동 검수 포인트**

> **채택 여부는 아직 미정입니다.** 5장 목록은 "출처 가이드에 있는 것 전부"이며, AGENTS 5.1에 따라 **실제 디자인 원본에서 2곳 이상 사용이 확인된 것만** `common/`으로 만듭니다.

---

## 1. 기본설정

### 1.1 Base (프로젝트 기본 정보)

| 항목 | 원본 값 | 이 프로젝트 SSOT 조건 |
| --- | --- | --- |
| 프로젝트 타입 | Responsive Web, 브레이크포인트까지 scaling | 반응형 모바일 우선(`min-width`). scaling 방식 채택 여부는 **미결정** (`requirements.md` 7장에 등록됨) |
| 브레이크포인트 | Mobile 360~767 / Tablet 768~1023 / Desktop 1024~1439 / Wide 1440+ | `768px`, `1024px`, `1440px` (D2 결정, AGENTS 5.3 반영) |
| 기술 스택 | TS + React + Tailwind 4.2 + Vite, CSS/SCSS | TS + React 18 + Vite + **일반 CSS만** (Tailwind·SCSS 미채택) |
| 타겟 브라우저 | Chrome/Edge/Safari/Samsung 최신 2버전, IE 미지원 | `requirements.md` 5장과 동일하게 유지 |
| CSS 로드 순서 | `_base → _font → _color → _layout → common.scss → contents.scss` | `common.css` 한 파일 안의 **섹션 순서**로 대체: `01 토큰 → 02 Reset/Base → 03 공통 컴포넌트 → 04 Layout → 05 Pages → 06 Swiper → 07 Responsive` (AGENTS 5.3 예시) |
| 접근성 체크 | 버튼 `type` 명시, `alt`, 라벨 연결, outline 제거 지양 | 동일하게 채택. 단 라벨 연결은 **`useId()`** (원본 예시의 `id="email"` 하드코딩 금지) |
| 네이밍/구조 | `components/ui/Button/Button.module.scss` | `components/common/Button.tsx` + `common.css` (폴더·모듈 CSS 금지) |

### 1.2 Color (디자인 토큰)

원본 `_color.css`의 실제 값을 `#wrap` CSS 변수로 옮깁니다. 이름은 `design.md` 6장 규칙(`--color-*`)에 맞춰 변환합니다.

| 원본 변수 | 값 | 이 프로젝트 토큰 (제안) | 용도 |
| --- | --- | --- | --- |
| `--primary` | `#00997a` | `--color-primary` | 주요 색 |
| `--font-b` | `#1f2533` | `--color-text` | 본문 텍스트 |
| `--font-g` | `#7a8599` | `--color-text-muted` | 보조 텍스트 |
| `--font-lg` | `#aab2bd` | `--color-text-disabled` | 비활성·placeholder |
| `--font-w` | `#fff` | `--color-text-inverse` | 반전 텍스트 |
| `--bg-base` | `#fff` | `--color-bg` | 기본 배경 |
| `--bg-container` | `#ebf0f5` | `--color-bg-container` | 컨테이너 배경 |
| `--bg-box` | `#f5f8fa` | `--color-bg-subtle` | 박스 배경 |
| `--bg-row` | `#fff` | `--color-bg-row` | 테이블 행 |
| `--line01` | `#ebf0f5` | `--color-border` | 기본 선 |
| `--line02` | `#dde4eb` | `--color-border-strong` | 강조 선 |
| `--btn-b` | `#1f2533` | `--color-btn-black` | 검정 버튼 |
| `--btn-g` | `#b8c2cc` | `--color-btn-gray` | 회색 버튼 |
| `--blue` / `--blue-50` | `#2b7bd6` / `#ebf5ff` | `--color-blue` / `--color-blue-50` | 상태색(Chip 등) |
| `--red` / `--red-50` | `#e73434` / `#ffebeb` | `--color-red` / `--color-red-50` | 오류 |
| `--purple` / `--purple-50` | `#a63ac0` / `#faebff` | `--color-purple` / `--color-purple-50` | 상태색 |
| `--yellow` / `--yellow-50` | `#ad7f23` / `#faf7e6` | `--color-yellow` / `--color-yellow-50` | 경고 |
| `--green-50` | `#e6faf3` | `--color-green-50` | 성공 배경 (진한 green은 `--color-primary` 사용) |
| `--gray-50` | `#f0f6fa` | `--color-gray-50` | 회색 배경 |

- 원본은 `@theme`(Tailwind)과 `:root`에 선언하지만, 이 프로젝트는 **`#wrap`에만** 선언합니다 (`:root` 금지).
- D1 결정으로 `design.md` 6장 토큰을 이 값으로 **교체 완료**했습니다. 실제 값의 기준은 `design.md` 6장입니다.

### 1.3 Font

| 항목 | 원본 | 토큰 (제안) |
| --- | --- | --- |
| 폰트 | Pretendard | `--font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;` |
| 크기 | 24 / 20 / 16 / 14 / 12px | `--font-size-2xl: 24px`, `--font-size-xl: 20px`, `--font-size-md: 16px`, `--font-size-sm: 14px`, `--font-size-xs: 12px` |
| 굵기 | 400 / 500 / 700 | `--font-weight-regular: 400`, `--font-weight-medium: 500`, `--font-weight-bold: 700` |

- 폰트 파일은 디자인 원본 제공분을 `src/assets/fonts/`에 둡니다 (CDN 사용 여부는 미결정).

### 1.4 TailwindCSS 전략 — **미채택**

- 원본: "컴포넌트는 SCSS, 페이지 배치는 Tailwind className" 혼용.
- 이 프로젝트: AGENTS 2장 **사용 금지** 항목. 페이지 배치도 `common.css`의 `#wrap` 하위 클래스(05 Pages 섹션)로 작성합니다. 원본의 `<Button className="w-full md:w-auto" />` 같은 패턴은 금지(5.1.1)이며, 부모 요소 클래스에서 처리합니다.

### 1.5 약속어 (camelCase)

원본 규칙과 AGENTS 5.2가 거의 일치하므로 아래를 SSOT로 확정 제안합니다.

| 대상 | 규칙 | 비고 |
| --- | --- | --- |
| 변수·함수·객체 key | camelCase | 동일 |
| 이벤트 핸들러 | `handle` + 대상 + 동사 (`handleSubmitForm`) | 동일 |
| Boolean | `is` / `has` / `can` / `should` | D11 결정, AGENTS 5.2 반영. Props는 `is`/`has` 규칙 우선 |
| 상수 | UPPER_SNAKE_CASE | 동일 |
| 컴포넌트 | PascalCase, **`const` 화살표 함수** | 원본 예시의 `function` 선언은 금지 |
| 커스텀 훅 | `use` + PascalCase (`useScrollSpy`) | 동일 |
| CSS 클래스 | camelCase. 외부 라이브러리 클래스(`swiper-slide`)만 kebab-case 그대로 | 동일 |
| 축약어 | 팀 공통 축약만 허용 (`cnt` ✕ → `count`) | 채택 |

**공통 약속어 (클래스·변수명 접미/접두):** `icon`, `btn`, `inner`, `area`, `wrap`, `box`, `list`/`item`, `title`/`desc`, `thumb`, `content`, `header`/`body`/`footer`, `form`/`field` → 예: `iconWrap`, `btnArea`, `contentInner`, `titleBox`, `formFieldList`.

### 1.6 폴더구조

| 원본 | 이 프로젝트 (AGENTS 4장) |
| --- | --- |
| `assets/icons`, `assets/styles` | `assets/icons`, `assets/css`(3파일만), `assets/images`, `assets/fonts` |
| `components/ui/` | `components/common/` |
| `components/layout/` | `components/layout/` (동일) |
| `providers/` | `providers/` (D9 결정, AGENTS 4장 반영) — `XxxProvider.tsx` 파일 단위 |
| `lib/` | `utils/` |
| `routes/` | `App.tsx`에서 라우팅 |
| `app/` (개발 페이지) | `pages/` |
| `publish/guide/{components,hooks,layout,pageFeatures}` | `pages/Spec.tsx`(명세 화면 탭) + `src/data/componentStories.ts` + `pages/Ia.tsx` (`pages/Guide.tsx`는 2026-11-25 폐지) |

---

## 2. Layout 컴포넌트

### 2.1 Layout (관리자형: 사이드바 + 메인) — **채택 (D3 변경, 2026-11-24)**

> D3 변경: 일반 페이지 Layout은 참고 사이트 루트 화면의 셸(Header 로고·메뉴 검색·다크모드 + 왼쪽 메뉴 카드 + 오른쪽 콘텐츠 카드)을 따릅니다. 구조·규칙의 기준은 `design.md` 1.1·1.2입니다. Footer는 콘텐츠 카드 하단에 유지합니다.

- **원본 구조:** `aside.sidebar`(로고, 접기 버튼, ScrollArea 메뉴, 하단 유틸·사용자 영역) + `main`(PageChangePanel, `contentWrapper.layout-{default|twoCol|twoCol2|threeCol}`).
- **SSOT 조건:**
  - 이 프로젝트의 고정 Layout은 `#wrap > #header / main#container / #footer / #modalWrap` (design.md 1.2). 사이드바형을 쓰려면 **`Layout` 구조 변경 승인**이 필요합니다.
  - 채택 시 사이드바는 `components/layout/Sidebar.tsx`로 추가하고 design.md 1.2 표·4.1 폴더 규칙을 갱신합니다.
  - 콘텐츠 분할(`default / twoCol / twoCol2 / threeCol`)은 페이지 단의 CSS 클래스(`#wrap .contentWrapper.twoCol`)로 처리합니다. Tailwind `flex-1` 금지.

### 2.2 Layout 기본형 (Header 고정 + 본문·Footer 스크롤) — **미채택 (D3 변경)**

- **원본 구조:** `root.type2 > header(고정, 전체 너비) + viewport > contents + footer`.
- **SSOT 조건:** design.md 1.2의 기본 Layout과 가장 가깝습니다. 단, design.md는 "Footer `position: fixed` 금지, `#wrap` 세로 Flex로 Footer 최하단"이므로 **Header만 sticky/fixed**, 본문 스크롤은 문서 스크롤을 사용합니다 (내부 스크롤 컨테이너를 쓰면 승인 필요).
- 원본의 `type2` 같은 레이아웃 변형 클래스는 `useLayoutClass`(3.7) 채택 여부와 함께 결정합니다.

### 2.3 콘텐츠 배치 규칙 — **채택 (D13, 2026-11-25)**

> 페이지 콘텐츠는 아래 **배치 요소**를 조합해 만듭니다. 페이지 CSS(`common.css` 05 Pages)는 배치 요소로 표현할 수 없는 페이지 고유 모양에만 씁니다.

#### 2.3.1 배치 요소

| 요소 | 컴포넌트 | 역할 | 간격 Props | 문서 |
| --- | --- | --- | --- | --- |
| 쌓기 | `Stack` | 한 방향(세로·가로)으로 쌓기, 형제 사이 간격 | `gap` | [Stack.md](components/Stack.md) |
| 열 나누기 | `Grid` | 같은 폭 열로 나누기 (모바일 1열 → 반응형) | `gap` | [Grid.md](components/Grid.md) |
| 구역 | `Section` | 제목·설명·버튼 + 콘텐츠 묶음 (배경 없음) | `gap` (머리↔몸통) | [Section.md](components/Section.md) |
| 상자 | `Card` | 배경·그림자가 있는 콘텐츠 상자 | `padding` | [Card.md](components/Card.md) |
| 목록 표 (table-list) | `Table type="list"` | 여러 행 목록, 위쪽 열 머리글 | — | [Table.md](components/Table.md) |
| 상세 표 (table-result) | `Table type="result"` | 한 건의 항목:값, 왼쪽 행 머리글 | — | [Table.md](components/Table.md) |

#### 2.3.2 간격 단계 (모든 배치 요소 공통)

| 값 | 토큰 | 크기 | 쓰는 곳 (권장) |
| --- | --- | --- | --- |
| `sm` | `--gap-sm` (= `--space-2`) | 8px | 라벨·값, 버튼끼리, 카드 안 작은 묶음 |
| `md` (기본) | `--gap-md` (= `--space-4`) | 16px | 폼 필드 사이, 카드 사이, 카드 안쪽 여백 |
| `lg` | `--gap-lg` (= `--space-6`) | 24px | 페이지 안 구역(Section) 사이 |

- Props 이름은 형제 사이 간격 `gap`, 상자 안쪽 여백 `padding`. 값은 `'sm' | 'md' | 'lg'` 셋뿐이며 기본은 `'md'`입니다 (D7·D8: 숫자·인라인 금지).
- 단계 값(8·16·24)을 바꾸면 `common.css`의 `--gap-*` 토큰만 고칩니다 (`design.md` 6장).

#### 2.3.3 조합 규칙

1. **형제 사이 간격은 부모가 정합니다.** 간격은 감싼 `Stack`·`Grid`·`Section`의 `gap`으로 주고, 자식에 `margin`을 주지 않습니다. 공통 컴포넌트 루트는 바깥 `margin: 0`입니다.
2. **기본 중첩 순서:** 페이지 루트 `Section headingLevel={2} gap="lg"`(페이지 제목·설명·버튼) → 구역이 여럿이면 `Stack gap="lg"` + `Section`(h3) → `Grid` 또는 `Stack gap="md"` → `Card` → (카드 안) `Stack gap="sm"`·`Table`. 단계를 건너뛰어도 되지만 거꾸로(Card 안에 Section) 두지 않습니다. 페이지 바깥 여백만 페이지 클래스(예: `.dashboard`)로 줍니다.
3. **열을 나눌 때는 `Grid`**, 한 방향으로만 쌓을 때는 `Stack`을 씁니다. 화면 폭에 따라 가로↔세로가 바뀌는 배치는 `Grid`로 만듭니다.
4. **표 선택:** 여러 건 → `Table type="list"`, 한 건의 상세 → `Table type="result"`. 표는 Card 안에 둘 수 있으며 좁은 화면에서는 표 자체가 가로 스크롤됩니다.
5. **제목 단계:** 페이지 제목 `h2`(루트 Section `headingLevel={2}`) → 구역 `Section` `h3`(기본) → 구역 안 `Card`는 `headingLevel={4}`. 구역 없이 페이지 루트에 바로 놓인 Card는 기본 `h3`.
6. **폭:** 배치 요소는 부모 폭을 꽉 채웁니다. 특정 폭이 필요하면 프리셋 Props를 디자인 원본 기준으로 추가합니다 (`className`·인라인 금지).

> 적용 예: `src/pages/Dashboard.tsx`(Section h2 → Stack → Grid 통계 Card + 목록형 Table), `src/pages/Payout.tsx`(Section h2 → Card 상세형 Table, 모달 폼 Stack)

```tsx
<Section headingLevel={2} title="리포트" description="…" gap="lg">
<Stack gap="lg">
    <Section title="이번 달 요약" action={<Button size="sm">내보내기</Button>}>
        <Grid columns={3}>
            <Card title="방문자" headingLevel={4}>…</Card>
            <Card title="가입" headingLevel={4}>…</Card>
            <Card title="매출" headingLevel={4}>…</Card>
        </Grid>
    </Section>
    <Section title="신청 내용">
        <Card padding="lg">
            <Table type="result" caption="신청 내용" items={items} itemsPerRow={2} />
        </Card>
    </Section>
</Stack>
</Section>
```

---

## 3. Hooks

> AGENTS 5.7: **여러 컴포넌트에서 반복되는 로직만** `src/hooks/useXxx.ts`로 분리합니다. 아래는 후보이며, 실제 사용처가 2곳 이상일 때만 만듭니다.

| 훅 | 원본 시그니처 | SSOT 조건 |
| --- | --- | --- |
| `useRemainingHeight` | `({ gap, useViewport }) → { containerRef, topRef, remainingHeight }` | 결과를 `style={{ height }}`로 쓰므로 **인라인 예외 기록 대상**. CSS Flex(`min-height:0; flex:1`)로 해결 가능하면 훅을 만들지 않습니다. ResizeObserver cleanup 필수 |
| `useNearestScrollableMetrics` | `(ref) → { scrollElement, metrics }` | ScrollSpy·ScrollTop에서 공유할 때만 생성. scroll/resize 리스너 해제 필수 |
| `useScrollSpy` | `(containerRef, sectionIds, { activeLineRatio }) → activeId` | Tabs scrollSpy·페이지 ScrollSpy 2곳 이상이면 생성. 페이지 ScrollSpy가 생기면 그때 훅으로 만듦 |
| `useMediaDevice` | `({ tabletMin=768, desktopMin=1024, forceBreakpoint, syncHtmlTag=true })` | **`syncHtmlTag` 기본값 `true` → `<html>`에 `isMobile` 클래스 주입은 채택하지 않음** (CSS에서 `html` 선택자 금지, AGENTS 5.3). 스타일 분기는 미디어쿼리 우선(design.md 4.1), JS 분기가 꼭 필요할 때만 사용 |
| `useHtmlRootClass` | `(className, { enabled })` | `<html>` 클래스 주입. CSS가 `html.xxx`를 참조하면 AGENTS 5.3 위반이므로 **미채택 권장** |
| `useHtmlTag` | `({ tag, attrs, parent, textContent, enabled })` | head에 `<style>` 주입은 CSS 3파일 규칙(AGENTS 5.3) 우회이므로 **금지**. `<meta>` 용도만 필요 시 승인 |
| `useLayoutClass` | `(className)` — 레이아웃 루트에 클래스 부여 | 대상은 `#wrap`. 레이아웃 변형이 디자인에 있을 때만 생성 (Context 필요 → 승인) |

---

## 4. 페이지 기능 샘플

| 기능 | 원본 | SSOT 조건 |
| --- | --- | --- |
| ScrollSpy 네비 | 스크롤 이벤트 + 기준선, 버튼으로 섹션 이동(`offsetTop: 88`) | 메뉴는 `<button>` 또는 `<a href="#id">`, 활성 항목 `on` 클래스 + `aria-current="location"`. offset은 `--header-height` 토큰 기반. `scrollElementIntoViewInContainer`는 `utils/`에 순수 함수로 |
| Scroll Top Button | 임계값 `180px` 이상 노출 / 위로 스크롤 시만 노출 / Footer 위까지만 고정(`bottom: footerHeight + 12`) | 임계값은 `constants/`에 `SCROLL_TOP_THRESHOLD`. 노출은 클래스 토글(`on`). Footer 회피 `bottom`은 런타임 값 → **인라인 예외 기록**. 버튼에 `aria-label="맨 위로"`, 아이콘은 디자인 에셋 |
| SVG 색상 변경 | ① `?react` SVG 컴포넌트 ② `mask-image` + `backgroundColor` ③ SCSS mixin | ① `vite-plugin-svgr` **사전 승인됨**(D4) — `?react` import + `currentColor` ② `common.css`에 아이콘별 `mask-image` 클래스 + `background-color: currentColor` (인라인 없이) ③ SCSS 금지 → 일반 CSS 클래스로 대체. ①·② 모두 허용 (AGENTS 5.4) |

---

## 5. 컴포넌트 (45종) — 컴포넌트별 문서

> **메뉴 분류 (2026-11-25):** 명세 화면 왼쪽 메뉴는 **배치 컴포넌트**(Card·Grid·Section·Stack·Table, 2.3) / **Atom 컴포넌트**(그 밖의 구현된 컴포넌트와 내부 유틸 Portal) / **미구현 명세**(아직 코드가 없는 문서, 2026-11-25 기준 PageChangePanel 1종 — 관리·미리보기 도구라 보류)로 나눕니다. 분류의 기준은 `src/data/componentStories.ts`의 `category`이며, 구현된 컴포넌트 화면에는 문서(이 SSOT) · 샘플 · Playground · API 탭이 붙습니다.
> 컴포넌트마다 **`docs/components/{컴포넌트명}.md`** 한 파일에 정의합니다. 이 표는 목차입니다. 컴포넌트 조건을 바꾸면 해당 파일만 수정하고, 이름·파일·판정이 바뀌면 이 표도 함께 갱신합니다.
> 각 파일 구성: 요약표(파일·스토리 id·원본 variant·외부 의존·판정) → 정의(원본 옵션, Props, 마크업·클래스, 접근성, 9.2 검수 포인트).

| # | 원본 컴포넌트 | 문서 | 스토리 id | 원본 variant·size | 외부 의존 | 판정 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Accordion | [Accordion.md](components/Accordion.md) | `accordion` | single/multiple | Radix → 직접 구현 | **구현됨(일부, 2026-11-25)** |
| 2 | AlertDialog | [Modal.md](components/Modal.md) | — | — | Radix | **Modal에 통합** (중복) |
| 3 | Button | [Button.md](components/Button.md) | `button` | variant 4 · color 4 · size 3 · shape 2 | — | **구현됨(일부, 2026-11-24)** |
| 4 | Card | [Card.md](components/Card.md) | `card` | size md/sm · padding sm/md/lg | — | **구현됨(일부, 2026-11-25 확장)** |
| 5 | Chart | [Chart.md](components/Chart.md) | `chart` | line/area/bar/pie/radar | recharts (설치됨) | **구현됨(2026-11-25)** |
| 6 | Checkbox | [Checkbox.md](components/Checkbox.md) | `checkbox` | default/spec/btn | Radix → 직접 구현 | **구현됨(일부, 2026-11-24)** |
| 7 | Chip | [Chip.md](components/Chip.md) | `chip` | tint/solid/stateYes/stateNo/iconData × 6색 | — | **구현됨(일부, 2026-11-24)** |
| 8 | Collapsible | [Collapsible.md](components/Collapsible.md) | `collapsible` | — | Radix → 직접 구현 | **구현됨(일부, 2026-11-25)** |
| 9 | DatePicker | [DatePicker.md](components/DatePicker.md) | `datePicker` | default/btnType | react-day-picker, date-fns (설치됨) | **구현됨(2026-11-25)** |
| 10 | Icon | [Icon.md](components/Icon.md) | `icon` | sm/md/lg | — | **구현됨(2026-11-25)** |
| 11 | Input | [Input.md](components/Input.md) | `input` | default/search/searchBtn | — | **구현됨(일부, 2026-11-24)** |
| 12 | InputStepper | [InputStepper.md](components/InputStepper.md) | `inputStepper` | plusMinus/chevron · number/date | date-fns (날짜) | **구현됨(2026-11-25)** |
| 13 | Loading | [Loading.md](components/Loading.md) | `loading` | fullscreen/area | — | **구현됨(일부, 2026-11-25)** |
| 14 | Modal | [Modal.md](components/Modal.md) | `modal` | alert/small/medium/large/full | Radix → 직접 구현 | **구현됨(일부, 2026-11-25)** |
| 15 | PageChangePanel | [PageChangePanel.md](components/PageChangePanel.md) | — | — | — | 관리·미리보기 도구 → 보류 |
| 16 | Pagination | [Pagination.md](components/Pagination.md) | `pagination` | — | — | **구현됨(일부, 2026-11-25)** |
| 17 | Popover | [Popover.md](components/Popover.md) | `popover` | size sm/md/lg · placement 12 | Radix → 직접 구현 | **구현됨(일부, 2026-11-25)** |
| 18 | Portal | [Portal.md](components/Portal.md) | `portal` | — | — | **구현됨(일부, 2026-11-25)** |
| 19 | Radio | [Radio.md](components/Radio.md) | `radio` (D10) | — | Radix → 직접 구현 | **구현됨(일부, 2026-11-25)** |
| 20 | ScrollArea | [ScrollArea.md](components/ScrollArea.md) | `scrollArea` | vertical/horizontal/both | Radix → CSS 대체 | **구현됨(2026-11-25)** |
| 21 | Select | [Select.md](components/Select.md) | `select` | default/btnType · default/sm · multiple | Radix → 직접 구현 | **구현됨(일부, 2026-11-25)** |
| 22 | Skeleton | [Skeleton.md](components/Skeleton.md) | `skeleton` | default/muted · shape 프리셋 | — | **구현됨(일부, 2026-11-25)** |
| 23 | Slider (범위) → RangeSlider | [RangeSlider.md](components/RangeSlider.md) | `rangeSlider` | sm/md/lg · range · vertical | Radix → native range | **구현됨(일부, 2026-11-25)** |
| 24 | SortableList | [SortableList.md](components/SortableList.md) | `sortableList` | — | @dnd-kit (설치됨) | **구현됨(2026-11-25)** |
| 25 | Swiper | [Slider.md](components/Slider.md) | `slider` | 디자인 기준 | swiper (설치됨) | **구현됨(2026-11-25)** |
| 26 | Switch | [Switch.md](components/Switch.md) | `switch` | default/sm | Radix → 직접 구현 | **구현됨(일부, 2026-11-25)** |
| 27 | Table | [Table.md](components/Table.md) | `table` | list(vertical)/result(horizontal) · default/sub | — | **구현됨(일부, 2026-11-25 확장)** |
| 28 | Tabs | [Tabs.md](components/Tabs.md) | `tabs` | default/btn · default/sm · default/line · 가로/세로 | Radix → 직접 구현 | **구현됨(일부, 2026-11-25)** |
| 29 | Textarea | [Textarea.md](components/Textarea.md) | `textarea` | — | — | **구현됨(일부, 2026-11-25)** |
| 30 | TextList | [TextList.md](components/TextList.md) | `textList` | dot/decimal/circled/star/square · sm/md/lg | — | **구현됨(2026-11-25)** |
| 31 | Toast | [Toast.md](components/Toast.md) | `toast` | default/success/info/warning/error · position 6 | sonner 대신 직접 구현 (`providers/ToastProvider.tsx`) | **구현됨(일부, 2026-11-25)** |
| 32 | Tooltip | [Tooltip.md](components/Tooltip.md) | `tooltip` | default/light/dark/error/success · sm/md/lg | Radix → 직접 구현 | **구현됨(일부, 2026-11-25)** |
| 33 | TreeView | [TreeView.md](components/TreeView.md) | `treeView` | — | 드래그 @dnd-kit (설치됨) | **구현됨(2026-11-25)** |
| 34 | Alert (shadcn/ui) | [Alert.md](components/Alert.md) | `alert` | default/error | 직접 구현 | **구현됨(2026-11-25)** |
| 35 | Avatar (shadcn/ui) | [Avatar.md](components/Avatar.md) | `avatar` | sm/md/lg | 직접 구현 | **구현됨(2026-11-25)** |
| 36 | Breadcrumb (shadcn/ui) | [Breadcrumb.md](components/Breadcrumb.md) | `breadcrumb` | — | 직접 구현 | **구현됨(2026-11-25)** |
| 37 | Dropdown Menu (shadcn/ui) | [DropdownMenu.md](components/DropdownMenu.md) | `dropdownMenu` | align start/end | Radix → 직접 구현 | **구현됨(2026-11-25)** |
| 38 | Empty (shadcn/ui) → EmptyState | [EmptyState.md](components/EmptyState.md) | `emptyState` | — | 직접 구현 | **구현됨(2026-11-25)** |
| 39 | Kbd (shadcn/ui) | [Kbd.md](components/Kbd.md) | `kbd` | — | 직접 구현 | **구현됨(2026-11-25)** |
| 40 | Progress (shadcn/ui) | [Progress.md](components/Progress.md) | `progress` | — | Radix → native progress | **구현됨(2026-11-25)** |
| 41 | Separator (shadcn/ui) | [Separator.md](components/Separator.md) | `separator` | horizontal/vertical | Radix → 직접 구현 | **구현됨(2026-11-25)** |
| 42 | Toggle Group (shadcn/ui) | [ToggleGroup.md](components/ToggleGroup.md) | `toggleGroup` | md/sm | Radix → 직접 구현 | **구현됨(2026-11-25)** |
| 43 | Stack (배치, 2.3) | [Stack.md](components/Stack.md) | `stack` | column/row · gap sm/md/lg | 직접 구현 | **구현됨(2026-11-25)** |
| 44 | Grid (배치, 2.3) | [Grid.md](components/Grid.md) | `grid` | columns 1~4 · gap sm/md/lg | 직접 구현 | **구현됨(2026-11-25)** |
| 45 | Section (배치, 2.3) | [Section.md](components/Section.md) | `section` | gap sm/md/lg · headingLevel 2~4 | 직접 구현 | **구현됨(2026-11-25)** |

> 스토리 id는 컴포넌트 파일명의 camelCase입니다 (`button`, `datePicker`, `treeView` …, check-project 검사 기준).
> shadcn/ui 대응 (2026-11-25): Badge → Chip, Dialog·Alert Dialog → Modal, Sonner → Toast, Spinner → Loading, Slider → RangeSlider, Native Select → Select, Label → Input·Select 등 폼 컴포넌트 안. 외부 라이브러리가 필요한 Calendar·Date Picker·Chart·Carousel(사전 승인 라이브러리, node_modules 사용 — 2026-11-25 후속 요청으로 DatePicker·Chart·Slider 구현)과 Command·Combobox·Context Menu·Menubar·Navigation Menu·Hover Card·Sheet·Drawer·Input OTP·Resizable·Sidebar·Data Table·Scroll Area·Aspect Ratio 등은 이번 범위에서 제외 (design.md 10장).
> 통합(D6): AlertDialog → [Modal.md](components/Modal.md), CollapsibleGroup → [Accordion.md](components/Accordion.md), SelectSimple·SelectMultiple → [Select.md](components/Select.md).

---

## 6. IA 목록 페이지 (출처 `ialist`) 대응

- 원본 IA 표: `페이지 / 경로 / 이동 / 날짜 / 상태(완료·작업중)`.
- 이 프로젝트 IA는 **`ia-spec.md`가 기준**이며 상태 키 `Undone(0) / Done(1) / Modify(2) / Delete(3)` 고정, 기존 IA 디자인·문구 변경 금지(AGENTS 6.2). 원본 IA 화면 구조는 참고만 하고 **가져오지 않습니다**.
- 원본 사이드 메뉴 그룹(기본설정 / layout / 페이지 기능 / hooks / components)은 이 프로젝트 일반 페이지 왼쪽 메뉴(`navData.ts`: 기본설정·Layout·페이지 기능·Hooks·배치/Atom/미구현 컴포넌트)에 대응합니다. 스토리에는 **공통 컴포넌트만** 등록합니다(페이지 금지).

---

## 7. 결정 기록 (2026-11-24 확정)

| # | 항목 | 결정 | 반영 문서 |
| --- | --- | --- | --- |
| D1 | 컬러·폰트 토큰 | 참고 가이드 값으로 **교체** | `design.md` 6장 |
| D2 | Wide 브레이크포인트 | **`1440px` 추가** (768 / 1024 / 1440) | `AGENTS.md` 5.3, `design.md` 6.1·8.4, `requirements.md` 5장 |
| D3 | 공통 레이아웃 | ~~기본형만~~ → **참고 사이트 셸로 변경** (Header 로고·메뉴 검색·다크모드 + 왼쪽 메뉴 카드 + 콘텐츠 카드, Footer는 콘텐츠 카드 하단) | 이 문서 2장, `design.md` 1.1·1.2 |
| D4 | 외부 라이브러리 | **recharts, react-day-picker·date-fns, @dnd-kit, vite-plugin-svgr 사전 승인** (구현할 때만 설치) | `AGENTS.md` 2장·5.4·9.3 |
| D5 | 범위 슬라이더 이름 | **`RangeSlider`** (캐러셀은 `Slider` 유지) | `design.md` 2장 |
| D6 | 중복 컴포넌트 | **전부 통합**: AlertDialog→Modal, CollapsibleGroup→Accordion, SelectSimple·SelectMultiple→Select | `AGENTS.md` 5.1.1 |
| D7 | size 값 이름 | **`default` 대신 크기 이름** (`lg`/`md`/`sm`) | `AGENTS.md` 5.1.1, `design.md` 2장 |
| D8 | 크기 지정 방식 | **프리셋 Props + CSS 클래스** (인라인 금지) | `AGENTS.md` 5.1.1 |
| D9 | Context Provider 위치 | **`src/providers/` 폴더 추가** | `AGENTS.md` 4장·4.1, `design.md` 1.3·4장 |
| D10 | Radio 스토리 id (구 Guide 섹션 id) | **`radio`** | 스토리 (`guide-spec.md`는 폐지) |
| D11 | Boolean 접두어 | **`should` 추가** | `AGENTS.md` 5.2 |
| D12 | 문서 경로 | **스펙 문서를 `docs/`로 이동** | 파일 이동 |
| D13 | 콘텐츠 배치 (2026-11-25) | **배치 요소 Stack·Grid·Section·Card·Table(list/result) 조합**, 간격은 `gap`/`padding` = `sm`(8)·`md`(16, 기본)·`lg`(24) 프리셋, 형제 간격은 부모가 정함(자식 margin 금지) | 이 문서 2.3, `AGENTS.md` 5.1.1, `design.md` 2장·6장 |

**남은 미결정**

- 반응형 scaling 방식 채택 여부 → `requirements.md` 7장
- 프리셋 값(Skeleton shape, ScrollArea 높이, Table 열 폭 등)의 실제 수치 → 디자인 원본 확정 후 `design.md`

> 다음 절차: 디자인 원본(`requirements.md` 6장)이 정해지면 화면 분석으로 실제 사용 컴포넌트를 골라 `design.md` 2장 표(상태 `제안` → `승인`)에 옮기고, `tasks.md` Phase 3에 컴포넌트별 작업을 등록합니다. 그 이후에도 이 문서는 컴포넌트 Props·변환 조건의 기준으로 유지합니다 (`AGENTS.md` 7장).

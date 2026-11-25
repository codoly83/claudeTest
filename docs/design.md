# 설계 (Design)

> 이 문서는 **어떻게 만드는지** 정의하는 설계 문서입니다.
> 기능 요구사항은 `docs/requirements.md`, AI 개발 및 코딩 규칙은 `AGENTS.md`를 따릅니다.
> **현재 작업 범위:** React + TypeScript 기반 퍼블리싱 전용
> 마지막 수정: 2026-11-24

---

## 1. 화면 구조

### 1.1 전체 화면 구조

```text
App
├── /Ia (독립 관리 페이지)
└── Layout (일반 페이지) <div id="wrap" data-theme="light|dark">
    ├── Header <header id="header">      로고 · 메뉴 검색 · 다크모드 스위치
    ├── <div class="layoutBody">
    │   ├── SideMenu <aside class="sideMenu">   왼쪽 메뉴 카드 (src/data/navData.ts)
    │   └── <div class="contentArea">            오른쪽 콘텐츠 카드
    │       ├── Main <main id="container">
    │       │   ├── Home (/)              페이지 목록 표 (src/data/iaData.ts)
    │       │   ├── Spec (/spec/:slug)    명세 문서 보기 (docs/*.md), 컴포넌트는 문서·샘플·Playground·API 탭
    │       │   ├── Dashboard (/dashboard) 대시보드 샘플 (Button·Card·Chip·Table)
    │       │   └── {프로젝트별 페이지}
    │       └── Footer <footer id="footer">
    └── <div id="modalWrap"> (Modal Portal 대상)
└── MemberLayout (회원 화면) <div id="wrap" class="pageLayout memberLayout">
    ├── Header <header id="header">      로고 · 다크모드 스위치 (메뉴 검색 없음)
    ├── Main <main id="container">       콘텐츠 가운데 정렬
    │   └── Signup (/signup)          회원가입 (Card·Input·Checkbox·Button)
    ├── Footer <footer id="footer">
    └── <div id="modalWrap">
```

> 일반 페이지 셸은 참고 사이트 <https://codoly83.github.io/publishTemplate> 의 화면 구성(상단 Header + 왼쪽 메뉴 카드 + 오른쪽 콘텐츠 카드)을 따릅니다. (2026-11-24, D3 변경)

> 실제 페이지·컴포넌트는 `requirements.md`에서 확정한 것만 생성합니다.

### 1.1.1 IA 독립 페이지 · 컴포넌트 명세 화면 설계

> 2026-11-25: 별도 Guide 화면(`/Guide`)은 메인 컴포넌트 목록·명세 화면과 내용이 겹쳐 폐지했습니다.

- `/Ia`는 **공통 Layout, Header, Footer를 적용하지 않는 독립 관리 페이지**이며 `src/pages/Ia.tsx`에서 관리합니다.
- `/Ia`의 화면 목록에는 **메인(`/`) 항목을 반드시 포함**하며, 항상 목록 최상단에 둡니다.
- 공통 컴포넌트 설명은 일반 Layout 안의 **명세 화면**(`/spec/{컴포넌트}`)에서 합니다: 문서(`docs/components/*.md`) · 샘플 · Playground · API 탭. 내용은 `src/data/componentStories.ts`.
- 일반 페이지를 추가하면 IA 화면 목록을 갱신하고, 공통 컴포넌트를 추가하거나 Props·사용법을 변경하면 스토리와 메인 컴포넌트 카드를 갱신합니다.
- 실제 경로와 IA 링크는 일치해야 합니다. 옛 `/Guide` 주소는 메인(`/`)으로 보냅니다(`<Navigate replace>`, IA·검사 대상 아님).

**라우팅 구조**

```tsx
<Routes>
    <Route path="/Ia" element={<Ia />} />
    <Route element={<Layout><Outlet /></Layout>}>
        {/* 일반 페이지 */}
    </Route>
</Routes>
```

### 1.2 기본 레이아웃 설계

| 컴포넌트 | HTML 태그 | ID | 역할 |
| --- | --- | --- | --- |
| `Layout` | `<div>` | `wrap` | 일반 페이지 루트 (CSS 범위 기준) |
| `Header` | `<header>` | `header` | 공통 상단 영역: 로고(홈 링크), 메뉴 검색, 다크모드 스위치 |
| `Layout`의 본문 영역 | `<div class="layoutBody">` | - | 왼쪽 메뉴 카드와 오른쪽 콘텐츠 카드를 담는 영역 |
| `SideMenu` | `<aside class="sideMenu">` | - | 왼쪽 메뉴 카드 (`src/data/navData.ts` 그룹·링크) |
| `Layout`의 콘텐츠 카드 | `<div class="contentArea">` | - | 오른쪽 콘텐츠 카드 (`main` + `Footer`) |
| `Layout`의 콘텐츠 영역 | `<main>` | `container` | 페이지 콘텐츠 영역 |
| `Footer` | `<footer>` | `footer` | 콘텐츠 카드 하단 영역 |
| `Layout`의 오버레이 영역 | `<div>` | `modalWrap` | Modal 등 Portal 대상 (`AGENTS.md` 5.1.1) |

**기본 레이아웃 규칙**

- **일반 페이지에만** 공통 `Layout`을 적용합니다. `/Ia`는 예외입니다.
- `Layout`은 `<div id="wrap">`을 루트로 하고, 그 안에 `Header`, `.layoutBody`(`SideMenu` + `.contentArea`), `<div id="modalWrap">`을 순서대로 배치합니다. `.contentArea` 안에 `<main id="container">`와 `Footer`를 둡니다.
- `Header`는 `<header id="header">`, `Footer`는 `<footer id="footer">`를 루트 요소로 사용합니다.
- 다크모드는 `#wrap`의 `data-theme="dark"` 속성으로 전환하고, 색상은 `#wrap[data-theme="dark"]` 토큰만 바꿉니다 (6장). 선택값은 `localStorage`(`ui-theme`)에 저장합니다.
- 메뉴 검색은 `navData.ts`의 메뉴명·그룹명을 찾아 결과 목록(WAI-ARIA Combobox 패턴)을 보여 주고, 선택하면 해당 페이지로 이동합니다.
- 왼쪽 메뉴의 현재 페이지 링크는 `on` 클래스 + `aria-current="page"`입니다. 새 페이지를 만들면 같은 작업에서 IA(`iaData.ts`)와 메뉴(`navData.ts`)에 등록합니다.
- 왼쪽 메뉴 맨 위에는 `페이지 목록`(`/`) 링크를 고정하고, 그 아래 그룹은 `src/data/specData.ts`의 명세 메뉴(기본설정·Layout·페이지 기능·Hooks·컴포넌트·SSOT 문서)에서 만듭니다. `navData.ts`는 명세 메뉴와 일반 페이지 메뉴를 합칩니다.
- 명세 문서는 Vite `?raw` import로 `docs/` 마크다운을 읽어 `src/utils/renderMarkdown.tsx`(직접 구현, 외부 라이브러리 없음)로 그립니다. 문서를 고치면 화면에 바로 반영되며, 화면용 문구를 따로 만들지 않습니다(SSOT).
- 메뉴 검색은 메뉴명·그룹명과 명세 본문을 함께 찾고, 결과에 그룹명과 본문 일부를 보여 줍니다.
- 페이지를 옮기면 콘텐츠 카드 스크롤을 맨 위로 되돌립니다.

**회원 레이아웃 (`MemberLayout`)**

- 회원가입·로그인처럼 왼쪽 메뉴가 필요 없는 화면에 씁니다. 구조: `#wrap.pageLayout.memberLayout > Header(hasSearch=false) / main#container / Footer / #modalWrap`.
- Header·Footer·다크모드는 일반 Layout과 같은 컴포넌트·같은 저장값(`useTheme`)을 씁니다.
- `main`은 콘텐츠를 가운데 정렬하고, Footer는 콘텐츠가 짧아도 화면 아래에 있습니다.
- 페이지 컴포넌트는 `<main>` 내부에 렌더링하며, 중첩된 `<main>`을 만들지 않습니다.
- 한 화면에서 동일한 ID를 중복 사용하지 않습니다.
- 공통 레이아웃 CSS는 `src/assets/css/common.css`에서 관리하며, `Layout.tsx`에서 import합니다.

**Layout 구현** — `src/components/layout/Layout.tsx` (실제 코드가 기준)

**공통 레이아웃 높이**

- `#wrap`은 화면 전체(`position: fixed; inset: 0`)를 차지합니다. CSS에서 `body` 선택자를 쓸 수 없어 브라우저 기본 `body` 여백의 영향을 받지 않도록 한 방식입니다.
- 모바일(768px 미만): Header → 메뉴 카드 → 콘텐츠 카드를 세로로 쌓고 `#wrap` 안에서 스크롤합니다.
- 768px 이상: Header는 고정, 메뉴 카드(폭 240px)와 콘텐츠 카드가 가로로 나란히 놓이며 각 카드 안에서 따로 스크롤합니다.
- Footer는 콘텐츠 카드 안 `main` 아래에 있으며, 콘텐츠가 짧아도 카드 하단에 위치합니다. `position: fixed`·`absolute`를 쓰지 않습니다.
- IA 관리 페이지는 독립 레이아웃이므로 해당 규칙에서 제외합니다.

### 1.3 폴더 구조

```text
src/
├── main.tsx
├── App.tsx
├── pages/                 # 페이지 (파일 단위)
│   ├── Home.tsx           # / 페이지 목록 + 컴포넌트 목록
│   ├── Spec.tsx           # /spec/:slug 명세 보기
│   ├── Dashboard.tsx      # /dashboard 샘플
│   ├── Signup.tsx         # /signup 샘플 (회원 레이아웃)
│   └── Ia.tsx
├── components/
│   ├── common/            # 여러 화면에서 쓰는 UI (파일 단위, 2장 표 · 스토리와 1:1)
│   │   ├── Button.tsx
│   │   └── …              # Accordion ~ TreeView 43개 (배치: Stack·Grid·Section·Card, Portal은 내부 유틸)
│   └── layout/            # 공통 레이아웃
│       ├── Layout.tsx
│       ├── Header.tsx
│       ├── SideMenu.tsx
│       ├── MemberLayout.tsx   # 회원 화면 레이아웃 (왼쪽 메뉴 없음)
│       └── Footer.tsx
├── hooks/                 # useTheme.ts(다크모드), useScrollLock.ts(Modal·Loading), useToast.ts(Toast Context)
├── providers/             # ToastProvider.tsx (Layout·MemberLayout)
├── types/
├── constants/
├── data/                  # iaData.ts(IA 목록), navData.ts(왼쪽 메뉴), specData.ts(명세 메뉴·문서), 목업
│   ├── componentCatalog.ts # 컴포넌트 분류표 (왼쪽 메뉴용, 가벼운 목록)
│   ├── componentStories.ts # 컴포넌트 스토리 목록 (명세 화면 탭, 동적 import)
│   ├── storiesLayout.tsx  # 배치 컴포넌트 스토리 (API·샘플·Playground)
│   ├── storiesAtom.tsx    # Atom 컴포넌트·내부 유틸 스토리
│   └── storiesAtomPlus.tsx # Atom 9종 (Chart·DatePicker·Icon·InputStepper·ScrollArea·Slider·SortableList·TextList·TreeView)
├── utils/                 # renderMarkdown.tsx(명세 마크다운), classNames.ts(클래스 합치기·camelCase 변환)
└── assets/
    ├── css/
    │   ├── common.css   # 일반 페이지
    │   └── ia.css       # IA 독립 화면
    ├── images/
    ├── icons/           # iconSearch·iconCheck + Lucide 도형 12종 (LICENSE-lucide.txt)
    └── fonts/
```

> 루트의 `scripts/check-project.mjs`는 `AGENTS.md` 9.1 정적 검사 스크립트입니다.

**폴더 설계 원칙**

- 페이지는 `src/pages/`, 컴포넌트는 `src/components/`에서 관리합니다.
- 컴포넌트·페이지마다 폴더를 만들지 않고 파일 하나로 둡니다.
- 여러 화면에서 사용하는 UI는 `components/common/`, 공통 레이아웃은 `components/layout/`에 배치합니다.
- 한 페이지에서만 사용하는 UI는 별도 컴포넌트 폴더를 만들지 않고 해당 페이지 파일 안에 작성합니다. (`AGENTS.md` 5.1)
- 공통 React 로직은 `hooks/`에서 관리합니다.
- 일반 데이터 가공 함수는 `utils/`에서 관리합니다.
- 일반 페이지 CSS는 `assets/css/common.css`, IA는 `assets/css/ia.css`로 분리합니다.
- IA는 필수 관리 화면이므로 관련 페이지·CSS 파일 및 라우트를 초기 구성에 포함합니다. 그 외 불필요한 파일은 미리 생성하지 않습니다.

## 2. 컴포넌트 명세

> 이 표는 `AGENTS.md` 6.4절 **2단계(화면 분석)**의 결과를 기록하는 공통 컴포넌트 목록입니다.
> 디자인 원본(`requirements.md` 6장) 전체를 보고 작성하며, 사용자 승인 후 `상태`를 `승인`으로 바꾸고 `docs/tasks.md`에 작업을 등록합니다.

| 컴포넌트 | 위치 (`src/` 기준) | 사용 페이지 | variant·size | Props | 상태 | 설명 |
|---|---|---|---|---|---|---|
| `Layout` | `components/layout/Layout.tsx` | 일반 페이지 전체 | - | `children` | 고정 | `#wrap` 안에 Header, main, Footer, `#modalWrap`을 조합하는 공통 레이아웃 |
| `Header` | `components/layout/Header.tsx` | 일반 페이지 전체 | - | - | 고정 | `<header id="header">`, 로고, 메뉴, 스크롤에 따른 스타일 변경 |
| `Footer` | `components/layout/Footer.tsx` | 일반 페이지 전체 | - | - | 고정 | `<footer id="footer">` 공통 하단 영역 |
| `Button` | `components/common/Button.tsx` | Dashboard (+ 이후 페이지) | size `lg`·`md`·`sm` / shape `default`·`square` (variant·color는 필요 시 추가) | `size`, `shape`, `disabled`, `children`, `onClick` 등 button 속성 | 승인 | 공통 버튼 (`docs/components/Button.md`) |
| `Card` | `components/common/Card.tsx` | Dashboard, Payout, Home | size `md`·`sm` · padding `sm`·`md`·`lg` | `title`, `description`, `size`, `padding`, `headingLevel`, `action`, `footer`, `children` | 승인 | 제목·액션·본문·하단 상자 (`docs/components/Card.md`, 배치 규칙 `component-ssot.md` 2.3) |
| `Stack` | `components/common/Stack.tsx` | Home 컴포넌트 목록, 명세 화면 (+ 페이지 배치) | direction `column`·`row` · gap `sm`·`md`·`lg` | `direction`, `gap`, `align`, `justify`, `isWrap`, `children` | 승인 | 한 방향 쌓기 (`docs/components/Stack.md`, 2026-11-25) |
| `Grid` | `components/common/Grid.tsx` | Home 컴포넌트 목록, 명세 화면 (+ 페이지 배치) | columns `1`~`4` · gap `sm`·`md`·`lg` | `columns`, `gap`, `children` | 승인 | 반응형 열 나누기 (`docs/components/Grid.md`, 2026-11-25) |
| `Section` | `components/common/Section.tsx` | Home 컴포넌트 목록, 명세 화면 (+ 페이지 배치) | gap `sm`·`md`·`lg` · headingLevel `2`~`4` | `title`, `description`, `action`, `headingLevel`, `gap`, `children` | 승인 | 제목 + 콘텐츠 구역 (`docs/components/Section.md`, 2026-11-25) |
| `Chip` | `components/common/Chip.tsx` | Home, Dashboard | color `green`·`blue`·`yellow`·`red`·`purple`·`gray` (solid) | `label`, `color` | 승인 | 상태·수치 표시 (`docs/components/Chip.md`) |
| `Input` | `components/common/Input.tsx` | Signup (+ 로그인 등 회원 화면) | - | `label`, `value`, `onChange`, `type`, `helpText`, `hasError`, `errorMessage`, input 속성 | 승인 | 라벨·안내·오류 연결 입력창 (`docs/components/Input.md`) |
| `Checkbox` | `components/common/Checkbox.tsx` | Signup (+ 로그인 등 회원 화면) | - | `checked`, `onChange`, `label`, `name`, `disabled`, `hasError`, `errorMessage` | 승인 | 실제 input 기반 체크박스 (`docs/components/Checkbox.md`) |
| `Table` | `components/common/Table.tsx` | Home, Dashboard | type `list`(목록, 기본)·`result`(상세) · result itemsPerRow `1`·`2` | list: `caption`, `columns`, `rows`, `getRowKey` / result: `caption`, `items`, `itemsPerRow` | 승인 | 배열 Props 표 (`docs/components/Table.md`) |
| `Accordion` | `components/common/Accordion.tsx` | Home 컴포넌트 목록, 명세 화면 | isMultiple · isCollapsible | `items`, `isMultiple`, `isCollapsible`, `defaultOpenIds` | 승인 | 접고 펼치는 목록 (`docs/components/Accordion.md`, shadcn/ui 참고 2026-11-25) |
| `Alert` | `components/common/Alert.tsx` | Home 컴포넌트 목록, 명세 화면 | variant `default`·`error` | `title`, `variant`, `children` | 승인 | 안내 박스 (`docs/components/Alert.md`, shadcn/ui 참고 2026-11-25) |
| `Avatar` | `components/common/Avatar.tsx` | Home 컴포넌트 목록, 명세 화면 | size `sm`·`md`·`lg` | `name`, `src`, `size` | 승인 | 이미지·머리글자 (`docs/components/Avatar.md`, shadcn/ui 참고 2026-11-25) |
| `Breadcrumb` | `components/common/Breadcrumb.tsx` | Home 컴포넌트 목록, 명세 화면 | - | `items` | 승인 | 현재 위치 경로 (`docs/components/Breadcrumb.md`, shadcn/ui 참고 2026-11-25) |
| `Collapsible` | `components/common/Collapsible.tsx` | Home 컴포넌트 목록, 명세 화면 | - | `title`, `isOpen`, `defaultOpen`, `onChange`, `disabled`, `children` | 승인 | 단일 접기/펼치기 (`docs/components/Collapsible.md`, shadcn/ui 참고 2026-11-25) |
| `DropdownMenu` | `components/common/DropdownMenu.tsx` | Home 컴포넌트 목록, 명세 화면 | align `start`·`end` | `label`, `items`, `align` | 승인 | 메뉴 버튼 (`docs/components/DropdownMenu.md`, shadcn/ui 참고 2026-11-25) |
| `EmptyState` | `components/common/EmptyState.tsx` | Home 컴포넌트 목록, 명세 화면 | - | `title`, `description`, `action` | 승인 | 빈 상태 안내 (`docs/components/EmptyState.md`, shadcn/ui 참고 2026-11-25) |
| `Kbd` | `components/common/Kbd.tsx` | Home 컴포넌트 목록, 명세 화면 | - | `label` | 승인 | 키보드 키 (`docs/components/Kbd.md`, shadcn/ui 참고 2026-11-25) |
| `Loading` | `components/common/Loading.tsx` | Home 컴포넌트 목록, 명세 화면 | 전체 화면 · 영역 | `isLoading`, `label`, `isFullscreen`, `children` | 승인 | 로딩 표시 (`docs/components/Loading.md`, shadcn/ui 참고 2026-11-25) |
| `Modal` | `components/common/Modal.tsx` | Home 컴포넌트 목록, 명세 화면 | size `alert`·`small`·`medium`·`large`·`full` | `isOpen`, `onClose`, `size`, `title`, `footer`, `children` | 승인 | 대화 상자 (Alert Dialog 통합) (`docs/components/Modal.md`, shadcn/ui 참고 2026-11-25) |
| `Pagination` | `components/common/Pagination.tsx` | Home 컴포넌트 목록, 명세 화면 | - | `total`, `current`, `onChange`, `max`, `hasEllipsis`, `getHref` | 승인 | 페이지 이동 (`docs/components/Pagination.md`, shadcn/ui 참고 2026-11-25) |
| `Popover` | `components/common/Popover.tsx` | Home 컴포넌트 목록, 명세 화면 | size `sm`·`md`·`lg` · placement 12 | `trigger`, `title`, `placement`, `size`, `children` | 승인 | 트리거 옆 패널 (`docs/components/Popover.md`, shadcn/ui 참고 2026-11-25) |
| `Portal` | `components/common/Portal.tsx` | Modal·Toast·Loading 내부 | - | `children` | 승인 | `#modalWrap` Portal 내부 유틸 (명세 메뉴 Atom, 스토리 internal) (`docs/components/Portal.md`, shadcn/ui 참고 2026-11-25) |
| `Progress` | `components/common/Progress.tsx` | Home 컴포넌트 목록, 명세 화면 | - | `value`, `label`, `max`, `hasValueText` | 승인 | 진행률 (네이티브 progress) (`docs/components/Progress.md`, shadcn/ui 참고 2026-11-25) |
| `Radio` | `components/common/Radio.tsx` | Home 컴포넌트 목록, 명세 화면 | - | `options`, `value`, `onChange`, `legend`, `name`, `hasError`, `errorMessage` | 승인 | 라디오 그룹 (`docs/components/Radio.md`, shadcn/ui 참고 2026-11-25) |
| `RangeSlider` | `components/common/RangeSlider.tsx` | Home 컴포넌트 목록, 명세 화면 | size `sm`·`md`·`lg` · 단일/범위 | `value`, `onChange`, `label`, `min`, `max`, `step`, `minGap`, `size`, `disabled` | 승인 | 범위 선택 (인라인 예외 6.2) (`docs/components/RangeSlider.md`, shadcn/ui 참고 2026-11-25) |
| `Select` | `components/common/Select.tsx` | Home 컴포넌트 목록, 명세 화면 | size `md`·`sm` | `options`, `value`, `onChange`, `label`, `placeholder`, `size`, `disabled`, `hasError`, `errorMessage` | 승인 | 네이티브 select 단일 선택 (`docs/components/Select.md`, shadcn/ui 참고 2026-11-25) |
| `Separator` | `components/common/Separator.tsx` | Home 컴포넌트 목록, 명세 화면 | orientation `horizontal`·`vertical` | `orientation`, `isDecorative` | 승인 | 구분선 (`docs/components/Separator.md`, shadcn/ui 참고 2026-11-25) |
| `Skeleton` | `components/common/Skeleton.tsx` | Home 컴포넌트 목록, 명세 화면 | variant `default`·`muted` · shape 5 | `variant`, `shape` | 승인 | 로딩 자리 표시 (`docs/components/Skeleton.md`, shadcn/ui 참고 2026-11-25) |
| `Switch` | `components/common/Switch.tsx` | Header(다크모드), Home 컴포넌트 목록, 명세 화면 | size `md`·`sm` | `checked`, `onChange`, `label`, `onLabel`, `offLabel`, `size`, `disabled` | 승인 | 켜기/끄기 (`docs/components/Switch.md`, shadcn/ui 참고 2026-11-25) |
| `Tabs` | `components/common/Tabs.tsx` | Home 컴포넌트 목록, 명세 화면 | appearance `default`·`line` | `items`, `label`, `appearance`, `activeIndex`, `onChange` | 승인 | WAI-ARIA 탭 (`docs/components/Tabs.md`, shadcn/ui 참고 2026-11-25) |
| `Textarea` | `components/common/Textarea.tsx` | Home 컴포넌트 목록, 명세 화면 | - | `value`, `onChange`, `label`, `rows`, `maxLength`, `hasCounter`, `helpText`, `footer`, `hasError`, `errorMessage` | 승인 | 여러 줄 입력 (`docs/components/Textarea.md`, shadcn/ui 참고 2026-11-25) |
| `Toast` | `components/common/Toast.tsx` | Home 컴포넌트 목록, 명세 화면 (Provider: Layout·MemberLayout) | type 5 · position 6 | `useToast().showToast(message, { type, position, duration })` | 승인 | 알림 (ToastProvider·useToast) (`docs/components/Toast.md`, shadcn/ui 참고 2026-11-25) |
| `ToggleGroup` | `components/common/ToggleGroup.tsx` | Home 컴포넌트 목록, 명세 화면 | size `md`·`sm` | `options`, `value`, `onChange`, `label`, `size` | 승인 | 단일 선택 버튼 묶음 (`docs/components/ToggleGroup.md`, shadcn/ui 참고 2026-11-25) |
| `Tooltip` | `components/common/Tooltip.tsx` | Home 컴포넌트 목록, 명세 화면 | placement 4 | `content`, `placement`, `hasArrow`, `children` | 승인 | hover·focus 설명 (`docs/components/Tooltip.md`, shadcn/ui 참고 2026-11-25) |
| `Slider` | `components/common/Slider.tsx` | Home·명세 화면 | options(navigation·pagination·autoplay·loop·breakpoints) | `items`, `renderItem`, `label`, `options` | 승인 | Swiper 캐러셀, autoplay 시 정지 버튼 (`docs/components/Slider.md`, 2026-11-25) |
| `Chart` | `components/common/Chart.tsx` | Home·명세 화면 | type line·area·bar·pie·radar · size sm·md·lg | `type`, `data`, `xKey`, `series`, `title`, `size`, `hasLegend` | 승인 | recharts 차트 + 대체 표 (`docs/components/Chart.md`, 2026-11-25) |
| `DatePicker` | `components/common/DatePicker.tsx` | Home·명세 화면 | mode single·range · variant default·btnType | `mode`, `value`, `onChange`, `label`, `variant`, `placeholder`, `format`, `minDate`, `maxDate`, `disabledDates`, `hasReset`, `disabled`, `hasError`, `errorMessage` | 승인 | react-day-picker 날짜·기간 선택 (`docs/components/DatePicker.md`, 2026-11-25) |
| `Icon` | `components/common/Icon.tsx` | InputStepper·TreeView 등 내부, Home·명세 화면 | size sm·md·lg | `name`, `size`, `label` | 승인 | CSS mask 아이콘 25종 (`docs/components/Icon.md`, 2026-11-25) |
| `InputStepper` | `components/common/InputStepper.tsx` | Home·명세 화면 | mode number·date · variant plusMinus·chevron | `value`, `onChange`, `label`, `mode`, `variant`, `min`, `max`, `step`, `disabled`, `readOnly`, `hasError`, `errorMessage` | 승인 | 숫자·날짜 증감 입력 (`docs/components/InputStepper.md`, 2026-11-25) |
| `ScrollArea` | `components/common/ScrollArea.tsx` | Home·명세 화면 | orientation 3 · size sm·md·lg | `label`, `orientation`, `size`, `children` | 승인 | 키보드 스크롤 영역 (size 값 임시) (`docs/components/ScrollArea.md`, 2026-11-25) |
| `SortableList` | `components/common/SortableList.tsx` | Home·명세 화면 | - | `items`, `onChange`, `renderItem`, `getItemLabel`, `label` | 승인 | @dnd-kit 순서 바꾸기 + 위로·아래로 버튼 (`docs/components/SortableList.md`, 2026-11-25) |
| `TextList` | `components/common/TextList.tsx` | Home·명세 화면 | type 5 · size sm·md·lg | `items`, `type`, `size`, `start` | 승인 | 글머리 목록 (`docs/components/TextList.md`, 2026-11-25) |
| `TreeView` | `components/common/TreeView.tsx` | Home·명세 화면 | 체크 모드 · 드래그 | `nodes`, `label`, `defaultOpenIds`, `checkedIds`, `onCheckedChange`, `isCascade`, `isDraggable`, `onChange`, `renderLabel` | 승인 | WAI-ARIA 트리 (인라인 예외 6.2) (`docs/components/TreeView.md`, 2026-11-25) |
| `ServiceCard` | `pages/Home.tsx` 내부 | Home | - | `service: Service` | 예시 | 아이콘, 제목, 설명 (Home 전용) |
| `ContactForm` | `pages/Home.tsx` 내부 | Home | - | `onSubmit` | 예시 | 입력 폼 및 유효성 검사 (Home 전용) |

> 컴포넌트별 Props·마크업·접근성 조건은 `docs/components/{컴포넌트명}.md`를 따릅니다 (목차: `docs/component-ssot.md` 5장). 화면 분석에서 사용이 확인된 컴포넌트만 이 표에 옮깁니다. 이름 기준: 캐러셀(Swiper)=`Slider`, 범위 선택=`RangeSlider`.
> `상태`: `고정`(초기 구성 필수) / `제안`(화면 분석 후 승인 대기) / `승인`(구현 대상) / `예시`(설계 예시, 실제 프로젝트에서 교체).
> **사용 페이지가 2곳 이상**이어야 `components/common/`에 둡니다. 1곳뿐인 UI는 해당 페이지 파일 안에 작성합니다.
> 디자인 원본에 없는 컴포넌트·variant는 기록하지 않습니다. 한 페이지 전용 UI가 2곳 이상에서 쓰이게 되면 이 표를 갱신하고 `components/common/`으로 분리합니다.

### 2.1 컴포넌트 설계 원칙

- React 함수형 컴포넌트를 사용합니다.
- 컴포넌트는 `const` + 화살표 함수로 선언합니다.
- Props는 TypeScript `interface`로 정의합니다.
- 공통 컴포넌트가 존재하면 새로 만들지 않고 재사용합니다.
- 화면 UI와 데이터 처리 로직은 역할에 따라 분리합니다.
- 불필요하게 컴포넌트를 세분화하지 않습니다.
- 컴포넌트 작성 규칙은 `AGENTS.md` 5.1절을 따릅니다.

## 3. 데이터 타입

> 실제 공용 타입은 `src/types/`에 정의합니다. 아래 코드는 설계 참고용입니다.

```ts
type PartyRole = '계약자' | '피보험자' | '종피보험자';

interface NavItem {
    label: string;
    href: string;
}

interface Service {
    id: string;
    title: string;
    description: string;
    icon: string;
}

interface ContactFormData {
    name: string;
    email: string;
    message: string;
}

interface SlideItem {
    id: string;
    title: string;
    image?: string;
    link?: string;
}
```

### 3.1 타입 관리 원칙

- 여러 컴포넌트에서 공유하는 타입은 `src/types/`에 정의합니다.
- 특정 컴포넌트에서만 사용하는 Props 타입은 해당 컴포넌트 파일에 정의합니다.
- API 및 목업 데이터에는 명확한 타입을 사용합니다.
- TypeScript의 `any` 타입은 사용하지 않습니다.
- 동일한 타입을 여러 파일에 중복 선언하지 않습니다.

## 4. 상태 관리

| 상태 | 위치 | 방식 | 설명 |
|---|---|---|---|
| 다크모드 여부 | `hooks/useTheme.ts` (Layout·MemberLayout) | `useState` + `localStorage`(`ui-theme`) | `#wrap[data-theme]` 전환, `Header`에 Props로 전달 |
| 회원가입 입력값·오류·약관 동의·완료 여부 | `Signup` | `useState` | 전체 동의는 개별 동의에서 도출, 제출 후에는 입력할 때마다 다시 검사 |
| 메뉴 검색어·결과 열림·활성 결과 | `Header` 내부 `MenuSearch` | `useState` | 결과 목록은 검색어에서 도출 |
| 폼 입력값 | `ContactForm` | `useState` | 입력값 관리 및 초기화 |
| 슬라이드 활성 인덱스 | 슬라이드 컴포넌트 | Swiper API / 필요 시 `useState` | 현재 슬라이드 상태 |
| 브라우저 화면 너비 | `useWindowSize` | 커스텀 훅 | JavaScript에서 화면 너비가 필요한 경우 |
| 여러 컴포넌트 공유 상태 | 가장 가까운 공통 부모 | `useState` / Props | 필요한 범위에서 공유 |
| 전역 상태 | 필요 시 Context | `useContext` | 여러 페이지에서 공유할 때만 |
| Toast 목록 | `providers/ToastProvider.tsx` | Context(`hooks/useToast.ts`) + `useToast` | `Layout`·`MemberLayout`에서 1회 감싸고 `#modalWrap`에 렌더링 |
| Modal 열림 | 연 쪽 부모 컴포넌트 | `useState` | `Modal`은 `isOpen`·`onClose`로만 제어 |
| Tabs·Accordion·Collapsible·Popover·DropdownMenu·Tooltip 열림/선택 | 각 컴포넌트 내부 | `useState` | 외부 제어가 필요할 때만 `activeIndex`·`isOpen` Props |

### 4.1 상태 관리 원칙

- 상태는 해당 상태를 사용하는 **가장 가까운 공통 부모**에서 관리합니다.
- 컴포넌트 내부에서만 사용하는 상태는 해당 컴포넌트에서 관리합니다.
- 단순한 상태는 `useState`를 우선 사용합니다.
- 전역 상태는 반드시 필요한 경우에만 도입합니다.
- 동일한 상태를 중복 관리하지 않습니다.
- 계산 가능한 값은 기존 상태에서 도출합니다.
- Swiper 내부에서 관리할 수 있는 슬라이드 상태는 별도로 중복 관리하지 않습니다.
- 화면 크기에 따른 스타일 변경은 CSS 미디어쿼리를 우선 사용합니다.

## 5. 인터랙션

| 대상 | 동작 | 결과 |
|---|---|---|
| 왼쪽 메뉴 링크 | 클릭 | 해당 페이지로 이동, 현재 페이지 링크 `on` |
| 메뉴 검색 | 입력 | 메뉴명·그룹명이 일치하는 결과 목록 표시 (없으면 "검색 결과가 없습니다.") |
| 메뉴 검색 결과 | ↑·↓ / Enter / ESC / 클릭 | 활성 결과 이동 / 이동 / 목록 닫기 / 이동 |
| 다크모드 스위치 | 클릭·Space·Enter | 라이트↔다크 전환, 선택값 저장 |
| 문의 폼 | 제출 | 유효성 검사 후 목업 성공 메시지 표시 |
| 슬라이드 | 터치 / 드래그 | Swiper를 통한 슬라이드 이동 |
| 슬라이드 네비게이션 | 이전 / 다음 버튼 클릭 | 슬라이드 이동 |
| 슬라이드 페이지네이션 | 페이지 표시 클릭 | 해당 슬라이드 이동 |

### 5.1 인터랙션 설계 원칙

- 사용자의 클릭, 입력, 스크롤 등 필요한 이벤트만 구현합니다.
- React 이벤트 핸들러를 사용합니다.
- 이벤트 핸들러 이름은 `handle` 접두어를 사용합니다.
- 이벤트 리스너를 직접 등록한 경우 컴포넌트 정리 시 해제합니다.
- React 상태로 처리할 수 있는 UI는 불필요한 DOM 직접 조작을 피합니다.
- 슬라이드 인터랙션은 Swiper API를 우선 사용합니다.
- 실제 API가 연결되지 않은 기능은 퍼블리싱용 목업 동작으로 구현합니다.
- 디버깅용 `console.log`를 남기지 않습니다.

## 6. 디자인 토큰

> 실제 디자인 토큰은 `src/assets/css/common.css`의 **`#wrap`** 안에 CSS 변수로 정의합니다.
> 일반 페이지 루트에 선언하므로 `/Ia`에는 영향을 주지 않습니다.

> 색상·폰트 값은 참고 가이드(Publish Template `_color.css`) 기준입니다 (2026-11-24 결정, `docs/component-ssot.md` 1.2·1.3). 간격·모서리·그림자·레이아웃 값은 디자인 원본 확정 전 예시입니다.

```css
#wrap {
    /* 색상 - 기본 */
    --color-primary: #00997a;
    --color-text: #1f2533;
    --color-text-muted: #7a8599;
    --color-text-disabled: #aab2bd;
    --color-text-inverse: #fff;
    /* 색상 - 배경 */
    --color-bg: #fff;
    --color-bg-container: #ebf0f5;
    --color-bg-subtle: #f5f8fa;
    --color-bg-row: #fff;
    /* 색상 - 선 */
    --color-border: #ebf0f5;
    --color-border-strong: #dde4eb;
    --color-line-accent: #0aada3;     /* Header 하단 선 */
    --color-bg-layout: #ebf0f5;       /* 메뉴·콘텐츠 카드 바깥 배경 */
    /* 색상 - 버튼 */
    --color-btn-black: #1f2533;
    --color-btn-gray: #b8c2cc;
    /* 색상 - 상태 */
    --color-blue: #2b7bd6;
    --color-red: #e73434;
    --color-purple: #a63ac0;
    --color-yellow: #ad7f23;
    --color-green-50: #e6faf3;
    --color-blue-50: #ebf5ff;
    --color-red-50: #ffebeb;
    --color-purple-50: #faebff;
    --color-yellow-50: #faf7e6;
    --color-gray-50: #f0f6fa;
    /* 폰트 */
    --font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    --font-size-2xs: 10px;
    --font-size-xs: 12px;
    --font-size-sm: 14px;
    --font-size-md: 16px;
    --font-size-lg: 18px;
    --font-size-xl: 20px;
    --font-size-2xl: 24px;
    --font-size-3xl: 28px;
    --font-weight-regular: 400;
    --font-weight-medium: 500;
    --font-weight-bold: 700;
    /* 간격 */
    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-4: 1rem;
    --space-6: 1.5rem;
    --space-8: 2rem;
    --space-12: 3rem;
    /* 배치 간격 단계 — Stack·Grid·Section gap, Card padding (component-ssot.md 2.3) */
    --gap-sm: var(--space-2);    /* 8px */
    --gap-md: var(--space-4);    /* 16px, 기본 */
    --gap-lg: var(--space-6);    /* 24px */
    /* 모서리 및 그림자 */
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 16px;
    --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
    --gradient-primary: linear-gradient(90deg, #0aada3 0%, #04bc90 100%);   /* 기본 버튼 */
    --color-on-primary: #fff;   /* 강조 배경(버튼·Chip·표 머리) 위 글자 */
    /* 레이아웃 */
    --container-max: 1200px;
    --header-height: 61px;
    --side-menu-width: 240px;

    --color-dim: rgba(0, 0, 0, 0.5);   /* 모달·전체 로딩 딤 (다크: 0.7) */
    --z-dropdown: 100;                 /* 드롭다운·팝오버·툴팁 */
    --z-modal: 1000;
    --z-toast: 1100;
    --z-loading: 1200;
}

/* 다크모드: 참고 사이트 .dark 값. 색상 토큰만 바꾸고 나머지는 상속 */
#wrap[data-theme="dark"] {
    color-scheme: dark;
    --color-primary: #04bc90;
    --color-text: #fff;
    --color-text-muted: #8d9199;
    --color-text-disabled: #5e6166;
    --color-text-inverse: #17181a;
    --color-bg: #17181a;
    --color-bg-container: #000;
    --color-bg-subtle: #222426;
    --color-bg-row: #222426;
    --color-border: #2d2f33;
    --color-border-strong: #363940;
    --color-bg-layout: #2d2f33;
    --color-btn-black: #fff;
    --color-btn-gray: #767980;
    --color-blue: #3794ff;
    --color-red: #fa4646;
    --color-purple: #c348e0;
    --color-yellow: #d7a645;
    --color-green-50: #253d35;
    --color-blue-50: #28364c;
    --color-red-50: #472b2b;
    --color-purple-50: #422b47;
    --color-yellow-50: #403e32;
    --color-gray-50: #363a40;
}
```

### 6.1 스타일 관리 원칙

- 일반 페이지 CSS는 `common.css`, IA 전용 CSS는 `ia.css`에서 관리합니다. (`guide.css`는 2026-11-25 폐지)
- 선택자 범위: `common.css`는 `#wrap`, `ia.css`는 `#iaWrap` 아래로 한정합니다.
- `common.css` 안에서도 **요소 리셋**(배경, 제목·문단·목록 여백 제거)은 `#wrap.pageLayout`(Layout·MemberLayout 루트 공통), **화면 레이아웃**은 `#wrap.siteLayout`(일반 Layout)·`#wrap.memberLayout`(회원 레이아웃)에만 적용하고, **토큰·공통 컴포넌트**는 `#wrap` 아래에 둡니다.
- 공통 컴포넌트 CSS는 리셋에 기대지 않고 자기 요소의 여백·글꼴을 직접 지정합니다 (명세 화면 샘플에서도 같은 모양).
- `common.css`를 `main.tsx`에서 전역 import하지 않고 `Layout.tsx`에서만 import합니다.
- React에서 CSS import는 자동 격리를 의미하지 않으므로, 라우트별 로딩만 믿지 않고 전역 선택자·reset의 영향도 확인합니다.
- CSS Modules, SCSS, styled-components 등을 사용하지 않습니다.
- 공통 디자인 값은 CSS 변수로 관리합니다.
- 기존 CSS 클래스명과 마크업 구조를 최대한 유지합니다.
- 반응형은 모바일 우선으로 구현합니다.
- 기본 브레이크포인트는 `768px`(Tablet), `1024px`(Desktop), `1440px`(Wide)입니다.
- Swiper 기본 CSS는 공식 패키지 import를 허용합니다.
- Swiper의 추가 스타일 및 커스터마이징은 `common.css`에 작성합니다.

### 6.2 인라인 스타일 사용 목록

> 인라인 스타일은 `AGENTS.md` 5.3.1절의 예외(런타임 동적 값)에만 사용합니다.
> 사용하면 코드에 `[inline-style]` 주석을 달고 이 표에 한 줄을 추가합니다. 제거하면 행도 삭제합니다.

| 파일 | 요소 (클래스/ID) | 속성 | 이유 | 날짜 |
|---|---|---|---|---|
| `src/components/common/RangeSlider.tsx` | `.rangeSlider` | `--range-start`, `--range-end` | 채워진 트랙 위치: 현재 값에서 계산되는 동적 값 | 2026-11-25 |
| `src/components/common/TreeView.tsx` | `.treeItem` | `transform`, `transition` | 드래그 중 위치: @dnd-kit이 포인터 위치로 계산하는 동적 값 | 2026-11-25 |
| `src/components/common/SortableList.tsx` | `.sortableItem` | `transform`, `transition` | 드래그 중 위치: @dnd-kit이 포인터 위치로 계산하는 동적 값 | 2026-11-25 |

## 7. API / 데이터 소스

| 용도 | 현재 (퍼블리싱) | 추후 (개발) |
|---|---|---|
| 서비스 목록 | `src/data/services.ts` 목업 | `GET /api/services` |
| 문의 제출 | 로컬 유효성 검사 및 목업 완료 처리 | `POST /api/contact` |
| 슬라이드 목록 | `src/data/` 목업 데이터 | 필요 시 API 연동 |

### 7.1 데이터 관리 원칙

- 현재 단계에서는 실제 API 연동을 구현하지 않습니다.
- 퍼블리싱에 필요한 데이터는 목업 데이터로 구성합니다.
- 반복되는 UI 데이터는 배열로 관리합니다.
- 여러 화면에서 공유하는 목업 데이터는 `src/data/`에 배치합니다.
- 데이터 타입을 명시합니다.
- 실제 API 연동은 개발 단계 전환 후 진행합니다.

### 7.2 환경 변수

환경 변수는 `.env` 파일에 `VITE_` 접두사를 붙여 관리합니다.

```env
VITE_API_URL=https://example.com/api
```

- 실제 비밀키나 인증 정보는 클라이언트 환경 변수에 저장하지 않습니다.
- 현재 퍼블리싱 단계에서는 불필요한 환경 변수를 추가하지 않습니다.

## 8. 슬라이드 컴포넌트 설계 (Swiper)

### 8.1 기본 구조

```text
Home (pages/Home.tsx)
└── Hero 영역
    └── Slider (components/common/Slider.tsx)
        ├── Swiper
        │   ├── SwiperSlide × N
        │   └── ...
        ├── Navigation (선택)
        └── Pagination (선택)
```

### 8.2 설계 원칙

- 슬라이드가 필요한 영역은 Swiper 라이브러리를 사용합니다.
- 공통 슬라이드는 `src/components/common/Slider.tsx`에서 관리합니다.
- 여러 화면에서 공통으로 사용하는 슬라이드 UI는 재사용 가능한 컴포넌트로 구현합니다.
- 화면별 슬라이드 데이터 및 옵션은 해당 화면의 요구사항에 맞게 정의합니다.
- 슬라이드 이동 및 활성 인덱스 관리가 별도로 필요한 경우 커스텀 훅으로 분리할 수 있습니다.
- 불필요한 커스텀 훅은 생성하지 않습니다.
- PC 및 모바일 환경에 맞는 반응형 슬라이드를 구현합니다.
- 슬라이드 이동 기능을 별도 JavaScript로 직접 구현하지 않습니다.

### 8.3 슬라이드 옵션 설계

| 옵션 | Swiper 속성 | 적용 기준 |
|---|---|---|
| 화면에 표시할 슬라이드 수 | `slidesPerView` | 화면 디자인에 따라 설정 |
| 슬라이드 간격 | `spaceBetween` | 디자인에 따라 설정 |
| 반응형 | `breakpoints` | PC / 태블릿 / 모바일 |
| 자동 재생 | `autoplay` | 요구사항에 있을 때만 |
| 반복 재생 | `loop` | 요구사항에 있을 때만 |
| 페이지네이션 | `pagination` | 디자인에 있을 때만 |
| 이전 / 다음 버튼 | `navigation` | 디자인에 있을 때만 |
| 전환 속도 | `speed` | 요구사항에 따라 설정 |

### 8.4 반응형 설계

- 기본 슬라이드 옵션은 모바일 환경을 기준으로 정의합니다.
- 태블릿 및 PC에서는 Swiper `breakpoints` 옵션을 사용합니다.
- 기본 기준은 `768px`, `1024px`, `1440px`입니다.
- 실제 표시 개수와 간격은 화면별 디자인에 따라 결정합니다.
- CSS로 처리할 수 있는 레이아웃은 CSS를 우선 사용합니다.

### 8.5 슬라이드 데이터 구조

```ts
interface SlideItem {
    id: string;
    title: string;
    image?: string;
    link?: string;
}
```

- 슬라이드 목록은 배열로 관리합니다.
- 각 슬라이드는 고유한 `id`를 가집니다.
- 실제 필요한 속성만 추가합니다.
- 공용 타입으로 사용하는 경우 `src/types/`에 정의합니다.

### 8.6 스타일 설계

- Swiper 기본 스타일은 공식 CSS import를 사용합니다.
- 추가 슬라이드 스타일은 `src/assets/css/common.css`에 작성합니다.
- 일반 페이지별 CSS 파일은 만들지 않습니다. `ia.css`만 별도 관리 페이지의 예외로 허용합니다.
- Swiper 클래스에 스타일을 적용할 때는 가능한 한 상위 컴포넌트 클래스로 범위를 제한합니다.
- 기존 Swiper 기능을 방해하는 CSS를 작성하지 않습니다.

## 9. 커스텀 훅 설계

### 9.1 기본 원칙

- 여러 컴포넌트에서 반복되는 React 상태 및 이벤트 로직을 재사용할 때 커스텀 훅을 사용합니다.
- 커스텀 훅은 `src/hooks/`에서 관리합니다.
- 이름은 `useXxx.ts` 형식으로 작성합니다.
- 단순 데이터 변환 및 계산은 `src/utils/`에서 관리합니다.
- 하나의 컴포넌트에서만 사용하는 간단한 상태는 해당 컴포넌트 내부에서 관리합니다.
- 커스텀 훅은 필요한 경우에만 생성합니다.

### 9.2 커스텀 훅 설계 예시

| 훅 | 목적 | 사용 대상 |
|---|---|---|
| `useWindowSize` | 브라우저 화면 크기 추적 | 화면 크기에 따른 JavaScript 처리 |
| `useOutsideClick` | 외부 영역 클릭 감지 | 메뉴, 팝업 등 |
| `useScroll` | 스크롤 위치 및 상태 관리 | Header 등 |
| `useSlider` | Swiper 관련 공통 상태 로직 | 여러 슬라이드에서 별도 로직이 필요한 경우 |
| `useTheme` (구현됨) | 다크모드 상태·`localStorage` 저장 | Layout, MemberLayout |
| `useScrollLock` (구현됨) | 배경 스크롤 잠금·복원 (AGENTS 5.1.1) | Modal, Loading(전체 화면) |
| `useToast` (구현됨) | Toast 띄우기 (`ToastContext`) | Home·Payout·명세 화면 등 Toast를 쓰는 화면 |

> 위 목록은 설계 예시입니다. 실제로 필요한 훅만 구현합니다.

### 9.3 hooks와 utils 구분

| 구분 | hooks | utils |
|---|---|---|
| 위치 | `src/hooks/` | `src/utils/` |
| 목적 | React 로직 재사용 | 일반 함수 재사용 |
| 상태 관리 | React Hooks 사용 가능 | React Hooks 사용 안 함 |
| 사용 예시 | `useWindowSize()` | `formatDate()` |

## 10. 결정 기록 (ADR)

> 중요한 기술 결정과 그 이유를 기록합니다.
> 코딩 규칙의 공식 원본은 `AGENTS.md`이며, 이 표에는 설계 결정의 배경만 기록합니다.

| 날짜 | 결정 | 이유 |
|---|---|---|
| 2026-11-13 | 일반 페이지 CSS 단일 파일 사용 | 일반 페이지 스타일 관리 일관성 유지 |
| 2026-11-13 | CSS Modules 사용하지 않음 | `AGENTS.md`의 CSS 정책 준수 |
| 2026-11-13 | 상태 관리 라이브러리 미사용 | 현재 퍼블리싱 규모에서는 React 내장 기능으로 충분 |
| 2026-11-13 | Swiper 라이브러리 사용 | 슬라이드 기능의 일관성 및 유지보수 |
| 2026-11-13 | 공통 React 로직은 커스텀 훅으로 분리 | 중복 코드 감소 및 재사용성 확보 |
| 2026-11-13 | 공통 레이아웃 시맨틱 태그 및 ID 고정 | Header, main, Footer 구조와 선택자 일관성 확보 |
| 2026-11-16 | IA·Guide 전용 CSS 분리 | 관리 페이지와 일반 페이지 스타일 간섭 방지 |
| 2026-11-16 | IA에 Guide 필수 등록 | 공통 컴포넌트 가이드 접근 경로 보장 |
| 2026-11-23 | 퍼블리싱 폴더(`pub/`) 폐지, 컴포넌트·페이지 파일 단위 관리 | 구조 단순화. 2026-11-13 "퍼블리싱 폴더 분리" 결정을 대체 |
| 2026-11-24 | 공통 컴포넌트 설계 규칙 추가 (`AGENTS.md` 5.1.1) | 컴포넌트마다 Props·상태·접근성 구현이 달라지는 것 방지 |
| 2026-11-24 | 일반 페이지 루트 ID `#siteWrap` → `#wrap` | IA 미리보기가 iframe 안의 `#wrap`을 찾아 축소하므로(`ia-spec.md`), IA 코드 수정 없이 미리보기 연동 |
| 2026-11-24 | Modal Portal 대상을 `#wrap` 내부 `#modalWrap`으로 지정 | `body`로 Portal하면 `#wrap` 범위 CSS가 적용되지 않음. Tooltip·드롭다운은 Portal 없이 기준 요소 옆에 렌더링 |
| 2026-11-24 | 공통 컴포넌트 `className` Props 미허용 | 페이지별 CSS 덮어쓰기 우회 방지 (`AGENTS.md` 6.4) |
| 2026-11-24 | 디자인 툴 비고정, "디자인 원본"은 `requirements.md` 6장에서 지정 | 툴(Figma 등)이 프로젝트마다 달라질 수 있음 |
| 2026-11-24 | 작업 순서에 "화면 분석" 단계 추가 (`AGENTS.md` 6.4) | 디자인은 페이지 단위로 오지만 작업은 컴포넌트부터 하므로, 공통 컴포넌트 목록을 먼저 확정 |
| 2026-11-24 | 검수를 자동 검사·`/Guide` 수동 검수로 분리 (`AGENTS.md` 9장) | 규칙 위반은 기계로 잡고, AI가 확인할 수 없는 브라우저 동작은 사람이 확인 |
| 2026-11-24 | 참고 가이드(Publish Template) 컴포넌트를 `docs/component-ssot.md`로 변환 정의 | 컴포넌트별 Props·접근성 기준을 미리 확정 |
| 2026-11-24 | 색상·폰트 토큰을 참고 가이드 값으로 교체 (D1) | 기준 시안 색 체계 사용 |
| 2026-11-24 | Wide 브레이크포인트 `1440px` 추가 (D2) | 넓은 화면 대응 |
| 2026-11-24 | 공통 레이아웃은 기본형(Header·main·Footer)만 사용 (D3) | 사이드바형 관리자 레이아웃 미채택 |
| 2026-11-24 | recharts, react-day-picker·date-fns, @dnd-kit, vite-plugin-svgr 사전 승인 (D4) | 차트·달력·드래그 정렬·SVG 색상 변경을 직접 구현하지 않음 |
| 2026-11-24 | 범위 선택 컴포넌트 이름 `RangeSlider` (D5) | 캐러셀 `Slider`와 이름 충돌 방지 |
| 2026-11-24 | AlertDialog→Modal, CollapsibleGroup→Accordion, SelectSimple·SelectMultiple→Select 통합 (D6) | 같은 기능 컴포넌트 중복 금지 |
| 2026-11-24 | size 값에 `'default'` 대신 크기 이름 사용 (D7) | 값만 보고 크기를 알 수 있게 |
| 2026-11-24 | 컴포넌트 크기는 프리셋 Props + CSS 클래스로 지정 (D8) | `className`·고정값 인라인 금지 규칙과 일치 |
| 2026-11-24 | `src/providers/` 폴더 추가 (D9) | Toast 등 Context Provider 위치 확정 |
| 2026-11-24 | Radio Guide 섹션 id `radio` (D10) | 파일명과 일치 |
| 2026-11-24 | Boolean 변수 접두어 `should` 허용 (D11) | 참고 가이드 약속어와 통일 |
| 2026-11-24 | 스펙 문서를 `docs/`로 이동 (D12) | `AGENTS.md`·`CLAUDE.md`의 경로와 일치 |
| 2026-11-25 | `/Guide`·`/Ia` 관리 화면은 데스크톱 전용으로 유지 (모바일 레이아웃 추가 안 함). 반응형 기준(360~1440px)은 일반 페이지에만 적용 | 사용자 결정. 원본 명세(guide-spec·ia-spec)의 고정폭 디자인 유지 |
| 2026-11-25 | 디자인 원본 없이 진행: `tasks.md` Phase 2(화면 분석) 건너뜀. 공통 컴포넌트 목록(2장)은 레퍼런스와 사용자 요청 기준으로 승인 | 사용자 결정 ("디자인이 없으니 넘어가줘"). 시안이 생기면 Phase 2 재수행 |
| 2026-11-25 | shadcn/ui(<https://ui.shadcn.com>)를 참고해 공통 컴포넌트 24종(Accordion·Alert·Avatar·Breadcrumb·Collapsible·DropdownMenu·EmptyState·Kbd·Loading·Modal·Pagination·Popover·Portal·Progress·Radio·RangeSlider·Select·Separator·Skeleton·Switch·Tabs·Textarea·Toast·ToggleGroup·Tooltip) 추가, 메인(`/`)에 컴포넌트 목록(실제 동작 미리보기 + Guide 링크) 추가. 라이브러리 설치 없이 직접 구현하고 아이콘은 Lucide 도형을 `src/assets/icons` SVG로 보관(ISC, `LICENSE-lucide.txt`). Header 다크모드 스위치를 Switch로 교체 | 사용자 요청 ("shadcn/ui 참고, 없는 컴포넌트 추가, 메인에 목록, 모든 자산은 프로젝트 내부 — node_modules 금지"). Calendar·Date Picker·Chart·Carousel은 사전 승인 라이브러리가 필요해 제외, Sheet·Command 등은 범위 밖으로 보류 |
| 2026-11-25 | **`/Guide` 폐지**: `Guide.tsx`·`guide.css`·`docs/guide-spec.md` 삭제. 컴포넌트 설명·9.2 수동 검수는 명세 화면(`/spec/{컴포넌트}`) 탭, 메인 카드 링크도 명세 화면으로. IA 최상단 필수 항목은 메인(`/`). CSS는 `common.css`·`ia.css` 2개 | 사용자 요청 ("Guide는 메인 내용 반복이라 삭제"). 이전 "IA에 Guide 필수 등록"(2026-11-16)·"Guide 예제 영역 #wrap.guideScope"(2026-11-24) 결정을 대체 |
| 2026-11-25 | 빌드 파일 나누기: 페이지를 `React.lazy`로 지연 로딩(App.tsx, 로딩 중에는 Layout 유지·콘텐츠 자리에 Loading), 왼쪽 메뉴는 가벼운 분류표(`componentCatalog.ts`)만 읽고 스토리는 명세 화면에서 동적 import, `vite.config.ts`에 라이브러리별 파일 묶음(vendorReact·vendorChart·vendorChartDeps·vendorSwiper·vendorDate·vendorDnd) 추가 | 사용자 요청. 단일 1,310kB 파일 → 500kB 경고 해소, 대시보드 첫 화면 JS 401kB. `vite.config.ts`는 이 목적의 최소 수정 (AGENTS 9.3) |
| 2026-11-25 | 미구현 명세 9종 구현: Chart(recharts)·DatePicker(react-day-picker·date-fns, range 통합)·Slider(swiper)·SortableList·TreeView 드래그(@dnd-kit) — 사전 승인 라이브러리 설치. Icon·InputStepper·ScrollArea·TextList는 직접 구현. 아이콘 11종 추가(Lucide). Tabs 패널 `min-width: 0`(캐러셀 폭 넘침 수정). PageChangePanel은 관리 도구라 보류 | 사용자 요청 ("미구현 명세도 정상적으로", "라이브러리 설치해서 전부"). 이전 "node_modules 금지"는 shadcn 참고 작업 범위였고, 이번에 사용자가 설치를 선택 |
| 2026-11-25 | 컴포넌트 스토리(`src/data/componentStories.ts`) 도입: Guide 섹션 내용(Props·샘플·코드)을 스토리 파일로 옮겨 Guide와 명세 화면 탭(문서·샘플·Playground·API)이 함께 사용. 왼쪽 메뉴 컴포넌트를 배치·Atom·미구현 명세로 분리. 스토리 파일은 Fast Refresh 경고 규칙 제외(`.oxlintrc.json` overrides) | 사용자 요청 ("atom·배치 구분 메뉴, 명세 페이지에 탭으로 샘플, 스토리북처럼 API"). 같은 예제를 두 곳에 두지 않기 위해 공용 파일로 이동(사용자 선택) |
| 2026-11-25 | 콘텐츠 배치 규칙(D13): 배치 컴포넌트 Stack·Grid·Section 추가, Card에 `description`·`footer`·`padding`·`headingLevel`, Table에 `type="result"`(상세형, 왼쪽 머리글) 추가. 간격은 `gap`/`padding` = `sm`·`md`·`lg`(8·16·24px) 프리셋과 `--gap-*` 토큰 | 사용자 요청 ("배치 관련 컴포넌트·SSOT 규칙, card·grid·table-list·table-result, 간격 sm/md/lg"). 페이지마다 간격·열 CSS를 새로 만들지 않게 |
| 2026-11-24 | **D3 변경**: 일반 페이지 Layout을 참고 사이트 셸(Header 로고·메뉴 검색·다크모드 + 왼쪽 메뉴 카드 + 오른쪽 콘텐츠 카드, Footer는 콘텐츠 카드 하단)로 구성. 메뉴는 `navData.ts` | 사용자 요청 ("publishTemplate처럼") |
| 2026-11-24 | 회원 레이아웃 `MemberLayout`, 공통 컴포넌트 Input·Checkbox(+Guide), `/signup` 회원가입 샘플 추가. 다크모드 상태를 `useTheme` 훅으로 분리(두 레이아웃 공유), 리셋 범위를 `#wrap.pageLayout`으로 변경 | 사용자 요청 (구현된 컴포넌트로 새 페이지·레이아웃 구성) |
| 2026-11-24 | 공통 컴포넌트 Button·Card·Chip·Table 구현(일부 옵션) + Guide 섹션, `/dashboard` 샘플 추가. Home 표·상태를 Table·Chip으로 교체 | 사용자 요청 (선언된 컴포넌트로 대시보드 샘플). 2곳 이상 사용(Home·Dashboard) 충족 |
| 2026-11-24 | `common.css`를 `#wrap.siteLayout`(레이아웃·리셋)과 `#wrap`(토큰·컴포넌트)으로 나누고, Guide 예제 영역을 `#wrap.guideScope`로 감쌈 | Guide에서 공통 컴포넌트를 실제 스타일로 보여 주면서 Guide 디자인은 유지 |
| 2026-11-24 | `/` 페이지 목록, `/spec/:slug` 명세 보기 추가. 명세는 `docs/*.md`를 `?raw`로 읽어 직접 만든 마크다운 변환기로 표시 | 참고 사이트 첫 화면처럼 메뉴·내용 구성. 문서와 화면이 한 원본(SSOT)을 쓰도록 |
| 2026-11-24 | 다크모드는 `#wrap[data-theme="dark"]` 색상 토큰 전환, `localStorage` 저장 | `html` 클래스·전역 선택자 금지 규칙 유지 |
| 2026-11-24 | `#wrap`을 `position: fixed; inset: 0`으로 화면 전체에 배치 | `body` 선택자 없이 기본 `body` 여백 영향 제거 |
| 2026-11-24 | 컴포넌트 조건을 `docs/components/{컴포넌트명}.md` 한 파일씩으로 분리, `component-ssot.md`는 공통 원칙·목차로 유지 | 한 파일에 33종이 있어 찾기·수정이 어려움 |

---

## 11. 설계 변경 관리

- 기능 요구사항이 변경되면 `docs/requirements.md`를 먼저 확인합니다.
- 컴포넌트 구조, 데이터 흐름, 인터랙션 등이 변경되면 이 문서를 갱신합니다.
- 코딩 규칙이나 라이브러리 정책 변경은 `AGENTS.md`에서 관리합니다.
- 작업 진행 상태는 `docs/tasks.md`에서 관리합니다.
- 실제 코드와 설계 문서가 다르면 임의로 수정하지 않고 차이를 확인합니다.
- 설계에 없는 기능은 사용자 확인 없이 임의로 추가하지 않습니다.

### 11.1 IA·명세 화면 작업 완료 검증

- `/Ia`가 독립 라우트로 접속되는지 확인합니다.
- `/Ia`의 목록 최상단에 메인(`/`) 링크가 항상 존재하는지 확인합니다.
- `ia.css`, `common.css`의 스타일이 다른 페이지에 영향을 주지 않는지 확인합니다.
- 페이지 추가 시 IA, 공통 컴포넌트 추가·수정 시 스토리(명세 화면 탭)·메인 컴포넌트 카드 갱신 여부를 확인합니다.

## 12. 프로젝트 템플릿 분리 및 검증

- 일반 페이지 루트는 `#wrap`이며, 디자인 토큰도 그 안에 선언합니다.
- `/Ia`는 Layout 밖 독립 라우트로 두고 전용 CSS와 기존 동작을 유지합니다.
- 페이지/라우트 변경 시 `src/data/iaData.ts`, 공통 컴포넌트 변경 시 스토리·메인 카드를 동기화합니다.
- `scripts/check-project.mjs`는 기본 정적 점검용이며 실제 브라우저 동작 검증을 대체하지 않습니다.

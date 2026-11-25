# AGENTS.md — 기본 프로젝트 AI 개발 가이드

> 이 파일은 프로젝트의 **AI 개발 규칙에 대한 단일 원본(SSOT)**입니다. AI 코딩 도구는 작업 전에 이 파일을 확인하며, 도구별 지침 파일(`CLAUDE.md` 등)은 이 문서를 참조하도록 설정합니다. (도구마다 자동 로딩 방식이 다르므로 자동 참조 여부를 확인합니다.)

---

## 1. 프로젝트 개요

- **이름:** 프로젝트 이름
- **설명:** 해당 프로젝트 설명
- **대상 사용자:** 모든 사용자
- **작업 범위:** **퍼블리싱 전용** (React + TypeScript)
- **문서 읽기 순서:** `docs/requirements.md` → `docs/design.md` → `docs/tasks.md`
- **디자인 원본:** 사용하는 디자인 툴과 링크·파일 위치는 `docs/requirements.md` 6장에서만 정의합니다. 이 문서의 "디자인 원본"은 그곳에 지정된 시안을 뜻합니다.
- **작업별 추가 문서:** IA 작업은 `docs/ia-spec.md`, 공통 컴포넌트 작업은 `docs/components/{컴포넌트명}.md`(컴포넌트별 Props·변환 조건, 목차·공통 원칙은 `docs/component-ssot.md`)
- 문서가 없거나 내용이 불명확하면 가정하지 않고 사용자에게 확인합니다.

## 2. 기술 스택 및 라이브러리

| 구분 | 사용 기술 | 규칙 |
| --- | --- | --- |
| 빌드 | Vite | 기존 설정 유지 |
| 프레임워크 | React 18+ | 함수형 컴포넌트와 Hooks |
| 언어 | TypeScript | `strict: true` 기준 |
| 스타일 | 일반 CSS | `common.css`, `ia.css`만 사용 (5.3절) |
| 라우팅 | React Router | 페이지가 2개 이상일 때 사용 |
| 상태 관리 | React 내장 API | `useState`, `useContext` 우선 |
| 슬라이드 | Swiper | 슬라이드·캐러셀 구현 시 필수 |
| 차트 | recharts | `Chart` 컴포넌트 구현 시 사용 |
| 날짜 선택 | react-day-picker + date-fns | `DatePicker`·`DateRangePicker` 구현 시 사용 |
| 드래그 정렬 | @dnd-kit | `SortableList`·`TreeView` 드래그 정렬 구현 시 사용 |
| SVG 컴포넌트 | vite-plugin-svgr | SVG를 `?react`로 import할 때 사용 (`vite.config.ts` 플러그인 등록 허용) |
| 패키지 매니저 | npm | 기존 의존성 우선 |

**사용 금지**

- Tailwind CSS, SCSS, CSS Modules, styled-components, Emotion 등 다른 스타일 방식
- MUI, Ant Design 등 UI 컴포넌트 라이브러리
- Lucide, Font Awesome, React Icons 등 외부 아이콘 라이브러리
- 클래스형 React 컴포넌트, TypeScript `any`
- 전역 상태 관리 라이브러리

**설치 정책**

- 기존에 설치된 라이브러리를 우선 사용합니다.
- 아래 라이브러리는 **사전 승인**되어 있어, 해당 컴포넌트를 실제로 구현할 때(6.4 2단계에서 승인된 경우)만 설치합니다. 미리 설치하지 않습니다. (2026-11-25: Chart·DatePicker·Slider·SortableList·TreeView 구현으로 `swiper`·`recharts`·`react-day-picker`·`date-fns`·`@dnd-kit/*` 설치됨, `vite-plugin-svgr`는 미설치)
    - `npm install swiper`
    - `npm install recharts`
    - `npm install react-day-picker date-fns`
    - `npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`
    - `npm install -D vite-plugin-svgr`
- 그 외 신규 라이브러리는 이유와 영향 범위를 설명하고 승인받은 뒤 설치하며, 이 문서를 갱신합니다.

## 3. 주요 명령어

```bash
npm install       # 의존성 설치
npm run dev       # 개발 서버 (기본 http://localhost:5173, 실제 포트는 프로젝트 설정)
npm run build     # 프로덕션 빌드
npm run preview   # 빌드 미리보기
npm run lint      # 린트 (oxlint, `.oxlintrc.json`)
node scripts/check-project.mjs   # 프로젝트 규칙 정적 검사 (9.1)
```

- **배포:** `main`에 푸시하면 GitHub Actions(`.github/workflows/deploy.yml`)가 GitHub Pages(https://codoly83.github.io/claudeTest/)에 올립니다. 하위 경로는 빌드 시 `BASE_PATH`로 정하며, 코드에서 직접 쓰는 `<a href>`·iframe 경로는 `src/utils/basePath.ts`의 `withBase()`를 씁니다 (React Router `Link`는 basename이 자동으로 붙음).

- 작업 완료 시 `npm run build`로 확인하고, 실행하지 못했다면 그 사실을 명시합니다.
- 프로젝트 경로에 한글 등 영문이 아닌 문자가 있으면 TypeScript 7·oxlint·Vite(rolldown/esbuild) 실행 파일이 강제 종료됩니다. 프로젝트는 영문 경로(현재 `C:\dev\publish-project`)에 둡니다.

## 4. 프로젝트 폴더 구조

```text
src/
├── main.tsx                 # 진입점 (수정 최소화)
├── App.tsx                  # 라우팅
├── pages/                   # 페이지 (파일 단위)
│   ├── Home.tsx
│   ├── Ia.tsx               # /Ia 관리 화면
│   └── Spec.tsx             # /spec/:slug 명세 화면 (컴포넌트는 문서·샘플·Playground·API 탭)
├── components/
│   ├── common/              # 2곳 이상에서 쓰는 UI (파일 단위)
│   │   ├── Button.tsx
│   │   └── Slider.tsx
│   └── layout/              # 공통 레이아웃
│       ├── Layout.tsx       # #wrap, #modalWrap, common.css import
│       ├── Header.tsx       # 로고·메뉴 검색·다크모드 스위치
│       ├── SideMenu.tsx     # 왼쪽 메뉴 카드 (data/navData.ts)
│       ├── MemberLayout.tsx # 회원 화면 레이아웃 (왼쪽 메뉴 없음, 예: /signup)
│       └── Footer.tsx
├── hooks/                   # 커스텀 훅 (useXxx.ts)
├── providers/               # Context Provider (예: ToastProvider.tsx)
├── types/index.ts           # 공용 타입
├── constants/index.ts       # 공용 상수
├── data/                    # 목업 데이터, IA 화면 목록(iaData.ts), 왼쪽 메뉴(navData.ts), 컴포넌트 스토리(componentStories.ts + stories*.tsx)
├── utils/                   # 순수 유틸 함수
└── assets/
    ├── css/                 # common.css, ia.css
    ├── images/
    ├── icons/
    └── fonts/
```

### 4.1 폴더 관리 규칙

- 위 구조가 **기준 구조**입니다. 구조에 있는 폴더는 필요할 때 생성합니다.
- 구조에 없는 폴더는 `docs/requirements.md`에 정의되어 있거나 사용자가 승인한 경우에만 추가하고 이 문서를 갱신합니다.
- **컴포넌트는 `src/components/common/`·`layout/`, 페이지는 `src/pages/`에만 만들며, 컴포넌트·페이지마다 폴더를 만들지 않고 파일 하나로 둡니다.**
- Context Provider는 `src/providers/`에 `XxxProvider.tsx` 파일 하나로 두고, 일반 페이지용은 `Layout.tsx`에서 감쌉니다.
- `common.css`는 `main.tsx`에서 전역 import하지 않고 `Layout.tsx`에서만 import합니다.
- `/Ia`는 Layout 밖 독립 라우트로 두고 페이지에서 전용 CSS를 import합니다. (`/Guide`는 2026-11-25 폐지 — 컴포넌트 설명은 명세 화면)

## 5. 코딩 규칙

### 5.1 컴포넌트 및 함수

- 컴포넌트와 일반 함수는 모두 ES6(ES2015)의 **`const` + 화살표 함수**로 선언하고, 컴포넌트는 파일 마지막에 `export default ComponentName;`으로 내보냅니다. (`function` 선언, `export default function` 금지)
- 이벤트 핸들러는 `handle` 접두어를 사용합니다.
- Props 타입은 해당 컴포넌트 파일에 `interface XxxProps`로 정의합니다. 여러 파일에서 공유하는 타입만 `src/types/`에 둡니다.
- 약 150줄을 넘으면 분리를 검토하되, 줄 수만을 이유로 쪼개지 않습니다.

**공통 컴포넌트 기준**

- 같거나 비슷한 UI가 **2곳 이상**에서 쓰이고 구조·동작을 공통화할 수 있을 때만 `components/common/`으로 분리합니다.
- 1곳에서만 쓰는 UI는 해당 페이지 파일 안에 작성합니다.
- "나중에 쓸 수도 있다"는 이유로 미리 만들지 않습니다. 단, 6.4절 2단계(화면 분석)에서 2곳 이상 사용이 확인된 컴포넌트는 페이지보다 먼저 만듭니다.
- 기존 공통 컴포넌트가 있으면 새로 만들지 않고 재사용하며, 데이터와 상태는 Props로 제어합니다.

```tsx
interface ButtonProps {
    label: string;
    variant?: 'primary' | 'secondary';
    onClick?: () => void;
}

const Button = ({ label, variant = 'primary', onClick }: ButtonProps) => {
    return (
        <button type="button" className={`btn ${variant}`} onClick={onClick}>
            {label}
        </button>
    );
};

export default Button;
```

### 5.1.1 공통 컴포넌트 설계 규칙

**파일 내부 순서**

import → `interface XxxProps` → 컴포넌트 전용 상수 → 컴포넌트 → `export default`

- 페이지 전용 하위 UI(예: `ServiceCard`)는 페이지 파일 안에서 페이지 컴포넌트 **바깥**에 `const`로 선언합니다. 컴포넌트 안에 컴포넌트를 선언하지 않습니다.

**Props 규칙**

| 구분 | 규칙 | 예시 |
| --- | --- | --- |
| 콜백 Props | `on` + 동사 (컴포넌트 내부 함수는 `handle`) | `onClick`, `onChange`, `onClose` |
| Boolean Props | HTML 속성과 같으면 그대로, 아니면 `is`/`has` | `disabled`, `isOpen` |
| 변형 | 문자열 유니온 + 기본값 | `variant?: 'primary' \| 'secondary'` |
| 크기 | 문자열 유니온 + 기본값. 값 이름에 `'default'`를 쓰지 않고 크기 이름 사용 | `size?: 'sm' \| 'md' \| 'lg'` |
| 내용 | 텍스트만이면 `label`, 마크업이 들어가면 `children` | |

- variant·size 값은 **디자인 원본에 있는 것만** 정의합니다.
- 네이티브 속성 전달이 필요하면 `ButtonHTMLAttributes<HTMLButtonElement>` 등을 확장하고 `...rest`로 전달합니다.
- `className` Props는 **받지 않습니다**. 배치·간격은 부모 요소에서 처리하고, 새 모양이 필요하면 variant를 추가하고 스토리(명세 화면)를 갱신합니다.
- 컴포넌트 자체의 크기(Skeleton 모양, ScrollArea 높이, Table 열 폭 등)는 숫자 Props + 인라인 스타일이 아니라 **프리셋 Props**(`size`, `shape`, `width` 등 문자열 유니온)로 받아 `common.css` 클래스로 처리합니다. 프리셋 값은 디자인 원본 기준으로 정합니다.
- 같은 기능의 컴포넌트를 나누지 않습니다. 예: Alert 다이얼로그는 `Modal`의 `size="alert"`, 그룹 접기/펼치기는 `Accordion`, 단순형·다중 선택은 `Select` 하나로 처리합니다. (`docs/components/Modal.md`, `Accordion.md`, `Select.md`)

**배치·간격 (Stack, Grid, Section, Card, Table)**

- 페이지 콘텐츠는 배치 컴포넌트 `Stack`(쌓기)·`Grid`(열 나누기)·`Section`(구역)·`Card`(상자)·`Table`(`type="list"` 목록 / `type="result"` 상세)을 조합해 만듭니다. 상세 규칙은 `docs/component-ssot.md` 2.3입니다.
- 간격은 프리셋 Props로만 정합니다: 형제 사이 `gap`, 상자 안쪽 `padding`, 값은 `'sm' | 'md' | 'lg'`(8·16·24px, 기본 `'md'`, 토큰 `--gap-sm/md/lg`).
- 형제 사이 간격은 부모 배치 컴포넌트가 정하고, 자식에 `margin`으로 간격을 주지 않습니다. 같은 배치를 페이지 CSS로 다시 만들지 않습니다.

**폼 컴포넌트 (Input, Select, Checkbox, Radio 등)**

- 제어 컴포넌트로 만듭니다: `value`/`checked` + `onChange`.
- `onChange`는 값만 전달합니다: `onChange?: (value: string) => void`
- `label`과 입력 요소는 `useId()`로 만든 ID로 연결합니다. ID를 하드코딩하지 않습니다.
- 오류 상태는 `aria-invalid`, 오류 문구는 `aria-describedby`로 연결합니다.

**상태 클래스**

- 상태 클래스는 `on`(활성·선택·열림), `disabled`만 사용합니다. 예: `.tabItem.on`, `.accordion.on`
- 변형 클래스는 루트 클래스에 함께 붙입니다. 예: `.btn.primary`, `.btn.sm`

**오버레이 (Modal, Toast, Tooltip, 드롭다운 등)**

- Modal(및 Toast처럼 화면 전체 위에 뜨는 레이어)은 `#wrap` 안의 `<div id="modalWrap">`(`Layout.tsx`의 Footer 다음)에 Portal로 렌더링합니다. `document.body`에 렌더링하면 `#wrap` 범위의 CSS가 적용되지 않으므로 금지합니다.
- Tooltip·드롭다운은 Portal 없이 기준 요소 옆에 렌더링합니다. 부모의 `overflow: hidden` 등으로 잘리는 경우에만 `#modalWrap`을 사용합니다.
- 배경 스크롤 잠금은 열릴 때 `document.body.style.overflow = 'hidden'`, 닫히거나 언마운트될 때 이전 값으로 복원합니다. 이는 이 절에 명세된 예외이므로 5.3.1 기록 대상이 아니며, CSS에 `body` 선택자는 여전히 쓰지 않습니다.
- Modal: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, ESC로 닫기, 열면 내부로 포커스 이동, 닫으면 연 버튼으로 포커스 복귀.

**반복 UI (Tabs, Accordion, Table 등)**

- 항목은 배열 Props로 받습니다. 예: `items: TabItem[]`
- 활성 상태는 기본적으로 컴포넌트 내부 `useState`로 관리하고, 외부 제어가 필요할 때만 `activeIndex` + `onChange`를 추가합니다.
- 키보드 조작과 ARIA 역할은 WAI-ARIA Authoring Practices 패턴을 따릅니다.

**ref**

- 포커스 제어 등으로 ref 전달이 필요한 컴포넌트만 `forwardRef`를 사용합니다. (React 18 기준)

### 5.2 이름 규칙

| 대상 | 규칙 | 예시 |
| --- | --- | --- |
| 컴포넌트, 타입 | PascalCase | `UserCard`, `UserProfile` |
| 함수, 변수 | camelCase | `formatDate`, `isOpen` |
| 커스텀 훅 | `use` + PascalCase | `useScroll` |
| 공용 상수 | UPPER_SNAKE_CASE | `MAX_ITEMS` |
| CSS 클래스, ID | camelCase | `.cardTitle`, `#mainContent` |
| Boolean 변수 | `is`, `has`, `can`, `should` 권장 (Props는 5.1.1의 `is`/`has` 규칙 우선) | `isLoading`, `hasError`, `shouldAutoplay` |

### 5.3 CSS

- CSS 파일은 **`src/assets/css/`의 `common.css`(일반 페이지), `ia.css`(`/Ia`) 두 개만** 사용합니다. `*.module.css`, `Home.css`, `variables.css` 등 다른 CSS 파일을 만들지 않습니다.
- CSS는 한 번 import되면 다른 라우트에도 남으므로 선택자 범위를 한정합니다.
    - `common.css`: `#wrap` 아래 (`Layout.tsx`의 최상위 `<div id="wrap" class="siteLayout">`). 요소 리셋은 `#wrap.pageLayout`, 화면 레이아웃은 `#wrap.siteLayout`·`#wrap.memberLayout`, 토큰·공통 컴포넌트는 `#wrap` (`docs/design.md` 6.1)
    - `ia.css`: `#iaWrap` 아래
- `body`, `html`, `*`, `:root` 등 전역 선택자를 쓰지 않습니다. 리셋도 각 루트 아래에 작성합니다.
- 색상·간격·폰트 크기 등 반복 값은 `#wrap`에 CSS 변수(디자인 토큰)로 선언합니다. 토큰 목록은 `docs/design.md` 6장을 따릅니다.
- 반응형은 모바일 우선(`min-width`), 기본 브레이크포인트는 `768px`(Tablet), `1024px`(Desktop), `1440px`(Wide)입니다.
- Swiper 등 승인된 라이브러리의 공식 CSS import는 허용하며, 스타일 재정의는 `common.css`에 작성합니다.

```css
/* 01. Design tokens */
#wrap {
    --color-text: #222;
    --space-4: 16px;
    --space-6: 24px;
    --radius-md: 8px;
}
/* 02. Reset / Base */
/* 03. Common components */
#wrap .card {
    padding: var(--space-4);
    color: var(--color-text);
    border-radius: var(--radius-md);
}
/* 04. Layout */
/* 05. Pages */
/* 06. Swiper custom styles */
/* 07. Responsive */
@media (min-width: 768px) {
    #wrap .card { padding: var(--space-6); }
}
```

### 5.3.1 인라인 스타일 예외 및 기록 규칙

- 인라인 스타일(`style` 속성)은 원칙적으로 금지합니다. **런타임에 계산되어 클래스로 미리 정의할 수 없는 동적 값**(진행률 `width`, 드래그·스크롤 위치, 데이터에서 받은 색상·이미지 URL 등)에만 허용합니다.
- 열림/닫힘처럼 정해진 상태는 클래스 토글로, 고정 값은 CSS로 처리합니다.
- 예외로 사용하면 **반드시 두 곳에 기록**합니다.
    1. **코드:** 요소 바로 위에 `{/* [inline-style] 이유 */}` (일반 코드는 `// [inline-style] 이유`)
    2. **문서:** `docs/design.md` 6.2절 표에 파일·요소·속성·이유·날짜 추가
- 인라인 스타일을 제거하면 주석과 표의 행도 함께 삭제합니다.
- `docs/ia-spec.md`의 IA 미리보기 `#wrap` 축소(`element.style`)는 명세에 포함된 예외이므로 기록하지 않습니다.

```tsx
{/* [inline-style] 슬라이드 진행률: 진행 상태에 따라 계산되는 동적 값 */}
<div className="progressBar" style={{ width: `${progress}%` }} />
```

> 전체 사용 위치는 `grep -rn "\[inline-style\]" src/`로 찾아 design.md 표와 일치하는지 확인합니다.

### 5.4 이미지 및 아이콘

- 이미지·아이콘은 **디자인 원본의 에셋**을 `docs/requirements.md` 6장의 에셋 제공 방식대로 받아 사용합니다. 임의 제작, 유사 아이콘 대체, CSS로 모양 그리기, 디자인 원본에 없는 에셋 추가를 하지 않습니다. 원본을 구할 수 없으면 사용자에게 확인합니다.
- 아이콘은 `src/assets/icons/`(가능하면 SVG), 이미지는 `src/assets/images/`에 두고, 파일명은 용도를 알 수 있게 작성합니다. 예: `iconSearch.svg`
- 아이콘 색을 바꿔야 하면 `vite-plugin-svgr`의 `?react` import + `currentColor`, 또는 `common.css`의 `mask-image` 클래스 + `background-color: currentColor`를 사용합니다. 색만 다른 아이콘 파일을 중복 저장하지 않습니다.
- 같은 에셋을 중복 저장하지 않으며, 크기·배치는 CSS로 조정합니다.
- 정보 전달 이미지는 의미 있는 `alt`, 장식용은 `alt=""`를 사용하고, 아이콘 버튼·링크에는 접근 가능한 이름(`aria-label` 등)을 제공합니다.

```tsx
import iconSearch from '../../assets/icons/iconSearch.svg';

const SearchButton = () => {
    return (
        <button type="button" aria-label="검색">
            <img src={iconSearch} alt="" />
        </button>
    );
};

export default SearchButton;
```

### 5.5 TypeScript 및 상태 관리

- `any` 대신 `unknown`과 타입 좁히기를 사용하고, 목업 데이터에도 타입을 명시합니다.
- 같은 상태를 중복 관리하지 않고, 계산 가능한 값은 원본 상태에서 도출합니다.
- 상태 변경 시 배열·객체의 불변성을 유지하며, 단순한 화면 상태는 `useState`를 우선 사용합니다.

### 5.6 슬라이드(Swiper)

- 슬라이드·캐러셀은 **`swiper/react`**로 구현하며, 이동·터치·드래그를 직접 구현하지 않습니다. 슬라이드가 아닌 콘텐츠에는 쓰지 않습니다.
- 설치된 Swiper 버전의 공식 API를 쓰고, 반응형은 `breakpoints`, 자동 재생·페이지네이션·네비게이션은 Swiper 모듈을 사용합니다. 이들은 디자인·요구사항에 있을 때만 추가합니다.
- 여러 화면에서 쓰는 슬라이드는 `src/components/common/`에 두고, 이미 있으면 재사용합니다.
- 슬라이드 데이터는 배열 + `map()`으로 렌더링하고 고유 `key`를 사용합니다.
- 자동 재생 시 정지 수단, 키보드 조작 등 접근성을 고려합니다.

```tsx
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const BannerSlider = () => {
    const slideList = [
        { id: 1, title: '슬라이드 1' },
        { id: 2, title: '슬라이드 2' }
    ];

    return (
        <Swiper
            slidesPerView={1}
            spaceBetween={16}
            breakpoints={{ 768: { slidesPerView: 2, spaceBetween: 20 }, 1024: { slidesPerView: 3, spaceBetween: 24 } }}
        >
            {slideList.map((item) => (
                <SwiperSlide key={item.id}>{item.title}</SwiperSlide>
            ))}
        </Swiper>
    );
};

export default BannerSlider;
```

### 5.7 커스텀 훅

- 여러 컴포넌트에서 반복되는 React 상태·이벤트 로직만 `src/hooks/useXxx.ts`(JSX 필요 시 `.tsx`)로 분리합니다. 한 컴포넌트에서만 쓰는 로직은 분리하지 않습니다.
- Hooks 호출 규칙을 지킵니다. 컴포넌트나 다른 훅의 최상위에서만 호출하고, 조건문·반복문·이벤트 핸들러 안에서 호출하지 않습니다.
- 직접 등록한 이벤트 리스너는 cleanup에서 해제합니다.

| 구분 | `hooks/` | `utils/` |
| --- | --- | --- |
| 목적 | React 로직 재사용 | 일반 함수 재사용 |
| React Hooks·상태 | 사용 | 사용하지 않음 |
| 예시 | `useWindowSize.ts` | `formatDate.ts` |

## 6. 퍼블리싱 작업 규칙

### 6.1 기본 규칙

- 목업 데이터를 사용할 수 있으며, 여러 화면에서 공유하는 목업은 `src/data/`에 둡니다.
- 기존 마크업 구조와 CSS 클래스명을 최대한 유지합니다.
- 시맨틱 태그를 우선 사용하며, 공통 레이아웃의 태그·ID 구조는 `docs/design.md`를 따릅니다.

### 6.2 IA 페이지 (`/Ia`)

- 상세 명세의 기준 원본은 **`docs/ia-spec.md`**입니다. IA 관련 작업 전에는 반드시 전체를 읽습니다.
- 다른 작업에서도 지켜야 할 핵심 규칙:
    - 파일은 `src/pages/Ia.tsx`, `src/data/iaData.ts`, `src/types/index.ts`(IA 타입), `src/assets/css/ia.css`만 사용합니다.
    - 기존 IA 디자인·문구·동작은 승인 없이 변경하지 않습니다.
    - 새 페이지를 만들면 **같은 작업에서** `IA_TABLES`에 등록합니다.
    - 검증되지 않은 페이지를 `Done`으로 표시하지 않으며, `docs/tasks.md`와 상태가 다르면 사용자에게 확인합니다.
    - 메인(`/`) 항목은 항상 IA 목록 최상단에 둡니다. (2026-11-25 `/Guide` 폐지로 변경)

### 6.3 공통 컴포넌트 명세 화면 (`/spec/{컴포넌트}`)

> 2026-11-25: 별도 Guide 화면(`/Guide`, `guide.css`, `docs/guide-spec.md`)은 메인 컴포넌트 목록·명세 화면과 내용이 겹쳐 폐지했습니다. 컴포넌트 설명·검수는 명세 화면에서 합니다.

- 컴포넌트 명세 화면(`src/pages/Spec.tsx`)은 탭 4개입니다: **문서**(`docs/components/{컴포넌트명}.md`) · **샘플** · **Playground** · **API**. 메인(`/`) 컴포넌트 카드의 "명세" 링크가 이 화면으로 연결됩니다.
- 다른 작업에서도 지켜야 할 핵심 규칙:
    - 샘플·Playground·API 내용은 **컴포넌트 스토리** `src/data/componentStories.ts`(배치 `storiesLayout.tsx`, Atom `storiesAtom.tsx`·`storiesAtomPlus.tsx`)에서 읽습니다. 왼쪽 메뉴 분류는 가벼운 `src/data/componentCatalog.ts`에서 읽으므로, 컴포넌트를 추가·분류 변경하면 분류표도 함께 고칩니다.
    - 공통 컴포넌트를 추가하거나 Props·사용법을 바꾸면 **같은 작업에서** 스토리(API 행·샘플·Playground)를 갱신합니다. 스토리 예제 마크업은 `common.css` 클래스(배치 컴포넌트, `story*`)만 씁니다.
    - 새 공통 컴포넌트는 같은 작업에서 메인(`/`) 컴포넌트 목록(`src/pages/Home.tsx`)에도 미리보기 카드를 추가합니다.
    - IA는 페이지 목록, 명세 화면은 공통 컴포넌트 설명입니다. 페이지를 스토리에 등록하지 않습니다.
    - 스토리 변경이 없으면 결과 보고에 `스토리 변경 없음(공통 컴포넌트 변경 없음)`이라고 명시합니다.

### 6.4 작업 순서: 화면 분석 → 공통 컴포넌트·스토리 → 페이지

디자인은 페이지 단위로 나오지만 작업은 공통 컴포넌트부터 합니다. 그래서 컴포넌트를 만들기 전에 **디자인 원본 전체를 분석해 공통 컴포넌트 목록을 먼저 확정**합니다.

**앞 단계가 완료(검증 및 `docs/tasks.md` 체크)되기 전에 다음 단계를 시작하지 않습니다.**

| 단계 | 작업 | 완료 조건 |
| --- | --- | --- |
| 1. 초기 구성 | 라우트, `Layout`(`#wrap`, `#modalWrap`), 디자인 토큰, `/Ia`, 메인(`/`)·명세 화면(`/spec/:slug`) | 관리 화면 접속, IA 최상단에 메인 등록, 빌드 통과 |
| 2. 화면 분석 | 디자인 원본의 **전체 페이지**를 보고 반복되는 UI를 찾아 컴포넌트 목록(이름, 사용 페이지, variant·size) 작성 | `docs/design.md` 2장 표에 기록, 사용자 승인, `docs/tasks.md`에 컴포넌트 작업 등록 |
| 3. 공통 컴포넌트 + 스토리 | 2단계에서 승인된 컴포넌트만 구현 | 컴포넌트마다 스토리(API 표, 샘플·사용 코드, Playground)와 메인 카드 작성, 9.2 수동 검수 |
| 4. 페이지 | 공통 컴포넌트를 조합해 페이지 작성 | IA 등록, 디자인·동작 확인, 빌드 통과 |

- 2단계에서는 코드를 작성하지 않습니다. 사용 페이지가 2곳 이상인 UI만 공통 컴포넌트 후보로 올리고, 1곳뿐인 UI는 해당 페이지 파일 안에서 작성합니다.
- 컴포넌트 예시: `Input`, `Select`, `Radio`, `Checkbox`, `DatePicker`, `Button`, `Modal`, `Tabs`, `Accordion`, `Stepper`, `Table`, `Tooltip`. 실제 목록은 2단계 분석 결과 기준이며, 디자인 원본에 없는 컴포넌트나 Props·변형(variant)을 미리 만들지 않습니다.
- 시안이 페이지별로 순차 전달되면, 새 시안을 받을 때마다 2단계를 다시 수행해 목록을 갱신합니다.
- 4단계에서 공통 컴포넌트가 부족하면 페이지에서 복사하거나 CSS 덮어쓰기로 우회하지 않고, 컴포넌트를 수정하고 스토리를 함께 갱신합니다.
- 새 공통 컴포넌트가 필요해 보이면 페이지 작업을 멈추고 2단계로 돌아가 목록 추가를 제안합니다. 승인 후 컴포넌트와 스토리를 먼저 완료합니다.
- `docs/tasks.md`는 1 → 2 → 3 → 4단계 순으로 작성하고, 공통 컴포넌트 작업은 그것을 쓰는 페이지 작업보다 항상 위에 둡니다.

## 7. SSOT 문서 관리

| 정보 | 공식 원본 |
| --- | --- |
| AI 개발 규칙 | `AGENTS.md` |
| 기능 요구사항 | `docs/requirements.md` |
| 디자인 원본 (툴, 링크, 에셋 제공 방식) | `docs/requirements.md` 6장 |
| 구조 및 설계, 공통 컴포넌트 목록, 디자인 토큰, 인라인 스타일 사용 목록 | `docs/design.md` |
| 공통 컴포넌트별 Props·마크업·접근성 조건 (참고 가이드 변환 기준) | `docs/components/{컴포넌트명}.md` (공통 원칙·목차·결정 기록: `docs/component-ssot.md`) |
| 작업 진행 상태 | `docs/tasks.md` (체크박스) |
| IA 페이지 명세 | `docs/ia-spec.md` (화면 목록만 `src/data/iaData.ts`에서 관리) |
| 공통 컴포넌트 샘플·API (명세 화면 탭) | `src/data/componentStories.ts` (분류: `src/data/componentCatalog.ts`) |
| 공용 타입 / 상수 | `src/types/` / `src/constants/` (import하여 사용) |

- 같은 규칙과 데이터를 여러 곳에 중복 정의하지 않습니다.
- 스펙 변경이 확정되면 공식 문서를 먼저 갱신하고 코드를 수정합니다.
- 문서와 코드가 충돌하면 임의로 덮어쓰지 않고 차이를 보고합니다.

## 8. AI 작업 절차

1. **문서 확인:** 관련 문서와 디자인 원본을 확인하고, `docs/tasks.md`에서 현재 작업과 6.4절 순서상 시작 가능한 단계인지 확인합니다.
2. **기존 코드 검색:** 새 파일을 만들기 전에 유사한 파일과 공통 컴포넌트가 있는지 찾습니다.
3. **작업 단위:** 요청된 작업 한 가지에만 집중합니다.
4. **최소 수정:** 요청 범위 밖의 리팩터링, 파일 이동·삭제·덮어쓰기, 라이브러리 설치는 사전 승인을 받습니다.
5. **불명확하면 질문:** 추측으로 설계를 확정하거나 디자인 원본에 없는 UI·기능·에셋을 추가하지 않습니다.
6. **IA·스토리 동기화:** 페이지 추가 시 IA, 공통 컴포넌트 추가·변경 시 스토리·메인 카드를 같은 작업에서 갱신합니다.
7. **검증:** 9.1절 자동 검사를 실행하고, 9.2절 수동 검수 항목 중 이번 변경에 해당하는 것을 정리합니다. 실행하지 않은 검사를 통과했다고 보고하지 않습니다.
8. **작업 기록:** 검증된 작업만 `docs/tasks.md`에서 `[x]`로 변경합니다. 수동 검수가 남은 작업은 사용자 확인 후 체크합니다.
9. **결과 보고:** 수정 파일, IA·스토리 반영 여부, 인라인 스타일 사용 여부(design.md 기록 여부), 변경 이유, 남은 문제를 요약하고, 마지막에 아래 **검수 결과** 표를 붙입니다.

```markdown
**검수 결과**

| 검사 | 결과 |
| --- | --- |
| npm run build | 통과 / 실패 / 미실행(이유) |
| npm run lint | 통과 / 실패 / 미실행(이유) |
| node scripts/check-project.mjs | 통과 / 경고 N건(내용) / 미실행(이유) |
| 사람이 확인할 항목 (9.2) | 예: Modal ESC·포커스 복귀, 360px 레이아웃 |
```

- AI가 브라우저에서 직접 조작하지 못한 항목은 "확인함"으로 적지 않고 **사람이 확인할 항목**으로 넘깁니다.

### 8.1 Git 안전 규칙

- 작업 전 `git status`로 변경 범위를 확인하고, 사용자 변경분을 덮어쓰지 않습니다.
- `git reset --hard`, `git clean -fd`, 강제 푸시, 이력 재작성은 명시적 승인 없이는 금지합니다.

## 9. 검수

검수는 세 단계로 나눕니다. **기계로 확인할 수 있는 규칙은 9.1 자동 검사**로, **실제 동작은 컴포넌트 명세 화면(`/spec/{컴포넌트}`)의 샘플·Playground 탭에서 9.2 수동 검수**로 확인하고, 마지막으로 **9.3 점검 목록**을 확인합니다.

### 9.1 자동 검사 (작업 완료 시 AI가 실행)

| 규칙 | 도구 | 확인 방법 |
| --- | --- | --- |
| 타입 오류 없음 | `npm run build` | `tsc` + Vite 빌드 통과 |
| `any` 금지 (5.5) | oxlint | `typescript/no-explicit-any: error` |
| `function` 선언·`export default function` 금지 (5.1) | oxlint | `func-style: ["error", "expression"]` |
| `console.log` 금지 | oxlint | `no-console: error` |
| Hooks 호출 규칙 (5.7) | oxlint | `react/rules-of-hooks: error` |
| 공통 컴포넌트에 `className` Props 없음 (5.1.1) | check-project | `src/components/common/*.tsx`에서 `className?:` / `className:` 검색 |
| Portal 대상이 `document.body`가 아님 (5.1.1) | check-project | `createPortal(` 호출의 두 번째 인자 검사 |
| 공통 컴포넌트에 하드코딩 ID 없음 (5.1.1) | check-project | `src/components/common/`에서 `id="` 문자열 리터럴 검색 |
| CSS 파일은 2개뿐 (5.3) | check-project | `src/` 아래 `.css` 파일이 `common.css`, `ia.css`뿐인지 |
| 전역 선택자 없음 (5.3) | check-project | CSS에서 `body`, `html`, `:root`, 단독 `*` 선택자 검색 (`:not(:root)` 같은 부정 조건은 제외) |
| CSS 선택자 범위 (5.3) | check-project | 모든 선택자(`@media` 내부 포함, `@keyframes` 제외)가 `common.css`는 `#wrap`, `ia.css`는 `#iaWrap`으로 시작하는지 |
| 인라인 스타일 기록 일치 (5.3.1) | check-project | `[inline-style]` 주석 수 = `style={` 속성 수 = `docs/design.md` 6.2 표 행 수 |
| 컴포넌트 분류표 ↔ 스토리 (6.3) | check-project | `src/data/componentCatalog.ts`의 이름·분류가 스토리 `category`와 같은지 (메뉴는 분류표만 읽음) |
| 공통 컴포넌트 ↔ 명세 스토리 동기화 (6.3) | check-project | `components/common/`의 파일마다 `src/data/stories*.tsx`에 스토리 `id` 존재 |
| 페이지 ↔ IA 동기화 (6.2) | check-project | `App.tsx` 라우트가 `iaData.ts`에 등록되어 있는지(`:slug` 경로는 앞부분 일치, `/Ia` 자체는 제외), `src/pages/` 파일이 모두 라우트에 연결되어 있는지 |
| IA 최상단 메인 (6.2) | check-project | `IA_TABLES[0]`이 `/`인지 |
| `console.log` 없음 (9.3) | check-project (경고) | `src/`의 `.ts`·`.tsx`에서 `console.log(` 검색 |

- 린트 규칙은 `.oxlintrc.json`에 설정합니다. 현재 Vite 템플릿(create-vite 9)은 ESLint 대신 oxlint를 포함하므로 그 범위에서 설정하며, 새 린트 도구·플러그인은 2장 설치 정책에 따라 승인 후 추가합니다.
- `scripts/check-project.mjs`는 오류가 있으면 종료 코드 1, 경고만 있으면 0으로 끝납니다. 정적 보조 검사이며 실제 브라우저 동작 검증(9.2)을 대체하지 않습니다.
- 검사 항목을 추가·변경하면 이 표와 `scripts/check-project.mjs`를 함께 갱신합니다.

### 9.2 컴포넌트 수동 검수 (사람이 명세 화면 `/spec/{컴포넌트}`에서 확인)

공통 컴포넌트를 추가·변경하면 해당 명세 화면의 샘플·Playground·API 탭에서 아래를 확인합니다. 해당 없는 항목은 건너뜁니다.

| 구분 | 확인 내용 |
| --- | --- |
| 모양 | 디자인 원본의 variant·size가 샘플에 모두 있고 디자인과 일치한다. |
| 상태 | `on`, `disabled` 상태가 샘플에 있고 올바르게 보인다. |
| 키보드 | Tab으로 이동되고 Enter·Space로 동작한다. 포커스 표시가 보인다. |
| 오버레이 | Modal은 ESC로 닫히고, 열면 내부로·닫으면 연 버튼으로 포커스가 이동하며, 배경 스크롤이 잠겼다가 복원된다. |
| 반복 UI | Tabs·Accordion 등은 WAI-ARIA 패턴대로 방향키·역할이 동작한다. |
| 폼 | 라벨 클릭 시 입력 요소에 포커스되고, 오류 문구가 `aria-describedby`로 연결된다. |
| 반응형 | 360px, 768px, 1024px, 1440px에서 깨지지 않는다. |
| 문서 | API 탭 Props 표(Type·Default)가 실제 코드의 Props와 일치한다. |

- 수동 검수가 끝나기 전에는 해당 작업을 `docs/tasks.md`에서 `[x]`로 바꾸지 않습니다.

### 9.3 완료 전 점검 목록

- [ ] 4.1절 위치 밖, 또는 컴포넌트·페이지별 폴더에 파일을 만들지 않았다.
- [ ] CSS 파일은 두 개뿐이고, 선택자가 각 루트 범위 안에 있다. (5.3)
- [ ] 디자인 토큰으로 관리할 값을 하드코딩하지 않았다. (5.3)
- [ ] 인라인 스타일이 있다면 주석과 design.md 표에 기록했다. (5.3.1)
- [ ] 디버깅용 `console.log`가 남아 있지 않다.
- [ ] 승인되지 않은 패키지를 설치하지 않았다. (2장)
- [ ] `main.tsx`, `vite.config.ts`, `tsconfig.json`을 이유 없이 수정하지 않았다. (독립 CSS 분리, 사전 승인된 `vite-plugin-svgr` 등록, 라이브러리별 빌드 파일 나누기(`codeSplitting.groups`)에 필요한 최소 수정은 허용)
- [ ] 같은 기능의 공통 컴포넌트를 중복으로 만들지 않았다. (5.1)
- [ ] 공통 컴포넌트가 Props·폼·상태 클래스·오버레이 규칙을 따른다. (5.1.1)
- [ ] IA·스토리·메인 카드를 갱신했고 기존 IA 디자인·기능을 바꾸지 않았다. (6.2, 6.3)
- [ ] 9.1 자동 검사를 실행했고, 9.2 수동 검수 항목을 결과 보고에 넘겼다. (8장 9번)

규칙을 지키기 어려운 사정이 있으면 이유와 대안을 먼저 설명하고 승인받은 뒤 진행합니다.

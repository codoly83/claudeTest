# 작업 목록 (Tasks)

> AI와 사람이 **지금 무엇을 할 차례인지** 확인하는 문서입니다.
> 위에서부터 순서대로 하나씩 진행하고, 끝나면 `[x]`로 체크합니다.
> Phase 순서는 `AGENTS.md` 6.4절(초기 구성 → 화면 분석 → 공통 컴포넌트·Guide → 페이지)을 따릅니다.
> 각 작업 옆의 `(US-xx)`는 `requirements.md`의 사용자 스토리 번호입니다.

---

## 진행 상태
- **현재 단계**: Phase 1~5 완료 (디자인 원본 없이 사용자 요청 단위로 진행)
- **다음 작업**: 3-12·4-0-6 사용자 확인, 이후 새 요청 대기 (디자인 원본이 생기면 Phase 2 재수행)
- **막힌 부분**: 없음 (Phase 2는 2026-11-25 사용자 결정으로 건너뜀)

---

## Phase 1. 초기 구성

- [x] 1-1. Vite + React + TypeScript 프로젝트 생성 (`npm create vite@latest`)
- [x] 1-2. `AGENTS.md` 4장 폴더 구조 기준으로 필요한 폴더 생성
- [x] 1-3. `types/index.ts`에 기본 타입 작성 (`design.md` 3장 기준)
- [x] 1-4. 기본 템플릿 코드 정리 (Vite 예제 파일 삭제)
- [x] 1-5. `Layout` 뼈대 구현 (`#wrap` > `#header` / `#container` / `#footer` / `#modalWrap`, `design.md` 1.2)
- [x] 1-6. `common.css`에 디자인 토큰 작성 (`#wrap`, `design.md` 6장)
- [x] 1-7. 라우팅 설정 (React Router, `/Ia`·`/Guide`는 Layout 밖 독립 라우트)
- [x] 1-8. `/Ia` 페이지·`iaData.ts`·`ia.css` 생성 (`docs/ia-spec.md` 기준)
- [x] 1-9. `/Guide` 페이지·`guide.css` 생성 (`docs/guide-spec.md` 기준)
- [x] 1-10. `/Ia` 목록 최상단에 `/Guide` 등록 및 링크 이동 확인
- [x] 1-11. `npm run build` 통과 확인

## Phase 2. 화면 분석 (코드 작성 없음)

> **2026-11-25 건너뜀 (사용자 결정):** 디자인 원본이 없어 화면 분석을 하지 않습니다. 공통 컴포넌트는 레퍼런스(shadcn/ui, publishTemplate)와 사용자 요청 기준으로 정하고, 디자인 원본이 생기면 이 Phase를 다시 수행합니다.

- [x] ~~2-1. 디자인 원본(`requirements.md` 6장) 전체 페이지 확인~~ — 건너뜀
- [x] ~~2-2. 반복되는 UI를 찾아 `design.md` 2장 표에 기록 (사용 페이지, variant·size, 상태 `제안`). 컴포넌트 이름·Props는 `docs/components/{컴포넌트명}.md` 정의를 따름~~ — 건너뜀
- [x] ~~2-3. 컴포넌트 목록 사용자 승인 → 상태 `승인`으로 변경~~ — 건너뜀
- [x] ~~2-4. 승인된 컴포넌트를 Phase 3에 작업으로 등록~~ — 건너뜀

> 시안이 페이지별로 순차 전달되면, 새 시안마다 이 Phase를 다시 수행하고 Phase 3에 작업을 추가합니다.

## Phase 3. 공통 컴포넌트 + Guide

> 컴포넌트마다 "구현 → Guide 섹션 작성 → 수동 검수(`AGENTS.md` 9.2)"를 마쳐야 체크합니다.

- [x] 3-1. 공통 Layout 셸 (참고 사이트 기준, `design.md` 1.2): Header(로고·메뉴 검색·다크모드), 왼쪽 메뉴 카드, 콘텐츠 카드 + Footer — 2026-11-24 사용자 확인 완료. 모바일 메뉴 방식·Footer 내용은 디자인 확정 후 별도 작업
- [x] 3-2. `Button` (size·shape·disabled) + Guide `#button` — 2026-11-24 사용자 확인 완료
- [x] 3-3. `Card` (title·size·action) + Guide `#card` — 2026-11-24 사용자 확인 완료
- [x] 3-4. `Chip` (solid 6색) + Guide `#chip` — 2026-11-24 사용자 확인 완료
- [x] 3-5. `Table` (세로형 sub) + Guide `#table` — 2026-11-24 사용자 확인 완료
- [x] 3-6. `Input` (label·helpText·오류·required·disabled) + Guide `#input` — 2026-11-24 사용자 확인 완료
- [x] 3-7. `Checkbox` (label·on·disabled·오류) + Guide `#checkbox` — 2026-11-24 사용자 확인 완료
- [x] 3-8. shadcn/ui 참고 공통 컴포넌트 24종 + Guide 섹션 (사용자 요청, 2026-11-25): Accordion·Alert·Avatar·Breadcrumb·Collapsible·DropdownMenu·EmptyState·Kbd·Loading·Modal·Pagination·Popover·Portal(내부)·Progress·Radio·RangeSlider·Select·Separator·Skeleton·Switch·Tabs·Textarea·Toast(+ToastProvider·useToast)·ToggleGroup·Tooltip — 2026-11-25 사용자 확인 완료
- [x] 3-9. 콘텐츠 배치 규칙(D13, `component-ssot.md` 2.3) + 배치 컴포넌트 `Stack`·`Grid`·`Section` 신규, `Card` 확장(description·footer·padding·headingLevel), `Table` `type="result"` 상세형 + Guide `#stack`·`#grid`·`#section`·`#card`·`#table`, 간격 토큰 `--gap-sm/md/lg` (사용자 요청, 2026-11-25). 대시보드·지급 기준 화면을 배치 컴포넌트로 교체(페이지 CSS는 글자 모양·바깥 여백만 남김) — 2026-11-25 사용자 확인 완료
- [x] 3-10. 컴포넌트 스토리(`src/data/componentStories.ts`): Guide 섹션 내용을 스토리로 옮기고, 명세 화면에 탭(문서 SSOT · 샘플 · Playground · API) 추가, 왼쪽 메뉴를 배치·Atom·미구현 명세로 분리 (사용자 요청, 2026-11-25) — 2026-11-25 사용자 확인 완료
- [x] 3-11. 미구현 명세 9종 구현 + 스토리(Guide·명세 탭): Chart·DatePicker·Icon·InputStepper·ScrollArea·Slider·SortableList·TextList·TreeView, 사전 승인 라이브러리 설치(swiper·recharts·react-day-picker·date-fns·@dnd-kit) (사용자 요청, 2026-11-25) — 2026-11-25 사용자 확인 완료
- [ ] 3-12. `/Guide` 폐지: Guide.tsx·guide.css·guide-spec.md 삭제, 컴포넌트 설명·수동 검수는 명세 화면(`/spec/{컴포넌트}`) 탭, 메인 카드 링크를 명세 화면으로, IA 최상단을 메인(`/`)으로, 옛 `/Guide` 주소는 메인으로 이동(Navigate), 규칙 문서·검사 스크립트 갱신 (사용자 요청, 2026-11-25) — 사용자 확인 대기
- [ ] 3-13. {Phase 2에서 승인된 컴포넌트} + 스토리

## Phase 4. 페이지

> 페이지마다 IA 등록(`iaData.ts`)까지 같은 작업에서 완료합니다. 공통 컴포넌트가 부족하면 멈추고 Phase 2로 돌아갑니다.

- [ ] 4-1. {페이지명} (`{경로}`, US-xx)
- [ ] 4-2. {페이지명} (`{경로}`, US-xx)

- [x] 4-0. 페이지 목록(`/`)·명세 보기(`/spec/:slug`) — 참고 사이트 첫 화면 구성 (사용자 요청으로 먼저 구현, 2026-11-24). 2026-11-24 사용자 확인 완료
- [x] 4-0-2. 회원 레이아웃(`MemberLayout`) + 회원가입 샘플(`/signup`) — Card·Input·Checkbox·Button, 입력값 검사 목업 (사용자 요청, 2026-11-24). 2026-11-24 사용자 확인 완료
- [x] 4-0-3. 메인(`/`) 컴포넌트 목록 — 공통 컴포넌트 30종 실제 미리보기 카드 + Guide 링크 (사용자 요청, 2026-11-25) — 2026-11-25 사용자 확인 완료
- [ ] 4-0-6. 챗봇 샘플(`/chat`) — 질문 키워드별 답변 8종(카드형 담당자 카드 포함) + 이해 못 함, 답변을 말풍선 안에 표시, 기존 공통 컴포넌트만 사용, 목업 `src/data/chatData.ts` (사용자 요청, 2026-11-25) — 사용자 확인 대기
- [x] 4-0-5. 메인(`/`) 컴포넌트 목록에 3-11 9종(Chart·DatePicker·Icon·InputStepper·ScrollArea·Slider·SortableList·TextList·TreeView) 미리보기 추가, 목록 이름 순 자동 정렬(42종), Skeleton 미리보기 막대가 안 보이던 문제 수정 (사용자 요청, 2026-11-25) — 2026-11-25 사용자 확인 완료
- [x] 4-0-4. 지급 기준 설정 샘플(`/payout`) — Card·Button·Modal·Select·RangeSlider·Textarea·Toast 조합, 사용자 제공 이미지 구조·한글 문구·프로젝트 기본 스타일 (사용자 요청, 2026-11-25) — 2026-11-25 사용자 확인 완료
- [x] 4-0-1. 대시보드 샘플(`/dashboard`) — Button·Card·Chip·Table 조합, 목업 데이터 (사용자 요청, 2026-11-24). 2026-11-24 사용자 확인 완료

## Phase 5. 마무리

- [x] 5-1. 반응형 점검 (360px / 768px / 1024px / 1440px) — 2026-11-25 AI 점검: 일반 페이지(/, /dashboard, /signup, /spec) 4개 폭 모두 가로 넘침 없음, 메인 컴포넌트 목록 1·2·3열 전환 확인. /Guide·/Ia는 원본 명세가 데스크톱 고정폭(사이드 250px, IA min-width 1000px)이라 768px 미만에서 넘침 → 데스크톱 전용으로 유지(사용자 결정) — 2026-11-25 사용자 확인 완료
- [x] 5-2. 접근성 점검 (`alt`, 키보드 포커스) — 2026-11-25 AI 점검: 6개 화면에서 alt 누락·이름 없는 버튼/링크·라벨 없는 입력·중복 id·양수 tabindex 없음. Header 메뉴 검색의 닫힌 목록을 가리키던 aria-controls 수정. 실제 Tab 이동·포커스 표시는 사용자 확인 — 2026-11-25 사용자 확인 완료
- [x] 5-3. 하드코딩된 색상, 텍스트를 변수와 상수로 정리 — 2026-11-25: common.css·TSX에 토큰 밖 색상 없음, 남은 px 글자 크기 4곳을 토큰(--font-size-2xs·lg·3xl)으로 교체. ia.css·guide.css는 원본 명세 값 유지
- [x] 5-4. `console.log` 제거, `npm run lint` 통과 — 2026-11-25
- [x] 5-5. `npm run build` 최종 확인 — 2026-11-25
- [x] 5-6. 문서와 실제 코드가 일치하는지 확인 (requirements, design 업데이트) — 2026-11-25: design.md 1.3 폴더·4장 상태·9.2 훅, AGENTS.md 9.1 검사 표 갱신
- [x] 5-7. IA(`src/data/iaData.ts`) 화면 목록·경로·상태가 실제 라우트와 tasks.md 완료 기록과 일치하는지 확인 — 2026-11-25: 라우트 6개(/Ia 제외 5개) = IA 5행 = requirements 4장, 전부 Done
- [x] 5-8. `/Guide` 최상단 등록, IA 필터·집계·미리보기, Guide 앵커·예제 및 CSS 격리 확인 — 2026-11-25 AI 점검: IA 첫 행 /Guide, 집계 Done 5, Guide #popover 앵커 이동, Guide 예제 #wrap.guideScope 적용. IA 필터·미리보기 클릭은 사용자 확인 — 2026-11-25 사용자 확인 완료
- [x] 5-9. `node scripts/check-project.mjs` 실행 후 결과 확인 (정적 보조 검사, `AGENTS.md` 9.1) — 2026-11-25: 스크립트 작성, 통과 11 · 경고 0 · 오류 0 (위반 파일을 넣어 오류 검출도 확인)
- [x] 5-10. 빌드 파일 나누기: 페이지 지연 로딩(React.lazy), 메뉴용 분류표 분리·스토리 동적 import, 라이브러리별 파일 묶음(vite.config.ts) — 500kB 경고 해소 (사용자 요청, 2026-11-25) — 2026-11-25 사용자 확인 완료
- [ ] 5-11. GitHub 업로드(https://github.com/codoly83/claudeTest) + GitHub Pages 자동 배포(https://codoly83.github.io/claudeTest/) — 워크플로, 하위 경로 대응 (사용자 요청, 2026-11-25) — 2026-11-25 첫 배포 성공(Actions run 45568505948), 사용자 확인 대기

---

## 완료 기록

| 날짜 | 작업 | 메모 |
|---|---|---|
| 2026-11-24 | Phase 1 (1-1~1-11) | create-vite 9(React 19·Vite 8·TS 7·oxlint) + react-router-dom 7. 한글 경로에서 빌드 도구가 강제 종료되어 `C:\dev\publish-project`로 이전. 1-3은 IA 타입만 작성(design.md 3장 예시 타입은 쓰일 때 추가). Guide 메뉴 활성화는 섹션이 생기는 Phase 3에서 확인. |
| 2026-11-24 | 3-1 Layout 셸 구현 (사용자 요청으로 Phase 2보다 먼저) | 참고 사이트 루트 화면 구조·색상·다크모드 값 반영. Header·SideMenu·Footer는 layout 컴포넌트(공통 컴포넌트 아님). 메뉴 데이터 `navData.ts`는 비어 있음. 검색·활성 메뉴·스크롤은 임시 메뉴 데이터로 확인 후 원복. |
| 2026-11-24 | 4-0 페이지 목록·명세 보기 | 메뉴 53개(기본설정 6·Layout 2·페이지 기능 3·Hooks 7·컴포넌트 32·SSOT 문서 3)를 `docs/*.md`에서 바로 읽어 표시. 검색은 메뉴명+본문. IA에 홈·명세 등록(상태 Undone). 마크다운 변환기 `utils/renderMarkdown.tsx` 직접 구현. |
| 2026-11-25 | Phase 5 마무리 (5-3~5-7, 5-9 완료 / 5-1·5-2·5-8 확인 대기) | `scripts/check-project.mjs` 작성(9.1 항목 11개). 글자 크기 토큰 3개 추가, Header 검색 aria-controls 수정, 문서(design 1.3·4·9.2, AGENTS 9.1) 동기화. 4개 폭 가로 넘침·접근성 자동 점검 |
| 2026-11-25 | Phase 2 건너뜀 | 사용자 결정: 디자인 원본이 없어 화면 분석 생략. 컴포넌트는 레퍼런스·요청 기준 |
| 2026-11-25 | 5-10 빌드 파일 나누기 (2026-11-25 사용자 확인 완료) | 사용자 요청. 페이지 React.lazy, 메뉴용 componentCatalog.ts 분리·스토리 동적 import, vite.config.ts 라이브러리별 묶음. 1,310kB 단일 파일 → 500kB 경고 해소, 대시보드 첫 화면 JS 401kB. check-project 분류표 검사 추가(12개). |
| 2026-11-25 | 4-0-5 메인 컴포넌트 목록 9종 추가 (2026-11-25 사용자 확인 완료) | 사용자 요청. 42종, 이름 순 자동 정렬. 카드 안 Slider 폭 넘침·Skeleton 미리보기 막대 폭 0 수정, 배치 컴포넌트 미리보기 폭 채움. |
| 2026-11-25 | 3-11 미구현 명세 9종 구현 (2026-11-25 사용자 확인 완료) | 사용자 요청. Chart(recharts)·DatePicker(react-day-picker·date-fns, range 통합)·Slider(swiper)·SortableList·TreeView 드래그(@dnd-kit) — 사전 승인 라이브러리 설치. Icon·InputStepper·ScrollArea·TextList 직접 구현, 아이콘 11종 추가. 스토리 storiesAtomPlus.tsx. Tabs 패널 폭 넘침·기간 끝 날짜 글자색 수정. PageChangePanel은 보류. |
| 2026-11-25 | 5-1·5-2·5-8 반응형·접근성·IA/Guide 점검 (2026-11-25 사용자 확인 완료) | AI 자동 점검 결과를 사용자가 직접 확인. /Guide·/Ia는 데스크톱 전용(사용자 결정). |
| 2026-11-25 | 3-9 배치 컴포넌트(D13), 4-0-4 지급 기준 설정 (2026-11-25 사용자 확인 완료) | 사용자 요청. Stack·Grid·Section 신규, Card(description·footer·padding·headingLevel)·Table(type="result") 확장, 간격 토큰 --gap-sm/md/lg. 대시보드·지급 기준 화면을 배치 컴포넌트로 교체. /payout: 현재 기준 Card(상세형 Table) + 설정 Modal(Select·RangeSlider·Textarea), 저장 시 Toast. RangeSlider 트랙 클릭·드래그 이동 추가. |
| 2026-11-25 | 3-10 컴포넌트 스토리·명세 탭·메뉴 분류 (2026-11-25 사용자 확인 완료) | 사용자 요청. Guide 섹션 내용을 `src/data/componentStories.ts`(storiesLayout·storiesAtom)로 옮겨 Guide와 명세 화면이 함께 사용. 명세 화면에 문서·샘플·Playground·API 탭, 왼쪽 메뉴 배치 5·Atom 29·미구현 10. 밑줄형 Tabs 1px 세로 스크롤 수정, 스토리 파일만 Fast Refresh 경고 규칙 제외, check-project 스토리 id 검사로 변경. |
| 2026-11-25 | 3-8 shadcn/ui 참고 컴포넌트 24종 + Guide, 4-0-3 메인 컴포넌트 목록 (2026-11-25 사용자 확인 완료) | 사용자 요청. 라이브러리 설치 없이 구현, 아이콘 12종은 Lucide 도형 SVG를 `src/assets/icons`에 보관. 공용: `utils/classNames.ts`, `hooks/useScrollLock.ts`·`useToast.ts`, `providers/ToastProvider.tsx`(Layout·MemberLayout·Guide). Header 다크모드 스위치를 Switch로 교체. 브라우저에서 Modal(포커스 이동·ESC·포커스 복귀·스크롤 잠금)·Toast·DropdownMenu 키보드·Tabs 방향키·Tooltip hover·Popover·다크모드 확인. |
| 2026-11-24 | 3-6·3-7 Input·Checkbox + Guide, 4-0-2 회원 레이아웃·회원가입 | 사용자 요청. 회원가입 1곳에서 쓰지만 로그인 등 회원 화면에서 재사용할 컴포넌트로 공통화. 다크모드 상태를 `hooks/useTheme.ts`로 분리(두 레이아웃 공유), Header에 `hasSearch` 추가, 리셋 범위를 `#wrap.pageLayout`으로 변경. 빈 제출·오류 표시·첫 오류 포커스·입력 중 재검사·전체 동의(Space)·완료 화면·다크모드 확인. |
| 2026-11-24 | 3-2~3-5 Button·Card·Chip·Table + Guide, 4-0-1 대시보드 | 사용자 요청으로 Phase 2 승인 없이 진행(참고 사이트 대시보드 기준, 사용처 Home·Dashboard). 요청된 화면에 필요한 옵션만 구현(각 `docs/components/*.md` "구현 범위"). Home 표·상태를 Table·Chip으로 교체. `common.css`를 `#wrap.siteLayout`(레이아웃·리셋)·`#wrap`(컴포넌트)으로 나누고 Guide 예제 영역을 `#wrap.guideScope`로 감쌈. |

## 나중에 할 것 (Backlog)

- [ ] 실제 API 연동
- [x] 다크 모드 (2026-11-24, 3-1)
- [ ] {추가 아이디어}

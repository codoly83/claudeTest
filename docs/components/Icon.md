# Icon

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 7장 결정 D1~D12)
> 출처: <https://codoly83.github.io/publishTemplate/guide/icon>
> 상태: **구현됨** — `src/components/common/Icon.tsx`, 명세 화면 탭(샘플·Playground·API, 스토리 id `icon`) (2026-11-25). 구현 범위는 아래 "구현 범위" 참고.
> 마지막 수정: 2026-11-25

---

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/common/Icon.tsx` |
| 스토리 id | `icon` |
| 원본 variant·size | sm/md/lg |
| 외부 의존 | — |
| 판정 | **구현됨 (2026-11-25)** |

## 정의

- **위치 / 스토리 id:** `common/Icon.tsx` / `#icon`
- **원본:** `src/assets/icons/` 32종 (`admin`, `ai-agent-line`, `arrow-down`, `arrow-left-line`, `arrow-left-right`, `attachment`, `btn-close`, `calculator-on`, `calendar`, `check-line`, `check-mark`, `checkbox-circle-fill`, `checkbox-circle-line`, `checkbox-circle`, `close-circle`, `datepicker-left-double`, `datepicker-left`, `datepicker-right-double`, `datepicker-right`, `desktop-icon`, `error-warning-fill`, `error-warning`, `identification-on`, `loader`, `logo`, `menu-fold`, `menu-unfold`, `options`, `search`, `send`, `user-settings`, `waiting-on`), `size: sm(16)|md(24)|lg(48) | number`
- **SSOT 조건**
  - 파일명은 AGENTS 5.4 예시(`iconSearch.svg`)에 맞춰 **camelCase로 변환**: `arrow-left-right.svg` → `iconArrowLeftRight.svg`. 에셋은 **디자인 원본에서 받은 파일만** 사용
  - `size`에 임의 숫자 금지(고정값 인라인 금지) → `'sm' | 'md' | 'lg'`만
  ```ts
  type IconName = 'search' | 'calendar' | 'attachment' /* …에셋 목록과 1:1 */;
  interface IconProps { name: IconName; size?: 'sm' | 'md' | 'lg'; label?: string; }  // label 없으면 장식용 aria-hidden
  ```
  - 색상 변경이 필요하면 [component-ssot.md](../component-ssot.md) 4장 SVG 색상 ② 방식(CSS mask + `currentColor`)
  - `IconName` 유니온은 여러 파일에서 쓰므로 `src/types/index.ts`

## 구현 범위 (2026-11-25)

- 사용자 요청("미구현 명세도 정상적으로 나오게", 라이브러리 설치 승인)으로 구현했습니다. 스토리: `src/data/storiesAtomPlus.tsx`.
- Props: `name`(IconName 25종), `size`(sm 16·md 24·lg 48px, 기본 md), `label`.
- 메모: 에셋은 Lucide 도형 SVG(ISC, `src/assets/icons/LICENSE-lucide.txt`) — 디자인 원본이 생기면 같은 이름으로 교체. CSS mask + `currentColor`(색은 부모 글자색). `IconName`은 `src/types/index.ts`. 원본 32종 이름 목록 대신 현재 보유 25종(`iconSearch` 등 파일명 그대로).

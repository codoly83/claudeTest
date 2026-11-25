# Loading

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 7장 결정 D1~D12)
> 출처: <https://codoly83.github.io/publishTemplate/guide/loading>
> 상태: **구현됨(일부)** — `src/components/common/Loading.tsx`, 스토리 id `loading` (2026-11-25, shadcn/ui 참고). 구현 범위는 아래 "구현 범위" 참고.
> 마지막 수정: 2026-11-25

---

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/common/Loading.tsx` |
| 스토리 id | `loading` |
| 원본 variant·size | fullscreen/area |
| 외부 의존 | — |
| 판정 | 채택 가능 |

## 정의

- **위치 / 스토리 id:** `common/Loading.tsx` / `#loading`
- **원본 옵션:** `loading`, `label`, `fullscreen`(기본 true) / `fullscreen={false}`면 children 영역만 덮음
- **Props (SSOT)**
  ```ts
  interface LoadingProps {
      isLoading: boolean;
      label?: string;              // 기본 '로딩 중'
      isFullscreen?: boolean;      // 기본 true → #modalWrap Portal
      children?: ReactNode;        // 영역 로딩일 때 감쌀 콘텐츠
  }
  ```
- **접근성:** `role="status"` + `aria-live="polite"`, 영역 로딩은 콘텐츠에 `aria-busy="true"`. 전체 로딩 중 배경 스크롤 잠금(5.1.1 규칙과 동일 처리)
- **아이콘:** 원본 `loader` 에셋 사용, 회전은 CSS animation

## 구현 범위 (2026-11-25)

- 구현: SSOT Props 전체. 아이콘은 shadcn/ui Spinner와 같은 `iconLoader`(Lucide 도형) CSS 회전, 전체 화면은 `#modalWrap` Portal + `useScrollLock`.

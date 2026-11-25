# Skeleton

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 7장 결정 D1~D12)
> 출처: <https://codoly83.github.io/publishTemplate/guide/skeleton>
> 상태: **구현됨(일부)** — `src/components/common/Skeleton.tsx`, 스토리 id `skeleton` (2026-11-25, shadcn/ui 참고). 구현 범위는 아래 "구현 범위" 참고.
> 마지막 수정: 2026-11-25

---

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/common/Skeleton.tsx` |
| 스토리 id | `skeleton` |
| 원본 variant·size | default/muted · shape 프리셋 |
| 외부 의존 | — |
| 판정 | 채택 가능 (D8 프리셋) |

## 정의

- **위치 / 스토리 id:** `common/Skeleton.tsx` / `#skeleton`
- **원본 옵션:** `variant: default|muted`, `rounded: md|lg|full`, 크기는 className(`h-4 w-full`)
- **SSOT 조건:** 크기용 className 금지 + 고정 값 인라인 금지 → **형태 프리셋으로 변환**
  ```ts
  interface SkeletonProps {
      variant?: 'default' | 'muted';
      shape?: 'text' | 'title' | 'avatar' | 'button' | 'image';   // 디자인 확정 후 값 조정
  }
  ```
- **접근성:** 장식용 `aria-hidden="true"`, 감싸는 영역에 `aria-busy`. 펄스 애니메이션은 `prefers-reduced-motion`에서 정지
- **D8 결정:** 크기는 `shape` 프리셋 클래스로만 지정. 프리셋 목록은 디자인 원본 기준으로 확정

## 구현 범위 (2026-11-25)

- 구현: `variant`(default·muted), `shape` 프리셋(text 100%×16 / title 60%×24 / avatar 40 원형 / button 96×36 / image 100%×120). 펄스는 `prefers-reduced-motion`에서 정지.

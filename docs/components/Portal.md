# Portal — 내부 유틸

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 7장 결정 D1~D12)
> 출처: <https://codoly83.github.io/publishTemplate/guide/portal>
> 상태: **구현됨(일부)** — `src/components/common/Portal.tsx`, 스토리 id `portal` (2026-11-25, shadcn/ui 참고). 구현 범위는 아래 "구현 범위" 참고.
> 마지막 수정: 2026-11-25

---

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/common/Portal.tsx` |
| 스토리 id | `portal` |
| 원본 variant·size | — |
| 외부 의존 | — |
| 판정 | 대상 고정(`#modalWrap`) 내부 유틸 |

## 정의

- **원본:** `container` 미지정 시 `document.body`, `#id`/`.class` 셀렉터, `usePortalContainer`(body에 컨테이너 자동 생성), `enabled`
- **SSOT 조건:** `document.body` Portal 금지(5.1.1, 9.1 자동 검사 대상). 대상은 **`#modalWrap` 고정**, `container`·`usePortalContainer` 제거. Modal·Toast·Loading 2곳 이상에서 쓰므로 공통화하되 스토리에는 category `internal`(내부 유틸)로 기록.
  ```ts
  interface PortalProps { children: ReactNode; }   // 대상: document.getElementById('modalWrap')
  ```

## 구현 범위 (2026-11-25)

- 구현: `children`만 받고 대상은 `#modalWrap` 고정(`MODAL_ROOT_ID`). 대상이 같은 렌더에서 만들어질 때를 위해 `useSyncExternalStore`로 마운트 직후 다시 확인. 스토리 id `portal`(category internal, 명세 메뉴는 Atom 묶음).

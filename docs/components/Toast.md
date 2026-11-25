# Toast

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 7장 결정 D1~D12)
> 출처: <https://codoly83.github.io/publishTemplate/guide/toast>
> 상태: **구현됨(일부)** — `src/components/common/Toast.tsx`, 스토리 id `toast` (2026-11-25, shadcn/ui 참고). 구현 범위는 아래 "구현 범위" 참고.
> 마지막 수정: 2026-11-25

---

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/common/Toast.tsx` |
| 스토리 id | `toast` |
| 원본 variant·size | default/success/info/warning/error · position 6 |
| 외부 의존 | sonner 대신 직접 구현 (`providers/ToastProvider.tsx`) |
| 판정 | 채택 가능 |

## 정의

- **위치 / 스토리 id:** `common/Toast.tsx`(표시 UI) + `providers/ToastProvider.tsx`(Context, D9) + `hooks/useToast.ts` / `#toast`
- **원본 옵션:** sonner — 루트에 `<Toast />` 1회 마운트, `toast()`, `toast.success/info/warning/error`, `position`(top/bottom × left/center/right) 기본·개별, `toast.promise`
- **SSOT 조건:** sonner 대신 **React Context로 직접 구현** (전역 상태 라이브러리 금지, Context는 허용). Provider는 `src/providers/ToastProvider.tsx`에 두고 `Layout.tsx`에서 1회 감쌉니다 (D9).
  ```ts
  type ToastType = 'default' | 'success' | 'info' | 'warning' | 'error';
  type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  interface ToastOptions { type?: ToastType; position?: ToastPosition; duration?: number; }
  // useToast() → { showToast: (message: string, options?: ToastOptions) => void }
  ```
  - 렌더링 위치: **`#modalWrap` Portal** (Layout 안에 Provider 1회)
  - 접근성: 컨테이너 `role="status"` `aria-live="polite"`, error는 `role="alert"`. 자동 닫힘 시간 + 닫기 버튼
  - `toast.promise`는 디자인·요구사항에 있을 때만

## 구현 범위 (2026-11-25)

- 구현: `Toast.tsx`(표시 UI) + `providers/ToastProvider.tsx` + `hooks/useToast.ts`(Context 포함 — Fast Refresh 규칙상 Provider 파일은 컴포넌트만 내보냄). type 5종·position 6종·`duration`(기본 `TOAST_DURATION` 4000ms)·닫기 버튼.
- Provider는 Layout·MemberLayout에 1회씩. 위치별 목록(`role="status"` `aria-live="polite"`)을 항상 렌더링하고 error 항목은 `role="alert"`. 아직 구현하지 않음: `toast.promise`.

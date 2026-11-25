# Modal

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 7장 결정 D1~D12)
> 출처: <https://codoly83.github.io/publishTemplate/guide/alert-dialog>, <https://codoly83.github.io/publishTemplate/guide/modal>
> 상태: **구현됨(일부)** — `src/components/common/Modal.tsx`, 스토리 id `modal` (2026-11-25, shadcn/ui 참고). 구현 범위는 아래 "구현 범위" 참고.
> 마지막 수정: 2026-11-25

---

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/common/Modal.tsx` |
| 스토리 id | `modal` |
| 원본 variant·size | alert/small/medium/large/full |
| 외부 의존 | Radix → 직접 구현 |
| 판정 | 채택 가능 |

## 정의

- **위치 / 스토리 id:** `common/Modal.tsx` / `#modal`
- **원본 옵션:** `size: alert|small|medium(기본)|large|full`, `ModalTrigger`/외부 상태(`open`, `onOpenChange`), `ModalHeader/Title/Body/Footer/Close`
- **Props (SSOT)**
  ```ts
  interface ModalProps {
      isOpen: boolean;
      onClose: () => void;
      size?: 'alert' | 'small' | 'medium' | 'large' | 'full';   // 기본 'medium'
      title?: string;                // alert는 제목 없음 → 시각적 숨김 제목 필수(aria-labelledby)
      footer?: ReactNode;            // 버튼 영역
      children: ReactNode;
  }
  ```
- **필수 동작 (AGENTS 5.1.1):** `#modalWrap` Portal, `role="dialog"`(alert는 `"alertdialog"`), `aria-modal="true"`, `aria-labelledby`, ESC 닫기, 열면 내부 포커스·포커스 트랩, 닫으면 연 버튼으로 포커스 복귀, `body.style.overflow` 잠금/복원
- **Trigger 방식 제외:** 원본의 `ModalTrigger asChild`는 쓰지 않고 항상 부모 `useState`로 연다
- **9.2:** 오버레이 전 항목 · size 5종 · 360px 반응형(full)

## 참고: AlertDialog 통합 (D6)

- 원본 AlertDialog와 Modal `size="alert"`는 같은 역할입니다. AGENTS 5.1 "같은 기능의 공통 컴포넌트 중복 금지"에 따라 **Modal의 `size="alert"`로 통합**하고 `role="alertdialog"`를 적용합니다.

## 구현 범위 (2026-11-25)

- 구현: SSOT Props 전체, size 5종(최대 폭 alert·small 400 / medium 520 / large 800px / full 전체). `#modalWrap` Portal, ESC, 포커스 트랩, 포커스 복귀, `useScrollLock`.
- alert는 `role="alertdialog"`, 닫기 버튼·딤 클릭 닫기 없음(버튼으로만 닫기). title이 없으면 숨김 제목 "알림".

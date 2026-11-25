# Alert

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 7장 결정)
> 출처: <https://ui.shadcn.com/docs/components/alert>
> 상태: **구현됨** — `src/components/common/Alert.tsx`, 스토리 id `alert` (2026-11-25, 사용자 요청: shadcn/ui 참고 컴포넌트 추가)
> 마지막 수정: 2026-11-25

---

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/common/Alert.tsx` |
| 스토리 id | `alert` |
| 원본 variant·size | default/destructive → default/error |
| 외부 의존 | Radix·Lucide → 직접 구현, 아이콘은 `src/assets/icons` SVG |
| 판정 | 채택 (메인 컴포넌트 목록·명세 화면) |

## 정의

- **위치 / 스토리 id:** `common/Alert.tsx` / `#alert`
- **Props (SSOT)**
  ```ts
  interface AlertProps {
      title: string;
      variant?: 'default' | 'error';   // 원본 destructive → error
      children?: ReactNode;            // 설명
  }
  ```
- **마크업·클래스:** `div.alert(.default|.error) > span.iconMask.alertIcon + div.alertBody > strong.alertTitle + div.alertDesc`
- **접근성·조건:** error만 `role="alert"`(즉시 읽기), default는 일반 안내 영역. 아이콘 장식용 `aria-hidden`.
- **스타일:** `common.css` 03 섹션, `#wrap` 토큰만 사용 (다크모드 자동 전환)

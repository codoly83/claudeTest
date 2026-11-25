# Button

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 7장 결정 D1~D12)
> 출처: <https://codoly83.github.io/publishTemplate/guide/button>
> 상태: **구현됨(일부)** — `src/components/common/Button.tsx`, 스토리 id `button` (2026-11-24). 구현 범위는 아래 "구현 범위" 참고.
> 마지막 수정: 2026-11-24

---

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/common/Button.tsx` |
| 스토리 id | `button` |
| 원본 variant·size | variant 4 · color 4 · size 3 · shape 2 |
| 외부 의존 | — |
| 판정 | 채택 가능 |

## 정의

- **위치 / 스토리 id:** `common/Button.tsx` / `#button`
- **원본 옵션:** `variant: default|outline|text|ghost`, `color: default|black|gray|grayBg`, `size: default|md|sm`, `shape: default|square`, `disabled`, 아이콘+텍스트 / 아이콘 전용
- **Props (SSOT)**
  ```ts
  interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color' | 'className'> {
      variant?: 'default' | 'outline' | 'text' | 'ghost';   // 기본 'default'
      color?: 'default' | 'black' | 'gray' | 'grayBg';      // 기본 'default'
      size?: 'lg' | 'md' | 'sm';                            // 원본 'default' → 'lg' (명시적 이름), 기본 'lg'
      shape?: 'default' | 'square';                         // 기본 'default'
      children: ReactNode;                                  // 아이콘+텍스트 조합이 있으므로 children
  }
  ```
- **조합 제약 (원본 기준):** `color="gray"`·`"grayBg"`는 `variant="outline"`에서만, `color="black"`은 `variant="default"`에서만 사용. 아이콘 전용 버튼은 `aria-label` 필수.
- **마크업·클래스:** `button.btn.{variant}.{color}.{size}.{shape}` — 기본값은 클래스 생략. 상태: `disabled` 속성 + `.disabled`
- **기본값:** `type="button"` (AGENTS 1.1 Base 접근성)
- **9.2:** 모양(4×4×3×2 조합 중 원본에 있는 것 전부 샘플) · disabled · 포커스 표시
- **D7 결정:** 원본 size `default` → `lg`.

## 구현 범위 (2026-11-24)

- 구현: `size`(`lg`·`md`·`sm`, 기본 `lg`), `shape`(`default`·`square`), `disabled`, button 기본 속성(`type` 기본 `button`, `onClick` 등).
- 아직 구현하지 않음: `variant`(`outline`·`text`·`ghost`), `color`(`black`·`gray`·`grayBg`) — 디자인에서 필요해지면 추가하고 스토리를 갱신합니다.
- 모양: 그라데이션 배경(`--gradient-primary`), 글자 `--color-on-primary`, 둥근형 `border-radius: 9999px` / square `8px`, disabled 투명도 0.4.

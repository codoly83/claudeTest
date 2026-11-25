# Slider (범위 선택) → RangeSlider

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 7장 결정 D1~D12)
> 출처: <https://codoly83.github.io/publishTemplate/guide/slider>
> 상태: **구현됨(일부)** — `src/components/common/RangeSlider.tsx`, 스토리 id `rangeSlider` (2026-11-25, shadcn/ui 참고). 구현 범위는 아래 "구현 범위" 참고.
> 마지막 수정: 2026-11-25

---

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/common/RangeSlider.tsx` |
| 스토리 id | `rangeSlider` |
| 원본 variant·size | sm/md/lg · range · vertical |
| 외부 의존 | Radix → native range |
| 판정 | 채택 가능 (D5 이름 확정) |

## 정의

- **이름 (D5):** `Slider` = Swiper 캐러셀(design.md 유지), 원본의 범위 슬라이더 = **`RangeSlider`**.
- **원본 옵션:** `defaultValue[]`, `min/max/step`, `size: sm|md|lg`, 범위(thumb 2개, `minStepsBetweenThumbs`), `orientation: vertical`, `value/onValueChange`, `disabled`
- **Props (SSOT)**
  ```ts
  interface RangeSliderProps {
      value: number[];                    // [50] 단일 / [25, 75] 범위
      onChange?: (value: number[]) => void;
      min?: number;                       // 기본 0
      max?: number;                       // 기본 100
      step?: number;                      // 기본 1
      minGap?: number;                    // 원본 minStepsBetweenThumbs
      size?: 'sm' | 'md' | 'lg';          // 기본 'md'
      orientation?: 'horizontal' | 'vertical';
      label: string;                      // aria-label
      disabled?: boolean;
  }
  ```
- **구현:** 네이티브 `input[type=range]`(범위는 2개 겹침). 채워진 트랙 길이는 값에서 계산 → `--range-start/--range-end` CSS 변수 인라인 = **인라인 예외 기록**
- **트랙 클릭 (2026-11-25):** 손잡이뿐 아니라 트랙(바)을 눌러도 그 위치(step 단위)로 가장 가까운 손잡이가 이동하고 포커스가 옮겨지며, 누른 채 끌면 계속 따라갑니다(Pointer Capture). 손잡이를 직접 잡을 때는 네이티브 동작을 그대로 씁니다.

## 구현 범위 (2026-11-25)

- 구현: `value`(1개 단일·2개 범위), `onChange`, `label`, `min`·`max`·`step`, `minGap`, `size` sm·md·lg, `disabled`. 범위 입력의 aria-label은 "{label} 최솟값/최댓값".
- 인라인 예외: `--range-start`·`--range-end` (design.md 6.2 기록). 아직 구현하지 않음: `orientation: vertical`.

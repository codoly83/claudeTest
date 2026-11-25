# Swiper → Slider (사전 승인)

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 7장 결정 D1~D12)
> 출처: <https://codoly83.github.io/publishTemplate/guide/swiper>
> 상태: **구현됨** — `src/components/common/Slider.tsx`, 명세 화면 탭(샘플·Playground·API, 스토리 id `slider`) (2026-11-25). 구현 범위는 아래 "구현 범위" 참고.
> 마지막 수정: 2026-11-25

---

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/common/Slider.tsx` |
| 스토리 id | `slider` |
| 원본 variant·size | 디자인 기준 |
| 외부 의존 | swiper (**사전 승인됨**) |
| 판정 | **구현됨 (2026-11-25)** |

## 정의

- **위치 / 스토리 id:** `common/Slider.tsx` / `#slider` (design.md 2장·8장 이름 유지)
- **원본 옵션:** Navigation / Pagination(clickable) / Scrollbar(draggable) / loop / Autoplay(`delay`, `disableOnInteraction`, `pauseOnMouseEnter`) / 외부 재생·정지 토글 / Keyboard / breakpoints / 외부 컨트롤(`slidePrev/Next/To`, `realIndex`) / 컨트롤 바 분리 / `autoHeight` / Peek(`slidesPerView: 1.2`, `centeredSlides`, `grabCursor`)
- **SSOT 조건 (AGENTS 5.6, design.md 8장)**
  ```ts
  interface SliderProps<T extends { id: string }> {
      items: T[];
      renderItem: (item: T) => ReactNode;
      label: string;                                  // aria-label (캐러셀 이름)
      options?: Omit<SwiperProps, 'children'>;        // 디자인·요구사항에 있는 옵션만 페이지에서 전달
  }
  ```
  - 모듈(Autoplay·Navigation·Pagination·Scrollbar·Keyboard)은 **디자인·요구사항에 있을 때만** 사용
  - **Autoplay 사용 시 정지 버튼 필수** (AGENTS 5.6 접근성) — 원본 lucide `Play/Square` 대신 디자인 에셋
  - 반응형은 `breakpoints`(모바일 기본 → 768 → 1024)
  - Swiper 스타일 재정의는 `common.css` 06 섹션, `#wrap .slider .swiper-…`로 범위 한정
  - 슬라이드 상태를 별도 state로 중복 관리하지 않음 (인덱스 표시가 디자인에 있을 때만 `onSlideChange`)

## 구현 범위 (2026-11-25)

- 사용자 요청("미구현 명세도 정상적으로 나오게", 라이브러리 설치 승인)으로 구현했습니다. 스토리: `src/data/storiesAtomPlus.tsx`.
- Props: `items`, `renderItem`, `label`, `options`(SwiperProps: navigation·pagination·autoplay·loop·slidesPerView·breakpoints·keyboard·onSlideChange 등).
- 메모: swiper 14 `swiper/react`. 모듈 A11y·Autoplay·Keyboard·Navigation·Pagination을 등록해 두고 **옵션을 넘길 때만 동작**(디자인에 있는 것만). A11y 한국어 안내 문구. `options.autoplay`가 있으면 정지/재생 버튼(`.sliderPlay`, iconPause·iconPlay) 표시. 공식 CSS(swiper/css, navigation, pagination, a11y) import 후 `common.css` 06 섹션에서 `#wrap .slider` 범위로 색만 재정의.

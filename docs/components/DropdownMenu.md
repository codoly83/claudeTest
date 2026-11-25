# DropdownMenu

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 7장 결정)
> 출처: <https://ui.shadcn.com/docs/components/dropdown-menu>
> 상태: **구현됨** — `src/components/common/DropdownMenu.tsx`, 스토리 id `dropdownMenu` (2026-11-25, 사용자 요청: shadcn/ui 참고 컴포넌트 추가)
> 마지막 수정: 2026-11-25

---

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/common/DropdownMenu.tsx` |
| 스토리 id | `dropdownMenu` |
| 원본 variant·size | — |
| 외부 의존 | Radix·Lucide → 직접 구현, 아이콘은 `src/assets/icons` SVG |
| 판정 | 채택 (메인 컴포넌트 목록·명세 화면) |

## 정의

- **위치 / 스토리 id:** `common/DropdownMenu.tsx` / `#dropdownMenu`
- **Props (SSOT)**
  ```ts
  interface DropdownMenuItem { id: string; label: string; onSelect?: () => void; disabled?: boolean; isDanger?: boolean; }
  interface DropdownMenuProps {
      label: string;                 // 트리거 문구
      items: DropdownMenuItem[];
      align?: 'start' | 'end';       // 기본 'start'
  }
  ```
- **마크업·클래스:** `div.dropdown > button.dropdownTrigger(.on)[aria-haspopup=menu][aria-expanded] + div.dropdownMenu.{align}[role=menu] > button.dropdownItem(.danger|.disabled)[role=menuitem]`
- **접근성·조건:** WAI-ARIA Menu Button: ↓·Enter·Space 열고 첫 항목, ↑ 열고 마지막 항목, 메뉴 안 ↑↓·Home·End, ESC 닫고 트리거로 포커스, Tab 닫기, 바깥 클릭 닫기. Portal 없이 트리거 아래. 원본의 체크·라디오 항목·하위 메뉴·단축키 표시는 제외.
- **스타일:** `common.css` 03 섹션, `#wrap` 토큰만 사용 (다크모드 자동 전환)

# Avatar

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 7장 결정)
> 출처: <https://ui.shadcn.com/docs/components/avatar>
> 상태: **구현됨** — `src/components/common/Avatar.tsx`, 스토리 id `avatar` (2026-11-25, 사용자 요청: shadcn/ui 참고 컴포넌트 추가)
> 마지막 수정: 2026-11-25

---

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/common/Avatar.tsx` |
| 스토리 id | `avatar` |
| 원본 variant·size | size 기본/sm/lg |
| 외부 의존 | Radix·Lucide → 직접 구현, 아이콘은 `src/assets/icons` SVG |
| 판정 | 채택 (메인 컴포넌트 목록·명세 화면) |

## 정의

- **위치 / 스토리 id:** `common/Avatar.tsx` / `#avatar`
- **Props (SSOT)**
  ```ts
  interface AvatarProps {
      name: string;                 // img alt, 머리글자 원본
      src?: string;
      size?: 'sm' | 'md' | 'lg';    // 24 / 32 / 48px, 기본 'md'
  }
  ```
- **마크업·클래스:** `span.avatar.{size} > img.avatarImage | span.avatarFallback[role=img][aria-label]`
- **접근성·조건:** 이미지 로드 실패 시 머리글자(한글 1자, 영문 2자 또는 두 단어 첫 글자)로 전환. 이미지 에셋은 디자인 원본에서 받습니다.
- **스타일:** `common.css` 03 섹션, `#wrap` 토큰만 사용 (다크모드 자동 전환)

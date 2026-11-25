# PageChangePanel — 보류

> 공통 변환 원칙·결정 기록: [component-ssot.md](../component-ssot.md) (0장 변환 원칙, 7장 결정 D1~D12)
> 출처: <https://codoly83.github.io/publishTemplate/guide/pagechangepanel>
> 상태: 보류 (관리·미리보기 도구) — 디자인 원본에서 2곳 이상 사용이 확인되면 `design.md` 2장 표로 옮기고 구현합니다. (AGENTS.md 6.4)
> 마지막 수정: 2026-11-24

---

| 항목 | 내용 |
| --- | --- |
| 파일 | — (별도 파일 없음) |
| 스토리 id | — |
| 원본 variant·size | — |
| 외부 의존 | — |
| 판정 | 관리·미리보기 도구 → 보류 |

## 정의

- **원본:** 드래그 이동 가능한 플로팅 패널, `selects: { label, value, onChange, options }[]`로 레이아웃·테마 전환
- **SSOT 판단:** 퍼블리싱 **미리보기용 관리 도구**로, 서비스 화면 컴포넌트가 아닙니다. 필요하면 Ia 전용 기능으로 승인 후 추가하며, 드래그 위치(`top/left`)는 인라인 예외 기록 대상입니다.

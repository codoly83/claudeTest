import type { SpaceSize } from '../types';

// 공용 상수 (AGENTS.md 5.2)

// Header 로고 문구 (참고 사이트 셸 기준)
export const SITE_TITLE = 'Publish Guide';

// 다크모드 선택값 저장 키 (docs/design.md 1.2)
export const THEME_STORAGE_KEY = 'ui-theme';

// 오버레이 Portal 대상 (AGENTS.md 5.1.1: #wrap 안의 #modalWrap)
export const MODAL_ROOT_ID = 'modalWrap';

// Toast 자동 닫힘 시간 (ms)
export const TOAST_DURATION = 4000;

// 배치 간격 단계 → CSS 클래스 (docs/component-ssot.md 2.3, 값은 common.css --gap-*)
export const GAP_CLASS: Record<SpaceSize, string> = { sm: 'gapSm', md: 'gapMd', lg: 'gapLg' };

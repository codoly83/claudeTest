import type { NavGroup } from '../types';
import { SPEC_GROUPS, getSpecHref } from './specData';
import { toPlainText } from '../utils/renderMarkdown';

// 왼쪽 메뉴 (docs/design.md 1.2)
// - 메뉴 카드와 Header 메뉴 검색이 이 목록을 사용합니다.
// - 맨 위 '페이지 목록'(/) 링크는 SideMenu에 고정되어 있습니다.
// - 새 일반 페이지를 만들면 같은 작업에서 src/data/iaData.ts(IA)와 PAGE_NAV_GROUPS에 함께 등록합니다.
// - href는 실제 React Router 경로와 일치해야 합니다.

// 일반 페이지 메뉴 (Phase 4에서 추가). 예: { id: 'main', title: '메인', items: [{ label: '로그인', href: '/login' }] }
const PAGE_NAV_GROUPS: NavGroup[] = [
    { id: 'samplePages', title: '샘플 페이지', items: [{ label: '대시보드', href: '/dashboard' }, { label: '회원가입', href: '/signup' }, { label: '지급 기준 설정', href: '/payout' }, { label: '챗봇', href: '/chat' }] }
];

// 명세 메뉴 (src/data/specData.ts)
const SPEC_NAV_GROUPS: NavGroup[] = SPEC_GROUPS.map((group) => ({
    id: group.id,
    title: group.title,
    items: group.items.map((item) => ({
        label: item.label,
        href: getSpecHref(item.slug),
        searchText: toPlainText(item.markdown)
    }))
}));

export const NAV_GROUPS: NavGroup[] = [...PAGE_NAV_GROUPS, ...SPEC_NAV_GROUPS];

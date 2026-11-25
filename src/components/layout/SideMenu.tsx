import { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { NAV_GROUPS } from '../../data/navData';

// 왼쪽 메뉴 카드 (docs/design.md 1.2)
// - 메뉴 목록은 src/data/navData.ts에서 관리합니다.
// - 현재 페이지 링크: on 클래스 + aria-current="page"(NavLink 기본 동작)
const SideMenu = () => {
    const { pathname } = useLocation();
    const menuRef = useRef<HTMLElement>(null);

    // 검색 등으로 페이지를 옮기면 현재 메뉴가 메뉴 카드 안에 보이도록 스크롤
    useEffect(() => {
        menuRef.current?.querySelector('.sideNavLink.on')?.scrollIntoView({ block: 'nearest' });
    }, [pathname]);

    return (
        <aside className="sideMenu" ref={menuRef}>
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'sideNavHead on' : 'sideNavHead')}>
                페이지 목록
            </NavLink>
            <nav className="sideNav" aria-label="메뉴">
                {NAV_GROUPS.length === 0 && <p className="sideNavEmpty">등록된 메뉴가 없습니다.</p>}
                {NAV_GROUPS.map((group) => (
                    <div className="sideNavGroup" key={group.id}>
                        <h2 className="sideNavTitle">
                            {group.title}
                            <span className="sideNavCount">({group.items.length})</span>
                        </h2>
                        <ul className="sideNavList">
                            {group.items.map((item) => (
                                <li key={item.href}>
                                    <NavLink to={item.href} end className={({ isActive }) => (isActive ? 'sideNavLink on' : 'sideNavLink')}>
                                        {item.label}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>
        </aside>
    );
};

export default SideMenu;

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import SideMenu from './SideMenu';
import Footer from './Footer';
import { useTheme } from '../../hooks/useTheme';
import ToastProvider from '../../providers/ToastProvider';
import '../../assets/css/common.css';

// 일반 페이지 공통 레이아웃 (docs/design.md 1.1·1.2)
// #wrap.pageLayout.siteLayout > #header / .layoutBody(.sideMenu + .contentArea(main#container + #footer)) / #modalWrap
interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const { isDark, toggleTheme } = useTheme();
    const { pathname } = useLocation();
    const wrapRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // 페이지를 옮기면 스크롤을 맨 위로 (768px 이상: 콘텐츠 카드, 모바일: #wrap)
    useEffect(() => {
        contentRef.current?.scrollTo(0, 0);
        wrapRef.current?.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div id="wrap" className="pageLayout siteLayout" data-theme={isDark ? 'dark' : 'light'} ref={wrapRef}>
            {/* Toast 상태 Provider (docs/components/Toast.md): 알림은 #modalWrap에 Portal로 렌더링 */}
            <ToastProvider>
                <Header isDark={isDark} onToggleTheme={toggleTheme} />
                <div className="layoutBody">
                    <SideMenu />
                    <div className="contentArea" ref={contentRef}>
                        <main id="container">{children}</main>
                        <Footer />
                    </div>
                </div>
                <div id="modalWrap" />
            </ToastProvider>
        </div>
    );
};

export default Layout;

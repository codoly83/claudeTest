import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useTheme } from '../../hooks/useTheme';
import ToastProvider from '../../providers/ToastProvider';
import '../../assets/css/common.css';

// 회원 화면 레이아웃 (docs/design.md 1.2 회원 레이아웃) — 회원가입·로그인 등 왼쪽 메뉴가 없는 화면
// #wrap.pageLayout.memberLayout > #header(메뉴 검색 없음) / main#container(가운데 정렬) / #footer / #modalWrap
interface MemberLayoutProps {
    children: ReactNode;
}

const MemberLayout = ({ children }: MemberLayoutProps) => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <div id="wrap" className="pageLayout memberLayout" data-theme={isDark ? 'dark' : 'light'}>
            <ToastProvider>
                <Header isDark={isDark} onToggleTheme={toggleTheme} hasSearch={false} />
                <main id="container">{children}</main>
                <Footer />
                <div id="modalWrap" />
            </ToastProvider>
        </div>
    );
};

export default MemberLayout;

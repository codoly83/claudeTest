import { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import MemberLayout from './components/layout/MemberLayout';
import Loading from './components/common/Loading';

// 페이지는 처음 들어갈 때 따로 불러옵니다 (React.lazy, 빌드 결과를 페이지별 파일로 나눔)
const Ia = lazy(() => import('./pages/Ia'));
const Home = lazy(() => import('./pages/Home'));
const Spec = lazy(() => import('./pages/Spec'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Signup = lazy(() => import('./pages/Signup'));
const Payout = lazy(() => import('./pages/Payout'));
const Chat = lazy(() => import('./pages/Chat'));

// 라우팅 (docs/design.md 1.1.1)
// - /Ia: 공통 Layout을 적용하지 않는 독립 관리 화면 (컴포넌트 설명은 /spec/{컴포넌트} 명세 화면, 2026-11-25 /Guide 폐지)
// - 일반 페이지: Layout(#wrap) 안에서 렌더링, 같은 작업에서 src/data/iaData.ts·navData.ts에 등록
// - 페이지를 불러오는 동안 Layout(Header·왼쪽 메뉴)은 그대로 두고 콘텐츠 자리에만 로딩을 표시합니다.
const PageLoading = () => <Loading isLoading isFullscreen={false} label="화면을 불러오는 중" />;

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* 폐지된 /Guide(2026-11-25) 주소는 메인으로 보냄 — 컴포넌트 설명은 메인 목록·명세 화면 */}
                <Route path="/Guide" element={<Navigate to="/" replace />} />
                <Route
                    path="/Ia"
                    element={
                        <Suspense fallback={null}>
                            <Ia />
                        </Suspense>
                    }
                />
                <Route
                    element={
                        <Layout>
                            <Suspense fallback={<PageLoading />}>
                                <Outlet />
                            </Suspense>
                        </Layout>
                    }
                >
                    <Route index element={<Home />} />
                    <Route path="/spec/:slug" element={<Spec />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/payout" element={<Payout />} />
                    <Route path="/chat" element={<Chat />} />
                </Route>
                {/* 회원 화면: 왼쪽 메뉴 없는 회원 레이아웃 (docs/design.md 1.2) */}
                <Route
                    element={
                        <MemberLayout>
                            <Suspense fallback={<PageLoading />}>
                                <Outlet />
                            </Suspense>
                        </MemberLayout>
                    }
                >
                    <Route path="/signup" element={<Signup />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;

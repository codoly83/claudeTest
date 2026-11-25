import type { ReactNode } from 'react';
import Portal from './Portal';
import { useScrollLock } from '../../hooks/useScrollLock';

// 로딩 표시 (docs/components/Loading.md, shadcn/ui Spinner 참고)
// isFullscreen: #modalWrap Portal로 화면 전체를 덮고 배경 스크롤 잠금 / false: children 영역만 덮고 aria-busy
interface LoadingProps {
    isLoading: boolean;
    label?: string;
    isFullscreen?: boolean;
    children?: ReactNode;
}

const Loading = ({ isLoading, label = '로딩 중', isFullscreen = true, children }: LoadingProps) => {
    useScrollLock(isLoading && isFullscreen);

    const spinner = (
        <div className="loadingBox" role="status" aria-live="polite">
            <span className="iconMask iconLoader loadingIcon" aria-hidden="true" />
            <span className="loadingLabel">{label}</span>
        </div>
    );

    if (isFullscreen) {
        if (!isLoading) return null;
        return (
            <Portal>
                <div className="loading fullscreen">{spinner}</div>
            </Portal>
        );
    }

    return (
        <div className="loadingArea" aria-busy={isLoading}>
            {children}
            {isLoading && <div className="loading area">{spinner}</div>}
        </div>
    );
};

export default Loading;

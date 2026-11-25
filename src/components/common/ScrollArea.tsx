import type { ReactNode } from 'react';
import { classNames } from '../../utils/classNames';

// 스크롤 영역 (docs/components/ScrollArea.md) — 라이브러리 없이 overflow + common.css 스크롤바 스타일
// 키보드로 스크롤할 수 있도록 tabIndex=0 + role="region" + aria-label
interface ScrollAreaProps {
    label: string;
    orientation?: 'vertical' | 'horizontal' | 'both';
    size?: 'sm' | 'md' | 'lg';
    children: ReactNode;
}

const ScrollArea = ({ label, orientation = 'vertical', size = 'md', children }: ScrollAreaProps) => {
    return (
        <div className={classNames('scrollArea', orientation, size)} role="region" aria-label={label} tabIndex={0}>
            {children}
        </div>
    );
};

export default ScrollArea;

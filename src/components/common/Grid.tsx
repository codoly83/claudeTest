import type { ReactNode } from 'react';
import { GAP_CLASS } from '../../constants';
import type { SpaceSize } from '../../types';
import { classNames } from '../../utils/classNames';

// 배치: 반응형 열 나누기 (docs/components/Grid.md, 배치 규칙 docs/component-ssot.md 2.3)
// 모바일 1열 → 768px 최대 2열 → 1024px 이상 columns열 (common.css 07 Responsive)
interface GridProps {
    columns?: 1 | 2 | 3 | 4;
    gap?: SpaceSize;
    children: ReactNode;
}

const Grid = ({ columns = 2, gap = 'md', children }: GridProps) => {
    return <div className={classNames('grid', `cols${columns}`, GAP_CLASS[gap])}>{children}</div>;
};

export default Grid;

import type { ReactNode } from 'react';
import { GAP_CLASS } from '../../constants';
import type { SpaceSize } from '../../types';
import { classNames } from '../../utils/classNames';

// 배치: 한 방향 쌓기 (docs/components/Stack.md, 배치 규칙 docs/component-ssot.md 2.3)
// 형제 사이 간격은 gap으로만 정합니다. 자식에 margin을 주지 않습니다.
interface StackProps {
    direction?: 'column' | 'row';
    gap?: SpaceSize;
    align?: 'start' | 'center' | 'end' | 'stretch';
    justify?: 'start' | 'center' | 'end' | 'between';
    isWrap?: boolean;
    children: ReactNode;
}

// Table의 .alignCenter(칸 정렬)와 겹치지 않도록 items* 이름 사용
const ALIGN_CLASS = { start: 'itemsStart', center: 'itemsCenter', end: 'itemsEnd', stretch: '' };
const JUSTIFY_CLASS = { start: '', center: 'justifyCenter', end: 'justifyEnd', between: 'justifyBetween' };

const Stack = ({ direction = 'column', gap = 'md', align = 'stretch', justify = 'start', isWrap = false, children }: StackProps) => {
    return (
        <div className={classNames('stack', direction, GAP_CLASS[gap], ALIGN_CLASS[align], JUSTIFY_CLASS[justify], isWrap && 'isWrap')}>
            {children}
        </div>
    );
};

export default Stack;

import type { IconName } from '../../types';
import { classNames } from '../../utils/classNames';

// 아이콘 (docs/components/Icon.md) — src/assets/icons SVG를 CSS mask로 그려 현재 글자색(currentColor)을 입힘
// label이 없으면 장식용(aria-hidden), 있으면 role="img" + aria-label
interface IconProps {
    name: IconName;
    size?: 'sm' | 'md' | 'lg';
    label?: string;
}

const SIZE_CLASS = { sm: 'iconSm', md: 'iconMd', lg: 'iconLg' };

const Icon = ({ name, size = 'md', label }: IconProps) => {
    return label ? (
        <span className={classNames('iconMask', name, SIZE_CLASS[size])} role="img" aria-label={label} />
    ) : (
        <span className={classNames('iconMask', name, SIZE_CLASS[size])} aria-hidden="true" />
    );
};

export default Icon;

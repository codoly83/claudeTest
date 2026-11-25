import { useId } from 'react';
import type { ReactNode } from 'react';
import type { HeadingLevel, SpaceSize } from '../../types';
import { classNames } from '../../utils/classNames';

// 공통 카드 (docs/components/Card.md — 구현 범위: title, description, size, padding, headingLevel, action, footer)
// 배치 규칙: docs/component-ssot.md 2.3 (폭은 부모 Grid·Stack이 정함)
interface CardProps {
    title?: string;
    description?: string;
    size?: 'md' | 'sm';
    padding?: SpaceSize;
    headingLevel?: HeadingLevel;
    action?: ReactNode;
    footer?: ReactNode;
    children: ReactNode;
}

const PADDING_CLASS: Record<SpaceSize, string> = { sm: 'paddingSm', md: '', lg: 'paddingLg' };

const Card = ({ title, description, size = 'md', padding = 'md', headingLevel = 3, action, footer, children }: CardProps) => {
    const titleId = useId();
    const Heading = `h${headingLevel}` as const;
    const className = classNames('card', size === 'sm' && 'sm', PADDING_CLASS[padding]);
    const hasHeader = Boolean(title || description || action);

    const content = (
        <>
            {hasHeader && (
                <div className="cardHeader">
                    {(title || description) && (
                        <div className="cardHeadText">
                            {title && (
                                <Heading id={titleId} className="cardTitle">
                                    {title}
                                </Heading>
                            )}
                            {description && <p className="cardDesc">{description}</p>}
                        </div>
                    )}
                    {action && <div className="cardAction">{action}</div>}
                </div>
            )}
            <div className="cardBody">{children}</div>
            {footer && <div className="cardFooter">{footer}</div>}
        </>
    );

    // 제목이 있으면 영역 이름이 있는 section, 없으면 div
    return title ? (
        <section className={className} aria-labelledby={titleId}>
            {content}
        </section>
    ) : (
        <div className={className}>{content}</div>
    );
};

export default Card;

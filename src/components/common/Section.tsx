import { useId } from 'react';
import type { ReactNode } from 'react';
import { GAP_CLASS } from '../../constants';
import type { HeadingLevel, SpaceSize } from '../../types';
import { classNames } from '../../utils/classNames';

// 배치: 제목 + 콘텐츠 구역 (docs/components/Section.md, 배치 규칙 docs/component-ssot.md 2.3)
// 배경 없는 구역입니다. 배경·그림자가 필요하면 안에 Card를 둡니다.
interface SectionProps {
    title: string;
    description?: string;
    action?: ReactNode;
    headingLevel?: HeadingLevel;
    gap?: SpaceSize;
    children: ReactNode;
}

const Section = ({ title, description, action, headingLevel = 3, gap = 'md', children }: SectionProps) => {
    const titleId = useId();
    const Heading = `h${headingLevel}` as const;

    return (
        <section className={classNames('section', GAP_CLASS[gap])} aria-labelledby={titleId}>
            <div className="sectionHead">
                <div className="sectionHeadText">
                    <Heading id={titleId} className="sectionTitle">
                        {title}
                    </Heading>
                    {description && <p className="sectionDesc">{description}</p>}
                </div>
                {action && <div className="sectionAction">{action}</div>}
            </div>
            <div className="sectionBody">{children}</div>
        </section>
    );
};

export default Section;

import { Link } from 'react-router-dom';

// 현재 위치 경로 (docs/components/Breadcrumb.md, shadcn/ui Breadcrumb 참고)
// nav[aria-label] > ol > li. 마지막 항목은 현재 페이지(aria-current="page"), 구분 아이콘은 장식용
interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
    return (
        <nav className="breadcrumb" aria-label="현재 위치">
            <ol className="breadcrumbList">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    return (
                        <li key={`${index}-${item.label}`} className="breadcrumbItem">
                            {isLast || !item.href ? (
                                <span className={isLast ? 'breadcrumbText on' : 'breadcrumbText'} aria-current={isLast ? 'page' : undefined}>
                                    {item.label}
                                </span>
                            ) : (
                                <Link to={item.href} className="breadcrumbLink">
                                    {item.label}
                                </Link>
                            )}
                            {!isLast && <span className="iconMask iconChevronRight breadcrumbSeparator" aria-hidden="true" />}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumb;

import type { ReactNode } from 'react';
import { classNames } from '../../utils/classNames';

// 페이지 이동 (docs/components/Pagination.md, shadcn/ui Pagination 참고)
// nav[aria-label] > ul > li > a|button. 현재 페이지 .on + aria-current="page", 경계에서 disabled
// << · >> 는 max만큼, < · > 는 1페이지씩 이동합니다.
interface PaginationProps {
    total: number;
    current: number;
    onChange?: (page: number) => void;
    max?: number;
    hasEllipsis?: boolean;
    getHref?: (page: number) => string;
}

interface PageControlProps {
    page: number;
    label?: string;
    isCurrent?: boolean;
    disabled?: boolean;
    getHref?: (page: number) => string;
    onChange?: (page: number) => void;
    children: ReactNode;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

// 링크(getHref)가 있으면 <a>, 없으면 <button>
const PageControl = ({ page, label, isCurrent = false, disabled = false, getHref, onChange, children }: PageControlProps) => {
    const className = classNames('pageControl', isCurrent && 'on', disabled && 'disabled');
    if (getHref && !disabled) {
        return (
            <a href={getHref(page)} className={className} aria-label={label} aria-current={isCurrent ? 'page' : undefined} onClick={() => onChange?.(page)}>
                {children}
            </a>
        );
    }
    return (
        <button type="button" className={className} aria-label={label} aria-current={isCurrent ? 'page' : undefined} disabled={disabled} onClick={() => onChange?.(page)}>
            {children}
        </button>
    );
};

const Pagination = ({ total, current, onChange, max = 5, hasEllipsis = false, getHref }: PaginationProps) => {
    const groupStart = Math.floor((current - 1) / max) * max + 1;
    const groupEnd = Math.min(groupStart + max - 1, total);
    const pages = Array.from({ length: groupEnd - groupStart + 1 }, (_, index) => groupStart + index);
    const isFirst = current <= 1;
    const isLast = current >= total;
    const controlProps = { getHref, onChange };

    return (
        <nav className="pagination" aria-label="페이지 이동">
            <ul className="paginationList">
                <li>
                    <PageControl page={clamp(current - max, 1, total)} label={`이전 ${max}페이지`} disabled={isFirst} {...controlProps}>
                        <span className="iconMask iconChevronsLeft" aria-hidden="true" />
                    </PageControl>
                </li>
                <li>
                    <PageControl page={clamp(current - 1, 1, total)} label="이전 페이지" disabled={isFirst} {...controlProps}>
                        <span className="iconMask iconChevronLeft" aria-hidden="true" />
                    </PageControl>
                </li>
                {hasEllipsis && groupStart > 1 && (
                    <>
                        <li>
                            <PageControl page={1} {...controlProps}>
                                1
                            </PageControl>
                        </li>
                        <li className="paginationEllipsis" aria-hidden="true">
                            …
                        </li>
                    </>
                )}
                {pages.map((page) => (
                    <li key={page}>
                        <PageControl page={page} isCurrent={page === current} {...controlProps}>
                            {page}
                        </PageControl>
                    </li>
                ))}
                {hasEllipsis && groupEnd < total && (
                    <>
                        <li className="paginationEllipsis" aria-hidden="true">
                            …
                        </li>
                        <li>
                            <PageControl page={total} {...controlProps}>
                                {total}
                            </PageControl>
                        </li>
                    </>
                )}
                <li>
                    <PageControl page={clamp(current + 1, 1, total)} label="다음 페이지" disabled={isLast} {...controlProps}>
                        <span className="iconMask iconChevronRight" aria-hidden="true" />
                    </PageControl>
                </li>
                <li>
                    <PageControl page={clamp(current + max, 1, total)} label={`다음 ${max}페이지`} disabled={isLast} {...controlProps}>
                        <span className="iconMask iconChevronsRight" aria-hidden="true" />
                    </PageControl>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;

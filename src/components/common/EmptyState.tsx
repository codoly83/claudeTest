import type { ReactNode } from 'react';

// 빈 상태 안내 (docs/components/EmptyState.md, shadcn/ui Empty 참고)
interface EmptyStateProps {
    title: string;
    description?: string;
    action?: ReactNode;
}

const EmptyState = ({ title, description, action }: EmptyStateProps) => {
    return (
        <div className="emptyState">
            <span className="emptyStateMedia" aria-hidden="true">
                <span className="iconMask iconInbox" />
            </span>
            <strong className="emptyStateTitle">{title}</strong>
            {description && <p className="emptyStateDesc">{description}</p>}
            {action && <div className="emptyStateAction">{action}</div>}
        </div>
    );
};

export default EmptyState;

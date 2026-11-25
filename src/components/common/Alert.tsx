import type { ReactNode } from 'react';

// 안내 박스 (docs/components/Alert.md, shadcn/ui Alert 참고)
// error는 role="alert"로 바로 읽히고, default는 일반 안내 영역입니다.
interface AlertProps {
    title: string;
    variant?: 'default' | 'error';
    children?: ReactNode;
}

const Alert = ({ title, variant = 'default', children }: AlertProps) => {
    return (
        <div className={`alert ${variant}`} role={variant === 'error' ? 'alert' : undefined}>
            <span className={`iconMask ${variant === 'error' ? 'iconCircleAlert' : 'iconInfo'} alertIcon`} aria-hidden="true" />
            <div className="alertBody">
                <strong className="alertTitle">{title}</strong>
                {children && <div className="alertDesc">{children}</div>}
            </div>
        </div>
    );
};

export default Alert;

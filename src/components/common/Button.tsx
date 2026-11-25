import type { ButtonHTMLAttributes, ReactNode } from 'react';

// 공통 버튼 (docs/components/Button.md — 구현 범위: size, shape)
interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'color'> {
    size?: 'lg' | 'md' | 'sm';
    shape?: 'default' | 'square';
    children: ReactNode;
}

const Button = ({ size = 'lg', shape = 'default', type = 'button', disabled, children, ...rest }: ButtonProps) => {
    const className = ['btn', size, shape === 'square' ? 'square' : '', disabled ? 'disabled' : ''].filter(Boolean).join(' ');
    return (
        <button type={type} className={className} disabled={disabled} {...rest}>
            {children}
        </button>
    );
};

export default Button;

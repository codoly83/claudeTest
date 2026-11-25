import { useId } from 'react';
import type { InputHTMLAttributes } from 'react';

// 공통 입력창 (docs/components/Input.md — 구현 범위: label, helpText, 오류)
// 제어형(value + onChange(value)), label·안내·오류 문구는 useId로 연결합니다.
interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'className' | 'size'> {
    label: string;
    value: string;
    onChange?: (value: string) => void;
    helpText?: string;
    hasError?: boolean;
    errorMessage?: string;
}

const Input = ({ label, value, onChange, helpText, hasError = false, errorMessage, type = 'text', required, disabled, ...rest }: InputProps) => {
    const inputId = useId();
    const helpId = useId();
    const errorId = useId();
    const isErrorShown = hasError && Boolean(errorMessage);
    const describedBy = [helpText ? helpId : '', isErrorShown ? errorId : ''].filter(Boolean).join(' ') || undefined;

    return (
        <div className={disabled ? 'inputField disabled' : 'inputField'}>
            <label htmlFor={inputId} className="inputLabel">
                {label}
                {required && (
                    <span className="inputRequired" aria-hidden="true">
                        *
                    </span>
                )}
            </label>
            <div className="inputBox">
                <input
                    id={inputId}
                    type={type}
                    className="inputControl"
                    value={value}
                    onChange={(event) => onChange?.(event.target.value)}
                    required={required}
                    disabled={disabled}
                    aria-invalid={hasError || undefined}
                    aria-describedby={describedBy}
                    {...rest}
                />
            </div>
            {helpText && (
                <p id={helpId} className="inputHelp">
                    {helpText}
                </p>
            )}
            {isErrorShown && (
                <p id={errorId} className="inputError">
                    {errorMessage}
                </p>
            )}
        </div>
    );
};

export default Input;

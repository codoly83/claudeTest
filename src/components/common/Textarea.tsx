import { useId } from 'react';
import type { ReactNode } from 'react';
import { classNames } from '../../utils/classNames';

// 여러 줄 입력 (docs/components/Textarea.md, shadcn/ui Textarea 참고)
// 안내·글자 수·오류 문구를 aria-describedby로 연결. 글자 수 90% 이상이면 .textareaCount.on (경고 색)
interface TextareaProps {
    value: string;
    onChange?: (value: string) => void;
    label: string;
    name?: string;
    placeholder?: string;
    rows?: number;
    maxLength?: number;
    hasCounter?: boolean;
    helpText?: string;
    footer?: ReactNode;
    disabled?: boolean;
    required?: boolean;
    hasError?: boolean;
    errorMessage?: string;
}

const COUNT_WARNING_RATIO = 0.9;

const Textarea = ({
    value,
    onChange,
    label,
    name,
    placeholder,
    rows = 4,
    maxLength,
    hasCounter = false,
    helpText,
    footer,
    disabled = false,
    required = false,
    hasError = false,
    errorMessage
}: TextareaProps) => {
    const textareaId = useId();
    const helpId = useId();
    const countId = useId();
    const errorId = useId();
    const isCounterShown = hasCounter && maxLength !== undefined;
    const isErrorShown = hasError && Boolean(errorMessage);
    const isCountWarning = maxLength !== undefined && isCounterShown && value.length >= maxLength * COUNT_WARNING_RATIO;
    const describedBy = [helpText && helpId, isCounterShown && countId, isErrorShown && errorId].filter(Boolean).join(' ') || undefined;

    return (
        <div className={classNames('inputField', 'textareaField', disabled && 'disabled')}>
            <label htmlFor={textareaId} className="inputLabel">
                {label}
                {required && (
                    <span className="inputRequired" aria-hidden="true">
                        *
                    </span>
                )}
            </label>
            <div className="textareaBox">
                <textarea
                    id={textareaId}
                    name={name}
                    className="textareaControl"
                    value={value}
                    placeholder={placeholder}
                    rows={rows}
                    maxLength={maxLength}
                    disabled={disabled}
                    required={required}
                    onChange={(event) => onChange?.(event.target.value)}
                    aria-invalid={hasError || undefined}
                    aria-describedby={describedBy}
                />
                {(footer || isCounterShown) && (
                    <div className="textareaFoot">
                        <div className="textareaAction">{footer}</div>
                        {isCounterShown && (
                            <p id={countId} className={classNames('textareaCount', isCountWarning && 'on')} aria-live="polite">
                                {value.length} / {maxLength}
                            </p>
                        )}
                    </div>
                )}
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

export default Textarea;

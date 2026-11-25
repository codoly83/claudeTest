import { useId } from 'react';
import type { KeyboardEvent } from 'react';
import { addDays, format, isValid, parseISO } from 'date-fns';
import { classNames } from '../../utils/classNames';

// 숫자·날짜 증감 입력 (docs/components/InputStepper.md)
// min/max에 닿으면 해당 버튼 비활성, ↑↓ 키로 증감 (spinbutton 패턴), date 모드는 일 단위
interface InputStepperProps {
    value: string;
    onChange?: (value: string) => void;
    label: string;
    mode?: 'number' | 'date';
    variant?: 'plusMinus' | 'chevron';
    min?: number | string;
    max?: number | string;
    step?: number;
    disabled?: boolean;
    readOnly?: boolean;
    hasError?: boolean;
    errorMessage?: string;
}

const DATE_FORMAT = 'yyyy-MM-dd';

// 소수 step의 부동소수점 오차 정리: 0.1 + 0.2 → 0.3
const roundTo = (value: number, step: number) => {
    const digits = (String(step).split('.')[1] ?? '').length;
    return Number(value.toFixed(digits));
};

const InputStepper = ({
    value,
    onChange,
    label,
    mode = 'number',
    variant = 'plusMinus',
    min,
    max,
    step = 1,
    disabled = false,
    readOnly = false,
    hasError = false,
    errorMessage
}: InputStepperProps) => {
    const inputId = useId();
    const errorId = useId();
    const isDate = mode === 'date';
    const isLocked = disabled || readOnly;

    // 값 비교용 숫자: date는 시각(ms), number는 값
    const toComparable = (raw: string | number | undefined) => {
        if (raw === undefined || raw === '') return undefined;
        if (isDate) {
            const date = parseISO(String(raw));
            return isValid(date) ? date.getTime() : undefined;
        }
        const number = Number(raw);
        return Number.isNaN(number) ? undefined : number;
    };

    const current = toComparable(value);
    const minValue = toComparable(min);
    const maxValue = toComparable(max);
    const isMin = current !== undefined && minValue !== undefined && current <= minValue;
    const isMax = current !== undefined && maxValue !== undefined && current >= maxValue;

    const handleStep = (direction: 1 | -1) => {
        if (isLocked || (direction < 0 && isMin) || (direction > 0 && isMax)) return;
        let next: string;
        if (isDate) {
            const base = current === undefined ? new Date() : new Date(current);
            next = format(addDays(base, direction * step), DATE_FORMAT);
        } else {
            next = String(roundTo((current ?? 0) + direction * step, step));
        }
        // 범위를 넘으면 경계값으로
        const nextValue = toComparable(next) ?? 0;
        if (minValue !== undefined && nextValue < minValue) next = String(min);
        if (maxValue !== undefined && nextValue > maxValue) next = String(max);
        onChange?.(next);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault();
            handleStep(event.key === 'ArrowUp' ? 1 : -1);
        }
    };

    const isChevron = variant === 'chevron';
    const decreaseButton = (
        <button type="button" className="stepperButton" aria-label={`${label} 감소`} disabled={isLocked || isMin} onClick={() => handleStep(-1)}>
            <span className={classNames('iconMask', isChevron ? 'iconChevronDown' : 'iconMinus')} aria-hidden="true" />
        </button>
    );
    const increaseButton = (
        <button type="button" className="stepperButton" aria-label={`${label} 증가`} disabled={isLocked || isMax} onClick={() => handleStep(1)}>
            <span className={classNames('iconMask', isChevron ? 'iconChevronUp' : 'iconPlus')} aria-hidden="true" />
        </button>
    );

    return (
        <div className={classNames('stepperField', disabled && 'disabled')}>
            <label htmlFor={inputId} className="inputLabel">
                {label}
            </label>
            <div className={classNames('stepper', variant, hasError && 'error')}>
                {!isChevron && decreaseButton}
                <input
                    id={inputId}
                    className="stepperInput"
                    type={isDate ? 'date' : 'text'}
                    inputMode={isDate ? undefined : 'decimal'}
                    role={isDate ? undefined : 'spinbutton'}
                    aria-valuenow={!isDate && current !== undefined ? current : undefined}
                    aria-valuemin={!isDate && minValue !== undefined ? minValue : undefined}
                    aria-valuemax={!isDate && maxValue !== undefined ? maxValue : undefined}
                    value={value}
                    min={isDate && min !== undefined ? String(min) : undefined}
                    max={isDate && max !== undefined ? String(max) : undefined}
                    disabled={disabled}
                    readOnly={readOnly}
                    aria-invalid={hasError || undefined}
                    aria-describedby={hasError && errorMessage ? errorId : undefined}
                    onChange={(event) => onChange?.(event.target.value)}
                    onKeyDown={handleKeyDown}
                />
                {isChevron ? (
                    <span className="stepperChevrons">
                        {increaseButton}
                        {decreaseButton}
                    </span>
                ) : (
                    increaseButton
                )}
            </div>
            {hasError && errorMessage && (
                <p id={errorId} className="inputError">
                    {errorMessage}
                </p>
            )}
        </div>
    );
};

export default InputStepper;

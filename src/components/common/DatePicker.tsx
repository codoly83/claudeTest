import { useEffect, useId, useRef, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import type { DateRange, Matcher } from 'react-day-picker';
import { ko } from 'react-day-picker/locale';
import { format } from 'date-fns';
import 'react-day-picker/style.css';
import { classNames } from '../../utils/classNames';

// 날짜 선택 (docs/components/DatePicker.md) — react-day-picker + date-fns
// mode="single" 하나의 날짜 / mode="range" 기간 (같은 기능이라 컴포넌트를 나누지 않음, AGENTS 5.1.1)
// 달력은 Portal 없이 트리거 아래에 열립니다. 방향키로 날짜 이동, ESC·바깥 클릭으로 닫고 트리거로 포커스 복귀.
interface DatePickerBaseProps {
    label: string;
    variant?: 'default' | 'btnType';
    placeholder?: string;
    format?: string;
    minDate?: Date;
    maxDate?: Date;
    disabledDates?: Matcher[];
    hasReset?: boolean;
    disabled?: boolean;
    hasError?: boolean;
    errorMessage?: string;
}

interface DatePickerSingleProps extends DatePickerBaseProps {
    mode?: 'single';
    value?: Date;
    onChange?: (value: Date | undefined) => void;
}

interface DatePickerRangeProps extends DatePickerBaseProps {
    mode: 'range';
    value?: DateRange;
    onChange?: (value: DateRange | undefined) => void;
}

type DatePickerProps = DatePickerSingleProps | DatePickerRangeProps;

const DatePicker = (props: DatePickerProps) => {
    const { label, variant = 'default', placeholder, format: formatString = 'yyyy.MM.dd', minDate, maxDate, disabledDates = [], hasReset = false, disabled = false, hasError = false, errorMessage } = props;
    const labelId = useId();
    const valueId = useId();
    const errorId = useId();
    const dialogId = useId();
    const [isOpen, setIsOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const isRange = props.mode === 'range';
    const matchers: Matcher[] = [...(minDate ? [{ before: minDate }] : []), ...(maxDate ? [{ after: maxDate }] : []), ...disabledDates];
    const formatDate = (date?: Date) => (date ? format(date, formatString) : '');

    const displayText = props.mode === 'range' ? (props.value?.from ? `${formatDate(props.value.from)} ~ ${formatDate(props.value.to)}` : '') : formatDate(props.value);
    const emptyText = placeholder ?? (isRange ? 'YYYY.MM.DD ~ YYYY.MM.DD' : 'YYYY.MM.DD');
    const hasValue = displayText !== '';

    const handleClose = (shouldFocusTrigger = true) => {
        setIsOpen(false);
        if (shouldFocusTrigger) triggerRef.current?.focus();
    };

    // 바깥 클릭·ESC로 닫기 (열려 있을 때만 등록)
    useEffect(() => {
        if (!isOpen) return;
        const handlePointerDown = (event: PointerEvent) => {
            if (rootRef.current && !rootRef.current.contains(event.target as Node)) setIsOpen(false);
        };
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Escape') return;
            setIsOpen(false);
            triggerRef.current?.focus();
        };
        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    const handleReset = () => {
        props.onChange?.(undefined);
        triggerRef.current?.focus();
    };

    const calendar =
        props.mode === 'range' ? (
            <DayPicker
                mode="range"
                locale={ko}
                selected={props.value}
                defaultMonth={props.value?.from}
                disabled={matchers}
                startMonth={minDate}
                endMonth={maxDate}
                autoFocus
                onSelect={(range) => {
                    props.onChange?.(range);
                    if (range?.from && range.to && range.from.getTime() !== range.to.getTime()) handleClose();
                }}
            />
        ) : (
            <DayPicker
                mode="single"
                locale={ko}
                selected={props.value}
                defaultMonth={props.value}
                disabled={matchers}
                startMonth={minDate}
                endMonth={maxDate}
                autoFocus
                onSelect={(date) => {
                    props.onChange?.(date);
                    handleClose();
                }}
            />
        );

    return (
        <div className={classNames('datePicker', variant, disabled && 'disabled')} ref={rootRef}>
            <span id={labelId} className="inputLabel">
                {label}
            </span>
            <div className={classNames('dateControl', hasError && 'error')}>
                <button
                    ref={triggerRef}
                    type="button"
                    className={classNames('dateTrigger', isOpen && 'on')}
                    aria-haspopup="dialog"
                    aria-expanded={isOpen}
                    aria-controls={isOpen ? dialogId : undefined}
                    aria-labelledby={`${labelId} ${valueId}`}
                    aria-invalid={hasError || undefined}
                    aria-describedby={hasError && errorMessage ? errorId : undefined}
                    disabled={disabled}
                    onClick={() => setIsOpen((prev) => !prev)}
                >
                    <span id={valueId} className={classNames('dateValue', !hasValue && 'empty')}>
                        {hasValue ? displayText : emptyText}
                    </span>
                    <span className="iconMask iconCalendar" aria-hidden="true" />
                </button>
                {hasReset && hasValue && !disabled && (
                    <button type="button" className="dateReset" aria-label={`${label} 지우기`} onClick={handleReset}>
                        <span className="iconMask iconClose" aria-hidden="true" />
                    </button>
                )}
            </div>
            {isOpen && (
                <div id={dialogId} className="datePopup" role="dialog" aria-modal="false" aria-labelledby={labelId}>
                    {calendar}
                </div>
            )}
            {hasError && errorMessage && (
                <p id={errorId} className="inputError">
                    {errorMessage}
                </p>
            )}
        </div>
    );
};

export default DatePicker;

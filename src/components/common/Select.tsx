import { useId } from 'react';
import { classNames } from '../../utils/classNames';

// 선택 상자 (docs/components/Select.md, shadcn/ui Select·Native Select 참고)
// 구현 범위: 네이티브 <select> 단일 선택 (방식 ①: 키보드·모바일·스크린리더 기본 지원). group 값이 있으면 optgroup
interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
    group?: string;
}

interface SelectProps {
    options: SelectOption[];
    value: string;
    onChange?: (value: string) => void;
    label: string;
    name?: string;
    placeholder?: string;
    size?: 'md' | 'sm';
    disabled?: boolean;
    hasError?: boolean;
    errorMessage?: string;
}

const Select = ({ options, value, onChange, label, name, placeholder, size = 'md', disabled = false, hasError = false, errorMessage }: SelectProps) => {
    const selectId = useId();
    const errorId = useId();
    const isErrorShown = hasError && Boolean(errorMessage);
    const groups = [...new Set(options.map((option) => option.group ?? ''))];

    const renderOption = (option: SelectOption) => (
        <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
        </option>
    );

    return (
        <div className={classNames('selectField', disabled && 'disabled')}>
            <label htmlFor={selectId} className="inputLabel">
                {label}
            </label>
            <div className={`selectBox ${size}`}>
                <select
                    id={selectId}
                    name={name}
                    className="selectControl"
                    value={value}
                    disabled={disabled}
                    onChange={(event) => onChange?.(event.target.value)}
                    aria-invalid={hasError || undefined}
                    aria-describedby={isErrorShown ? errorId : undefined}
                >
                    {placeholder !== undefined && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {groups.map((group) =>
                        group ? (
                            <optgroup key={group} label={group}>
                                {options.filter((option) => option.group === group).map(renderOption)}
                            </optgroup>
                        ) : (
                            options.filter((option) => !option.group).map(renderOption)
                        )
                    )}
                </select>
                <span className="iconMask iconChevronDown selectIcon" aria-hidden="true" />
            </div>
            {isErrorShown && (
                <p id={errorId} className="inputError">
                    {errorMessage}
                </p>
            )}
        </div>
    );
};

export default Select;

import { useId } from 'react';
import { classNames } from '../../utils/classNames';

// 라디오 그룹 (docs/components/Radio.md, shadcn/ui Radio Group 참고)
// fieldset > legend + 네이티브 radio (방향키 이동 기본 지원). 상태 클래스 on·disabled
interface RadioOption {
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
}

interface RadioProps {
    options: RadioOption[];
    value: string;
    onChange?: (value: string) => void;
    legend: string;
    name?: string;
    hasError?: boolean;
    errorMessage?: string;
}

const Radio = ({ options, value, onChange, legend, name, hasError = false, errorMessage }: RadioProps) => {
    const autoName = useId();
    const errorId = useId();
    const isErrorShown = hasError && Boolean(errorMessage);

    return (
        <fieldset className="radioGroup">
            <legend className="inputLabel">{legend}</legend>
            <div className="radioList">
                {options.map((option) => {
                    const isOn = option.value === value;
                    return (
                        <label key={option.value} className={classNames('radio', isOn && 'on', option.disabled && 'disabled')}>
                            <input
                                type="radio"
                                className="radioInput"
                                name={name ?? autoName}
                                value={option.value}
                                checked={isOn}
                                disabled={option.disabled}
                                onChange={() => onChange?.(option.value)}
                                aria-invalid={hasError || undefined}
                                aria-describedby={isErrorShown ? errorId : undefined}
                            />
                            <span className="radioIcon" aria-hidden="true" />
                            <span className="radioText">
                                <span className="radioLabel">{option.label}</span>
                                {option.description && <span className="radioDesc">{option.description}</span>}
                            </span>
                        </label>
                    );
                })}
            </div>
            {isErrorShown && (
                <p id={errorId} className="inputError">
                    {errorMessage}
                </p>
            )}
        </fieldset>
    );
};

export default Radio;

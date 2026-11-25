import { useId } from 'react';

// 공통 체크박스 (docs/components/Checkbox.md — 구현 범위: label, 오류)
// 실제 input[type=checkbox]를 사용(Space·라벨 클릭), 화면에는 상자와 체크 아이콘을 그립니다.
// 상태 클래스: 선택 on, 비활성 disabled
interface CheckboxProps {
    checked: boolean;
    onChange?: (checked: boolean) => void;
    label: string;
    name?: string;
    disabled?: boolean;
    hasError?: boolean;
    errorMessage?: string;
}

const Checkbox = ({ checked, onChange, label, name, disabled = false, hasError = false, errorMessage }: CheckboxProps) => {
    const errorId = useId();
    const isErrorShown = hasError && Boolean(errorMessage);
    const className = ['checkbox', checked ? 'on' : '', disabled ? 'disabled' : ''].filter(Boolean).join(' ');

    return (
        <div className="checkboxField">
            <label className={className}>
                <input
                    type="checkbox"
                    className="checkboxInput"
                    name={name}
                    checked={checked}
                    disabled={disabled}
                    onChange={(event) => onChange?.(event.target.checked)}
                    aria-invalid={hasError || undefined}
                    aria-describedby={isErrorShown ? errorId : undefined}
                />
                <span className="checkboxBox" aria-hidden="true" />
                <span className="checkboxLabel">{label}</span>
            </label>
            {isErrorShown && (
                <p id={errorId} className="inputError">
                    {errorMessage}
                </p>
            )}
        </div>
    );
};

export default Checkbox;

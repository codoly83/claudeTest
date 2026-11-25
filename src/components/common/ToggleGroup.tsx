import { classNames } from '../../utils/classNames';

// 토글 버튼 묶음 (docs/components/ToggleGroup.md, shadcn/ui Toggle Group 참고)
// 하나만 선택: role="group" + 버튼 aria-pressed. 상태 클래스 on·disabled
interface ToggleOption {
    value: string;
    label: string;
    disabled?: boolean;
}

interface ToggleGroupProps {
    options: ToggleOption[];
    value: string;
    onChange?: (value: string) => void;
    label: string;
    size?: 'md' | 'sm';
}

const ToggleGroup = ({ options, value, onChange, label, size = 'md' }: ToggleGroupProps) => {
    return (
        <div role="group" aria-label={label} className={`toggleGroup ${size}`}>
            {options.map((option) => {
                const isOn = option.value === value;
                return (
                    <button
                        key={option.value}
                        type="button"
                        aria-pressed={isOn}
                        disabled={option.disabled}
                        className={classNames('toggleItem', isOn && 'on', option.disabled && 'disabled')}
                        onClick={() => onChange?.(option.value)}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
};

export default ToggleGroup;

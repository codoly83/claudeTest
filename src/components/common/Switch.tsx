import { classNames } from '../../utils/classNames';

// 스위치 (docs/components/Switch.md, shadcn/ui Switch 참고)
// button[role=switch][aria-checked], Space·Enter 토글. 상태 클래스 on·disabled
interface SwitchProps {
    checked: boolean;
    onChange?: (checked: boolean) => void;
    label: string;
    onLabel?: string;
    offLabel?: string;
    size?: 'md' | 'sm';
    disabled?: boolean;
}

const Switch = ({ checked, onChange, label, onLabel = 'ON', offLabel = 'OFF', size = 'md', disabled = false }: SwitchProps) => {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={label}
            disabled={disabled}
            className={classNames('switch', size, checked && 'on', disabled && 'disabled')}
            onClick={() => onChange?.(!checked)}
        >
            <span className="switchText" aria-hidden="true">
                {checked ? onLabel : offLabel}
            </span>
            <span className="switchThumb" aria-hidden="true" />
        </button>
    );
};

export default Switch;

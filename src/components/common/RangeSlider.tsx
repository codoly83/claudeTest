import { useRef } from 'react';
import type { ChangeEvent, CSSProperties, PointerEvent } from 'react';
import { classNames } from '../../utils/classNames';

// 범위 슬라이더 (docs/components/RangeSlider.md, shadcn/ui Slider 참고, D5 이름)
// 네이티브 input[type=range] (값 2개면 두 개를 겹침). 방향키·Home·End·PageUp/Down 기본 지원
// 트랙(바)을 누르면 그 위치로 가장 가까운 손잡이가 이동하고, 누른 채 끌면 계속 따라갑니다.
interface RangeSliderProps {
    value: number[];
    onChange?: (value: number[]) => void;
    label: string;
    min?: number;
    max?: number;
    step?: number;
    minGap?: number;
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
}

const RangeSlider = ({ value, onChange, label, min = 0, max = 100, step = 1, minGap = 0, size = 'md', disabled = false }: RangeSliderProps) => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const dragIndexRef = useRef<number | null>(null);
    const isRange = value.length > 1;
    const toPercent = (number: number) => ((number - min) / (max - min)) * 100;
    const start = isRange ? toPercent(value[0]) : 0;
    const end = toPercent(isRange ? value[1] : value[0]);

    const updateValue = (index: number, number: number) => {
        if (!isRange) {
            if (number !== value[0]) onChange?.([number]);
            return;
        }
        const next = [...value];
        if (index === 0) next[0] = Math.min(number, value[1] - minGap);
        else next[1] = Math.max(number, value[0] + minGap);
        if (next[0] !== value[0] || next[1] !== value[1]) onChange?.(next);
    };

    // 포인터 x 좌표 → step 단위로 맞춘 값
    const getValueFromPointer = (element: HTMLElement, clientX: number) => {
        const rect = element.getBoundingClientRect();
        const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
        const stepped = Math.round((ratio * (max - min)) / step) * step + min;
        return Math.min(Math.max(stepped, min), max);
    };

    const getNearestIndex = (number: number) => {
        if (!isRange) return 0;
        if (number <= value[0]) return 0;
        if (number >= value[1]) return 1;
        return number - value[0] <= value[1] - number ? 0 : 1;
    };

    const handleChange = (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
        updateValue(index, Number(event.target.value));
    };

    // 손잡이(input)를 직접 잡은 경우는 네이티브 동작에 맡기고, 트랙을 누른 경우만 처리합니다
    const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
        if (disabled || event.button !== 0 || event.target instanceof HTMLInputElement) return;
        event.preventDefault();
        const number = getValueFromPointer(event.currentTarget, event.clientX);
        const index = getNearestIndex(number);
        dragIndexRef.current = index;
        event.currentTarget.setPointerCapture(event.pointerId);
        inputRefs.current[index]?.focus();
        updateValue(index, number);
    };

    const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
        if (dragIndexRef.current === null) return;
        updateValue(dragIndexRef.current, getValueFromPointer(event.currentTarget, event.clientX));
    };

    const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
        if (dragIndexRef.current === null) return;
        dragIndexRef.current = null;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    };

    const thumbs = isRange ? [0, 1] : [0];

    return (
        // [inline-style] 채워진 트랙 위치: 현재 값에서 계산되는 동적 값 (--range-start, --range-end)
        <div
            className={classNames('rangeSlider', size, disabled && 'disabled')}
            style={{ '--range-start': `${start}%`, '--range-end': `${end}%` } as CSSProperties}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
        >
            <span className="rangeTrack" aria-hidden="true">
                <span className="rangeFill" />
            </span>
            {thumbs.map((index) => (
                <input
                    key={index}
                    ref={(element) => {
                        inputRefs.current[index] = element;
                    }}
                    type="range"
                    className="rangeInput"
                    min={min}
                    max={max}
                    step={step}
                    value={value[index]}
                    disabled={disabled}
                    aria-label={isRange ? `${label} ${index === 0 ? '최솟값' : '최댓값'}` : label}
                    onChange={handleChange(index)}
                />
            ))}
        </div>
    );
};

export default RangeSlider;

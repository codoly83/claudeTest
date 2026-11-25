import { useId } from 'react';

// 진행률 (docs/components/Progress.md, shadcn/ui Progress 참고)
// 네이티브 <progress>로 진행 값을 CSS 의사 요소에 맡겨 인라인 스타일 없이 표시합니다.
interface ProgressProps {
    value: number;
    label: string;
    max?: number;
    hasValueText?: boolean;
}

const Progress = ({ value, label, max = 100, hasValueText = true }: ProgressProps) => {
    const progressId = useId();
    const percent = Math.round((Math.min(Math.max(value, 0), max) / max) * 100);

    return (
        <div className="progressField">
            <div className="progressHead">
                <label htmlFor={progressId} className="progressLabel">
                    {label}
                </label>
                {hasValueText && <span className="progressValue">{percent}%</span>}
            </div>
            <progress id={progressId} className="progress" value={value} max={max}>
                {percent}%
            </progress>
        </div>
    );
};

export default Progress;

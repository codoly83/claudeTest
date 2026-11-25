import type { ChipColor } from '../../types';

// 공통 칩 (docs/components/Chip.md — 구현 범위: solid 스타일, color)
interface ChipProps {
    label: string;
    color?: ChipColor;
}

const Chip = ({ label, color = 'green' }: ChipProps) => {
    return <span className={`chip ${color}`}>{label}</span>;
};

export default Chip;

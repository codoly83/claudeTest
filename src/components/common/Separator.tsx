// 구분선 (docs/components/Separator.md, shadcn/ui Separator 참고)
// 장식용(기본)은 role="none", 의미가 있으면 isDecorative={false} → role="separator" + aria-orientation
interface SeparatorProps {
    orientation?: 'horizontal' | 'vertical';
    isDecorative?: boolean;
}

const Separator = ({ orientation = 'horizontal', isDecorative = true }: SeparatorProps) => {
    return (
        <div
            className={`separator ${orientation}`}
            role={isDecorative ? 'none' : 'separator'}
            aria-orientation={isDecorative ? undefined : orientation}
        />
    );
};

export default Separator;

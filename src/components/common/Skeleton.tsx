// 로딩 자리 표시 (docs/components/Skeleton.md, shadcn/ui Skeleton 참고)
// 크기는 shape 프리셋 클래스로만 지정 (D8). 장식용이라 aria-hidden, 감싸는 영역에서 aria-busy를 지정합니다.
interface SkeletonProps {
    variant?: 'default' | 'muted';
    shape?: 'text' | 'title' | 'avatar' | 'button' | 'image';
}

const Skeleton = ({ variant = 'default', shape = 'text' }: SkeletonProps) => {
    return <span className={`skeleton ${variant} ${shape}`} aria-hidden="true" />;
};

export default Skeleton;

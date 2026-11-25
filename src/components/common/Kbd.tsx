// 키보드 키 표시 (docs/components/Kbd.md, shadcn/ui Kbd 참고). 조합 키는 Kbd를 여러 개 나란히 씁니다.
interface KbdProps {
    label: string;
}

const Kbd = ({ label }: KbdProps) => {
    return <kbd className="kbd">{label}</kbd>;
};

export default Kbd;

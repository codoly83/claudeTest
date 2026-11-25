import { useState } from 'react';

// 프로필 이미지 (docs/components/Avatar.md, shadcn/ui Avatar 참고)
// src가 없거나 불러오지 못하면 이름 머리글자(fallback)를 보여 줍니다. 이미지·머리글자 모두 이름을 접근 가능한 이름으로 사용
interface AvatarProps {
    name: string;
    src?: string;
    size?: 'sm' | 'md' | 'lg';
}

// '홍길동' → '홍', 'Jane Doe' → 'JD', 'shadcn' → 'SH'
const getInitials = (name: string) => {
    const words = name.trim().split(/\s+/);
    if (words.length > 1) return `${words[0][0]}${words[1][0]}`.toUpperCase();
    return name.trim().slice(0, /^[A-Za-z]/.test(name.trim()) ? 2 : 1).toUpperCase();
};

const Avatar = ({ name, src, size = 'md' }: AvatarProps) => {
    const [hasImageError, setHasImageError] = useState(false);
    const isImageShown = Boolean(src) && !hasImageError;

    return (
        <span className={`avatar ${size}`}>
            {isImageShown ? (
                <img className="avatarImage" src={src} alt={name} onError={() => setHasImageError(true)} />
            ) : (
                <span className="avatarFallback" role="img" aria-label={name}>
                    {getInitials(name)}
                </span>
            )}
        </span>
    );
};

export default Avatar;

import { useEffect, useState } from 'react';
import { THEME_STORAGE_KEY } from '../constants';

// 다크모드 상태·저장 (docs/design.md 1.2·4장) — Layout·MemberLayout 공유
// 저장소를 쓸 수 없는 환경이면 라이트로 시작하고 현재 화면에만 적용합니다.
const getInitialIsDark = () => {
    try {
        return window.localStorage.getItem(THEME_STORAGE_KEY) === 'dark';
    } catch {
        return false;
    }
};

export const useTheme = () => {
    const [isDark, setIsDark] = useState(getInitialIsDark);

    useEffect(() => {
        try {
            window.localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
        } catch {
            // 저장소를 쓸 수 없는 환경에서는 현재 화면에만 적용합니다.
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark((prev) => !prev);

    return { isDark, toggleTheme };
};

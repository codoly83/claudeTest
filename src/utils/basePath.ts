// 배포 하위 경로 (GitHub Pages: /claudeTest/) — vite.config.ts의 base에서 정해지며 로컬 개발은 '' 입니다.
// React Router의 Link는 basename이 붙지만, 직접 쓰는 <a href>·iframe 주소(IA 화면)는 이 함수로 경로 앞에 붙입니다.
export const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, '');

// withBase('/dashboard') → '/claudeTest/dashboard' (배포) · '/dashboard' (로컬)
export const withBase = (path: string) => (path.startsWith('/') ? `${BASE_PATH}${path}` : path);

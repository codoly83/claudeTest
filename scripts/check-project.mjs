// 프로젝트 규칙 정적 검사 (AGENTS.md 9.1) — 실행: node scripts/check-project.mjs
// 정적 보조 검사이며 브라우저 동작 확인(AGENTS.md 9.2)을 대체하지 않습니다.
// 오류가 하나라도 있으면 종료 코드 1, 경고만 있으면 0으로 끝납니다.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SRC = join(ROOT, 'src');
const COMMON_DIR = join(SRC, 'components', 'common');
const ALLOWED_CSS = ['common.css', 'ia.css'];

const errors = [];
const warnings = [];
const passed = [];

const read = (path) => readFileSync(path, 'utf8');
const rel = (path) => relative(ROOT, path).replaceAll('\\', '/');
const walk = (dir) =>
    readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const path = join(dir, entry.name);
        return entry.isDirectory() ? walk(path) : [path];
    });

// 검사 하나를 실행하고 결과를 모읍니다. problems가 비면 통과
const check = (name, problems, level = 'error') => {
    if (problems.length === 0) {
        passed.push(name);
        return;
    }
    (level === 'error' ? errors : warnings).push({ name, problems });
};

const lineOf = (text, index) => text.slice(0, index).split('\n').length;

// ---- CSS 선택자 추출 (주석 제거, @media·@supports 안쪽 포함, @keyframes 안쪽 제외) ----
const splitTopLevel = (text) => {
    const parts = [];
    let depth = 0;
    let current = '';
    for (const char of text) {
        if (char === '(') depth += 1;
        if (char === ')') depth -= 1;
        if (char === ',' && depth === 0) {
            parts.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    if (current.trim()) parts.push(current.trim());
    return parts;
};

const getSelectors = (css) => {
    const text = css.replace(/\/\*[\s\S]*?\*\//g, '');
    const selectors = [];
    const stack = []; // 열린 블록 종류: 'rule' | 'group' | 'keyframes'
    let buffer = '';
    let bufferStart = 0;
    for (let index = 0; index < text.length; index += 1) {
        const char = text[index];
        if (char === '{') {
            const prelude = buffer.trim();
            const insideKeyframes = stack.includes('keyframes');
            if (prelude.startsWith('@')) {
                stack.push(/^@(-webkit-)?keyframes/.test(prelude) ? 'keyframes' : 'group');
            } else {
                stack.push('rule');
                if (!insideKeyframes) {
                    splitTopLevel(prelude).forEach((selector) => selectors.push({ selector, line: lineOf(text, bufferStart) }));
                }
            }
            buffer = '';
            bufferStart = index + 1;
        } else if (char === '}') {
            stack.pop();
            buffer = '';
            bufferStart = index + 1;
        } else if (char === ';' && stack[stack.length - 1] !== 'group' && stack.length > 0) {
            buffer = '';
            bufferStart = index + 1;
        } else {
            if (!buffer.trim()) bufferStart = index;
            buffer += char;
        }
    }
    return selectors;
};

// ---- 1. CSS 파일은 2개뿐 (5.3, 2026-11-25 guide.css 폐지) ----
const allFiles = walk(SRC);
const cssFiles = allFiles.filter((path) => path.endsWith('.css'));
check(
    'CSS 파일은 common.css·ia.css 2개뿐 (5.3)',
    cssFiles.filter((path) => !ALLOWED_CSS.includes(basename(path))).map(rel)
);

// ---- 2. 전역 선택자 없음 (5.3) / 3. CSS 선택자 범위 (5.3) ----
const GLOBAL_SELECTOR = /(^|[\s>+~,(])(html|body|:root)(?=$|[\s.#:[>+~,)])|^\*($|\s|::?)/;
const scopeRules = {
    'common.css': { test: (selector) => selector.startsWith('#wrap'), label: '#wrap' },
    'ia.css': { test: (selector) => selector.startsWith('#iaWrap'), label: '#iaWrap' }
};
const globalProblems = [];
const scopeProblems = [];
cssFiles.forEach((path) => {
    const name = basename(path);
    getSelectors(read(path)).forEach(({ selector, line }) => {
        // :not(:root) 같은 부정 조건 안의 :root는 전역 선택이 아니므로 제외 (ia.css 원본 리셋)
        if (GLOBAL_SELECTOR.test(selector.replace(/:not([^)]*)/g, ''))) globalProblems.push(`${rel(path)}:${line} ${selector}`);
        const rule = scopeRules[name];
        if (rule && !rule.test(selector)) scopeProblems.push(`${rel(path)}:${line} ${selector} (${rule.label}로 시작해야 함)`);
    });
});
check('전역 선택자(body·html·:root·단독 *) 없음 (5.3)', globalProblems);
check('CSS 선택자 범위: common #wrap · ia #iaWrap (5.3)', scopeProblems);

// ---- 4~6. 공통 컴포넌트 규칙 (5.1.1) ----
const commonFiles = existsSync(COMMON_DIR) ? readdirSync(COMMON_DIR).filter((name) => name.endsWith('.tsx')) : [];
const classNameProblems = [];
const idProblems = [];
commonFiles.forEach((name) => {
    const text = read(join(COMMON_DIR, name));
    for (const match of text.matchAll(/^\s*className\??\s*:/gm)) classNameProblems.push(`src/components/common/${name}:${lineOf(text, match.index)}`);
    for (const match of text.matchAll(/\bid="[^"]*"/g)) idProblems.push(`src/components/common/${name}:${lineOf(text, match.index)} ${match[0]}`);
});
check('공통 컴포넌트에 className Props 없음 (5.1.1)', classNameProblems);
check('공통 컴포넌트에 하드코딩 id 없음 — useId 사용 (5.1.1)', idProblems);

const portalProblems = [];
allFiles
    .filter((path) => /\.tsx?$/.test(path))
    .forEach((path) => {
        const text = read(path);
        for (const match of text.matchAll(/createPortal\(([\s\S]*?)\)\s*[;:]/g)) {
            if (/document\.body/.test(match[1])) portalProblems.push(`${rel(path)}:${lineOf(text, match.index)}`);
        }
    });
check('Portal 대상이 document.body가 아님 (5.1.1)', portalProblems);

// ---- 7. 인라인 스타일 기록 일치 (5.3.1) ----
const tsxFiles = allFiles.filter((path) => /\.tsx?$/.test(path));
const inlineComments = tsxFiles.flatMap((path) => {
    const text = read(path);
    return [...text.matchAll(/\[inline-style\]/g)].map((match) => `${rel(path)}:${lineOf(text, match.index)}`);
});
const styleProps = tsxFiles.flatMap((path) => {
    const text = read(path);
    return [...text.matchAll(/\sstyle=\{/g)].map((match) => `${rel(path)}:${lineOf(text, match.index)}`);
});
const design = read(join(ROOT, 'docs', 'design.md'));
const inlineSection = design.split(/^### 6\.2 .*$/m)[1]?.split(/^## /m)[0] ?? '';
const inlineRows = inlineSection
    .split('\n')
    .filter((line) => line.startsWith('|') && !/^\|\s*-/.test(line) && !/^\|\s*파일/.test(line) && !/^\|---/.test(line));
check(
    '인라인 스타일 기록 일치: [inline-style] 주석 수 = style 속성 수 = design.md 6.2 표 행 수 (5.3.1)',
    inlineComments.length === inlineRows.length && styleProps.length === inlineComments.length
        ? []
        : [`주석 ${inlineComments.length}개 (${inlineComments.join(', ') || '없음'}), style 속성 ${styleProps.length}개, 표 ${inlineRows.length}행`]
);

// ---- 8. 공통 컴포넌트 ↔ 명세 스토리 동기화 (6.3) ----
// 명세 화면 탭(샘플·Playground·API)은 src/data/stories*.tsx(componentStories.ts)를 씁니다.
const storyFiles = readdirSync(join(SRC, 'data')).filter((name) => /^stories.*\.tsx$/.test(name));
const stories = storyFiles.map((name) => read(join(SRC, 'data', name))).join('\n');
check(
    '공통 컴포넌트마다 스토리(명세 탭) id 존재 (6.3)',
    [
        ...commonFiles
            .map((name) => name.replace('.tsx', ''))
            .map((name) => `${name[0].toLowerCase()}${name.slice(1)}`)
            .filter((id) => !stories.includes(`id: '${id}'`))
            .map((id) => `src/data/stories*.tsx에 id: '${id}' 스토리 없음`)
    ]
);

// 메뉴용 분류표(componentCatalog.ts)와 스토리 category가 같은지 (메뉴는 분류표만 읽어 첫 화면 용량을 줄임)
const catalogText = read(join(SRC, 'data', 'componentCatalog.ts'));
const catalog = Object.fromEntries([...catalogText.matchAll(/^\s+(\w+): '(layout|atom|internal)',?$/gm)].map((match) => [match[1], match[2]]));
const storyCategories = Object.fromEntries([...stories.matchAll(/name: '(\w+)',\s*\n\s*category: '(\w+)'/g)].map((match) => [match[1], match[2]]));
check('컴포넌트 분류표(componentCatalog.ts) = 스토리 category (6.3)', [
    ...Object.entries(storyCategories)
        .filter(([name, category]) => catalog[name] !== category)
        .map(([name, category]) => `${name}: 스토리 ${category} / 분류표 ${catalog[name] ?? '없음'}`),
    ...Object.keys(catalog)
        .filter((name) => !storyCategories[name])
        .map((name) => `${name}: 분류표에는 있으나 스토리 없음`)
]);

// ---- 9. 페이지 ↔ IA 동기화 (6.2) / 10. IA 최상단 메인(/) ----
const app = read(join(SRC, 'App.tsx'));
const ia = read(join(SRC, 'data', 'iaData.ts'));
const iaPaths = [...ia.matchAll(/createRow\(\[[^\]]*\],\s*'([^']+)'/g)].map((match) => match[1]);
// /Ia는 IA 목록 화면 자체라 목록에 등록하지 않습니다 (docs/ia-spec.md).
const IA_EXCLUDED_ROUTES = ['/Ia'];
const routePaths = [
    ...(/<Route\s+index\b/.test(app) ? ['/'] : []),
    // 다른 주소로 보내기만 하는 라우트(<Navigate>, 예: 폐지된 /Guide)는 페이지가 아니므로 제외
    ...[...app.matchAll(/<Route\s+path="([^"]+)"(?!\s+element=\{<Navigate)/g)].map((match) => match[1])
];
const pageFiles = readdirSync(join(SRC, 'pages')).filter((name) => name.endsWith('.tsx'));
const iaProblems = [
    ...routePaths
        .filter((path) => !IA_EXCLUDED_ROUTES.includes(path))
        .filter((path) => {
            const prefix = path.split(':')[0];
            return path.includes(':') ? !iaPaths.some((iaPath) => iaPath.startsWith(prefix)) : !iaPaths.includes(path);
        })
        .map((path) => `라우트 ${path}가 iaData.ts에 없음`),
    ...pageFiles.filter((name) => !app.includes(`./pages/${name.replace('.tsx', '')}'`)).map((name) => `src/pages/${name}가 App.tsx 라우트에 없음`)
];
check('페이지 라우트가 iaData.ts(IA)에 등록됨 (6.2)', iaProblems);
check('IA_TABLES 첫 항목이 메인 / (6.2)', iaPaths[0] === '/' ? [] : [`첫 항목: ${iaPaths[0] ?? '없음'}`]);

// ---- 11. 디버깅 코드 (9.3, 경고) ----
check(
    'console.log 없음 (9.3)',
    tsxFiles.flatMap((path) => {
        const text = read(path);
        return [...text.matchAll(/console\.log\(/g)].map((match) => `${rel(path)}:${lineOf(text, match.index)}`);
    }),
    'warning'
);

// ---- 결과 출력 (no-console 규칙 때문에 stdout에 직접 씀) ----
const print = (text) => process.stdout.write(`${text}\n`);
passed.forEach((name) => print(`  ✓ ${name}`));
warnings.forEach(({ name, problems }) => {
    print(`  ! ${name}`);
    problems.forEach((problem) => print(`      - ${problem}`));
});
errors.forEach(({ name, problems }) => {
    print(`  ✗ ${name}`);
    problems.forEach((problem) => print(`      - ${problem}`));
});
print(`\n통과 ${passed.length} · 경고 ${warnings.length} · 오류 ${errors.length}`);
process.exitCode = errors.length > 0 ? 1 : 0;

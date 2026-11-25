import componentSsot from '../../docs/component-ssot.md?raw';
import type { SpecGroup, SpecItem } from '../types';
import { splitCells } from '../utils/renderMarkdown';
import { CATEGORY_LABEL, COMPONENT_CATALOG } from './componentCatalog';

// 명세 메뉴·문서 (docs/design.md 1.2)
// - 화면용 문구를 따로 만들지 않고 docs/ 마크다운을 그대로 읽습니다. 문서를 고치면 화면에 바로 반영됩니다.
// - 기본설정·Layout·페이지 기능·Hooks·SSOT 문서: docs/component-ssot.md의 절·표 행
// - 컴포넌트: docs/components/*.md 파일마다 한 메뉴. 배치 / Atom / 미구현 명세로 나눕니다 (componentCatalog.ts 분류).

const SSOT_PATH = 'docs/component-ssot.md';

const COMPONENT_DOCS = import.meta.glob<string>('../../docs/components/*.md', {
    query: '?raw',
    import: 'default',
    eager: true
});

const toKebab = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

const getLines = (markdown: string) => markdown.replace(/\r\n/g, '\n').split('\n');

// 제목이 prefix로 시작하는 절의 본문 (제목 줄 제외, 같은·상위 단계 제목 전까지)
const extractSection = (markdown: string, prefix: string) => {
    const lines = getLines(markdown);
    const start = lines.findIndex((line) => /^#{1,6}\s/.test(line) && line.replace(/^#+\s+/, '').startsWith(prefix));
    if (start < 0) return '';
    const level = (lines[start].match(/^#+/) ?? [''])[0].length;
    const body: string[] = [];
    for (let i = start + 1; i < lines.length; i++) {
        const heading = lines[i].match(/^(#+)\s/);
        if (heading && heading[1].length <= level) break;
        body.push(lines[i]);
    }
    while (body.length && (!body[body.length - 1].trim() || body[body.length - 1].trim() === '---')) body.pop();
    return body.join('\n');
};

// 절 안 표에서 rowStart로 시작하는 행 하나를 "항목 | 내용" 표로 바꿈 (절 머리 인용문 포함)
const extractTableRow = (markdown: string, sectionPrefix: string, rowStart: string) => {
    const lines = getLines(extractSection(markdown, sectionPrefix));
    const tableStart = lines.findIndex((line) => line.trim().startsWith('|'));
    if (tableStart < 0) return '';
    const header = splitCells(lines[tableStart]);
    const row = lines.find((line) => line.trim().startsWith(`| ${rowStart}`));
    if (!row) return '';
    const cells = splitCells(row);
    const escapeCell = (text: string) => text.replace(/\|/g, '\\|');
    const intro = lines.slice(0, tableStart).join('\n').trim();
    const table = ['| 항목 | 내용 |', '| --- | --- |', ...header.map((title, index) => `| ${escapeCell(title)} | ${escapeCell(cells[index] ?? '')} |`)];
    return [intro, table.join('\n')].filter(Boolean).join('\n\n');
};

const sectionItem = (slug: string, label: string, groupTitle: string, prefix: string): SpecItem => ({
    slug,
    label,
    groupTitle,
    docPath: SSOT_PATH,
    markdown: extractSection(componentSsot, prefix)
});

const rowItem = (slug: string, label: string, groupTitle: string, sectionPrefix: string, rowStart: string): SpecItem => ({
    slug,
    label,
    groupTitle,
    docPath: SSOT_PATH,
    markdown: extractTableRow(componentSsot, sectionPrefix, rowStart)
});

const BASIC = '기본설정';
const LAYOUT = 'Layout';
const FEATURE = '페이지 기능';
const HOOKS = 'Hooks';
const DOCS = 'SSOT 문서';

const HOOK_NAMES = ['useRemainingHeight', 'useNearestScrollableMetrics', 'useScrollSpy', 'useMediaDevice', 'useHtmlRootClass', 'useHtmlTag', 'useLayoutClass'];

// 컴포넌트 메뉴 묶음: 스토리 분류(배치·Atom·내부 유틸) 기준, 스토리가 없는 문서는 '미구현 명세'
const UNIMPLEMENTED = '미구현 명세';

const getComponentGroupTitle = (name: string) => {
    const category = COMPONENT_CATALOG[name];
    if (!category) return UNIMPLEMENTED;
    return CATEGORY_LABEL[category === 'internal' ? 'atom' : category];
};

const COMPONENT_ITEMS: SpecItem[] = Object.entries(COMPONENT_DOCS)
    .map(([path, markdown]) => {
        const name = path.split('/').pop()?.replace(/\.md$/, '') ?? '';
        // 첫 줄 제목(# …)은 화면 제목과 겹치므로 제외
        const body = getLines(markdown);
        const content = body[0]?.startsWith('# ') ? body.slice(1).join('\n') : markdown;
        return {
            slug: toKebab(name),
            label: name,
            groupTitle: getComponentGroupTitle(name),
            docPath: `docs/components/${name}.md`,
            markdown: content,
            storyName: COMPONENT_CATALOG[name] ? name : undefined
        };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

const COMPONENT_GROUPS: SpecGroup[] = [
    { id: 'layoutComponents', title: CATEGORY_LABEL.layout, items: COMPONENT_ITEMS.filter((item) => item.groupTitle === CATEGORY_LABEL.layout) },
    { id: 'atomComponents', title: CATEGORY_LABEL.atom, items: COMPONENT_ITEMS.filter((item) => item.groupTitle === CATEGORY_LABEL.atom) },
    { id: 'unimplementedComponents', title: UNIMPLEMENTED, items: COMPONENT_ITEMS.filter((item) => item.groupTitle === UNIMPLEMENTED) }
];

export const SPEC_GROUPS: SpecGroup[] = [
    {
        id: 'basic',
        title: BASIC,
        items: [
            sectionItem('base', 'Base', BASIC, '1.1 '),
            sectionItem('color', 'Color', BASIC, '1.2 '),
            sectionItem('font', 'Font', BASIC, '1.3 '),
            sectionItem('tailwind-strategy', 'TailwindCSS 전략', BASIC, '1.4 '),
            sectionItem('naming-convention', '약속어(camelCase)', BASIC, '1.5 '),
            sectionItem('folder-structure', '폴더구조', BASIC, '1.6 ')
        ]
    },
    {
        id: 'layout',
        title: LAYOUT,
        items: [sectionItem('layout', 'Layout', LAYOUT, '2.1 '), sectionItem('layout-basic', 'Layout 기본형', LAYOUT, '2.2 ')]
    },
    {
        id: 'feature',
        title: FEATURE,
        items: [
            rowItem('page-scroll-spy', 'ScrollSpy 네비', FEATURE, '4. ', 'ScrollSpy 네비'),
            rowItem('scroll-top-button', 'Scroll Top Button', FEATURE, '4. ', 'Scroll Top Button'),
            rowItem('svg-color', 'SVG 색상 변경', FEATURE, '4. ', 'SVG 색상 변경')
        ]
    },
    {
        id: 'hooks',
        title: HOOKS,
        items: HOOK_NAMES.map((name) => rowItem(toKebab(name), name, HOOKS, '3. ', `\`${name}\``))
    },
    ...COMPONENT_GROUPS,
    {
        id: 'docs',
        title: DOCS,
        items: [
            sectionItem('conversion-rules', '공통 변환 원칙', DOCS, '0. '),
            sectionItem('ia-list', 'IA 목록 대응', DOCS, '6. '),
            sectionItem('decisions', '결정 기록', DOCS, '7. ')
        ]
    }
];

const SPEC_ITEMS = SPEC_GROUPS.flatMap((group) => group.items);

export const getSpecItem = (slug: string) => SPEC_ITEMS.find((item) => item.slug === slug);

export const getSpecHref = (slug: string) => `/spec/${slug}`;

// 컴포넌트 이름 → 명세 화면 경로: getComponentSpecHref('DatePicker') → '/spec/date-picker'
export const getComponentSpecHref = (name: string) => getSpecHref(toKebab(name));

// 문서 안 .md 링크 → 명세 화면 경로 (없는 문서는 null: 글자만 표시)
export const resolveSpecLink = (href: string) => {
    const fileName = href.split('#')[0].split('/').pop() ?? '';
    if (fileName === 'component-ssot.md') return getSpecHref('conversion-rules');
    const component = COMPONENT_ITEMS.find((item) => `${item.label}.md` === fileName);
    return component ? getSpecHref(component.slug) : null;
};

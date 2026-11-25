import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

// docs/*.md 를 화면에 그리는 작은 마크다운 변환기 (외부 라이브러리 없음, docs/design.md 1.2)
// 지원: 제목(#), 문단, 인용(>), 목록(-, 1.), 표, 코드 블록(```), 구분선(---)
//       인라인: `코드`, **굵게**, ~~취소선~~, [링크](주소), <https://주소>
// HTML 문자열을 주입하지 않고 React 요소로만 만듭니다.

// .md 링크를 화면 경로로 바꾸는 함수. 바꿀 수 없으면 null (링크 없이 글자만 표시)
export type MarkdownLinkResolver = (href: string) => string | null;

const FENCE = /^\s*```/;
const HEADING = /^(#{1,6})\s+(.*)$/;
const LIST_ITEM = /^(\s*)([-*]|\d+\.)\s+(.*)$/;
const TABLE_SEPARATOR = /^\s*\|?\s*:?-{2,}/;
const INLINE = /(`[^`]+`)|(\*\*.+?\*\*)|(~~.+?~~)|(\[[^\]]+\]\([^)\s]+\))|(<https?:\/\/[^>\s]+>)/g;

const getIndent = (line: string) => line.length - line.trimStart().length;

const dedent = (lines: string[]) => {
    const indents = lines.filter((line) => line.trim()).map(getIndent);
    const min = indents.length ? Math.min(...indents) : 0;
    return lines.map((line) => line.slice(Math.min(min, getIndent(line))));
};

// 표 칸 나누기: 역슬래시로 이스케이프한 \| 는 칸 구분이 아님
export const splitCells = (line: string) =>
    line
        .trim()
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split(/(?<!\\)\|/)
        .map((cell) => cell.trim().replace(/\\\|/g, '|'));

const renderLink = (label: ReactNode, href: string, key: string, resolveLink?: MarkdownLinkResolver) => {
    if (/^https?:\/\//.test(href)) {
        return (
            <a key={key} href={href} target="_blank" rel="noreferrer">
                {label}
            </a>
        );
    }
    const to = resolveLink?.(href);
    return to ? (
        <Link key={key} to={to}>
            {label}
        </Link>
    ) : (
        <span key={key}>{label}</span>
    );
};

export const renderInline = (text: string, resolveLink?: MarkdownLinkResolver, keyPrefix = 'i'): ReactNode[] => {
    const nodes: ReactNode[] = [];
    let lastIndex = 0;
    let index = 0;
    for (const match of text.matchAll(INLINE)) {
        const token = match[0];
        const start = match.index ?? 0;
        if (start > lastIndex) nodes.push(text.slice(lastIndex, start));
        const key = `${keyPrefix}-${index++}`;
        if (match[1]) {
            nodes.push(<code key={key}>{token.slice(1, -1)}</code>);
        } else if (match[2]) {
            nodes.push(<strong key={key}>{renderInline(token.slice(2, -2), resolveLink, key)}</strong>);
        } else if (match[3]) {
            nodes.push(<del key={key}>{renderInline(token.slice(2, -2), resolveLink, key)}</del>);
        } else if (match[4]) {
            const linkMatch = token.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
            if (linkMatch) nodes.push(renderLink(renderInline(linkMatch[1], resolveLink, key), linkMatch[2], key, resolveLink));
        } else if (match[5]) {
            const href = token.slice(1, -1);
            nodes.push(renderLink(href, href, key, resolveLink));
        }
        lastIndex = start + token.length;
    }
    if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
    return nodes;
};

const isBlockStart = (line: string, nextLine: string | undefined) =>
    FENCE.test(line) ||
    HEADING.test(line) ||
    /^\s*>/.test(line) ||
    /^\s*---\s*$/.test(line) ||
    LIST_ITEM.test(line) ||
    (line.trim().startsWith('|') && nextLine !== undefined && TABLE_SEPARATOR.test(nextLine));

export const renderMarkdown = (markdown: string, resolveLink?: MarkdownLinkResolver, keyPrefix = 'b'): ReactNode[] => {
    const lines = markdown.replace(/\r\n/g, '\n').split('\n');
    const blocks: ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];
        const key = `${keyPrefix}-${blocks.length}`;

        if (!line.trim()) {
            i++;
            continue;
        }

        // 코드 블록
        if (FENCE.test(line)) {
            const indent = getIndent(line);
            const code: string[] = [];
            i++;
            while (i < lines.length && !FENCE.test(lines[i])) {
                code.push(lines[i].slice(Math.min(indent, getIndent(lines[i]))));
                i++;
            }
            i++;
            blocks.push(
                <pre key={key} className="mdCode">
                    <code>{code.join('\n')}</code>
                </pre>
            );
            continue;
        }

        // 제목: # → h2 (페이지 제목 h2 아래 단계로 사용)
        const heading = line.match(HEADING);
        if (heading) {
            const level = Math.min(heading[1].length + 1, 6);
            const content = renderInline(heading[2], resolveLink, key);
            const Tag = `h${level}` as 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
            blocks.push(<Tag key={key}>{content}</Tag>);
            i++;
            continue;
        }

        // 구분선
        if (/^\s*---\s*$/.test(line)) {
            blocks.push(<hr key={key} />);
            i++;
            continue;
        }

        // 인용
        if (/^\s*>/.test(line)) {
            const quote: string[] = [];
            while (i < lines.length && /^\s*>/.test(lines[i])) {
                quote.push(lines[i].replace(/^\s*>\s?/, ''));
                i++;
            }
            blocks.push(
                <blockquote key={key}>
                    {quote
                        .filter((text) => text.trim())
                        .map((text, index) => (
                            <p key={index}>{renderInline(text, resolveLink, `${key}-${index}`)}</p>
                        ))}
                </blockquote>
            );
            continue;
        }

        // 표
        if (line.trim().startsWith('|') && i + 1 < lines.length && TABLE_SEPARATOR.test(lines[i + 1])) {
            const header = splitCells(line);
            const rows: string[][] = [];
            i += 2;
            while (i < lines.length && lines[i].trim().startsWith('|')) {
                rows.push(splitCells(lines[i]));
                i++;
            }
            blocks.push(
                <div key={key} className="mdTableWrap">
                    <table className="mdTable">
                        <thead>
                            <tr>
                                {header.map((cell, index) => (
                                    <th scope="col" key={index}>{renderInline(cell, resolveLink, `${key}-h${index}`)}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {header.map((_, cellIndex) => (
                                        <td key={cellIndex}>{renderInline(row[cellIndex] ?? '', resolveLink, `${key}-${rowIndex}-${cellIndex}`)}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
            continue;
        }

        // 목록 (들여쓴 줄·코드 블록은 항목 안 내용으로 처리)
        const listStart = line.match(LIST_ITEM);
        if (listStart) {
            const baseIndent = listStart[1].length;
            const isOrdered = /\d/.test(listStart[2]);
            const items: { first: string; rest: string[] }[] = [];
            while (i < lines.length) {
                const current = lines[i];
                const itemMatch = current.match(LIST_ITEM);
                if (itemMatch && itemMatch[1].length === baseIndent) {
                    items.push({ first: itemMatch[3], rest: [] });
                    i++;
                    continue;
                }
                if (!current.trim()) {
                    const next = lines[i + 1];
                    if (next !== undefined && next.trim() && getIndent(next) > baseIndent) {
                        items[items.length - 1].rest.push('');
                        i++;
                        continue;
                    }
                    break;
                }
                if (getIndent(current) > baseIndent) {
                    items[items.length - 1].rest.push(current);
                    i++;
                    continue;
                }
                break;
            }
            const ListTag = isOrdered ? 'ol' : 'ul';
            blocks.push(
                <ListTag key={key}>
                    {items.map((item, index) => (
                        <li key={index}>
                            {renderInline(item.first, resolveLink, `${key}-${index}`)}
                            {item.rest.length > 0 && renderMarkdown(dedent(item.rest).join('\n'), resolveLink, `${key}-${index}`)}
                        </li>
                    ))}
                </ListTag>
            );
            continue;
        }

        // 문단
        const paragraph: string[] = [];
        while (i < lines.length && lines[i].trim() && (paragraph.length === 0 || !isBlockStart(lines[i], lines[i + 1]))) {
            paragraph.push(lines[i].trim());
            i++;
        }
        blocks.push(<p key={key}>{renderInline(paragraph.join(' '), resolveLink, key)}</p>);
    }

    return blocks;
};

// 검색용: 마크다운 기호를 걷어낸 본문 글자 (코드 블록 안 글자도 검색 대상)
export const toPlainText = (markdown: string) =>
    markdown
        .replace(/```[a-z]*/g, ' ')
        .replace(/[#>*`|~[\]()]+|\s-{2,}\s/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

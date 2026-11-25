import type { ReactNode } from 'react';
import { classNames } from '../../utils/classNames';

// 글머리 목록 (docs/components/TextList.md)
// 순서형(decimal·circled)은 ol, 그 외 ul. 마커는 span.textListMarker[aria-hidden] (ol은 목록 번호를 보조기술이 읽음)
type TextListType = 'dot' | 'decimal' | 'circled' | 'star' | 'square';

interface TextListItem {
    content: ReactNode;
    type?: TextListType;
    marker?: string;
    number?: number;
}

interface TextListProps {
    items: (string | TextListItem)[];
    type?: TextListType;
    size?: 'sm' | 'md' | 'lg';
    start?: number;
}

const CIRCLED = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫', '⑬', '⑭', '⑮', '⑯', '⑰', '⑱', '⑲', '⑳'];
const SYMBOL: Record<TextListType, string> = { dot: '•', star: '★', square: '■', decimal: '', circled: '' };

const getMarker = (type: TextListType, number: number) => {
    if (type === 'decimal') return `${number}.`;
    if (type === 'circled') return CIRCLED[number - 1] ?? `(${number})`;
    return SYMBOL[type];
};

const TextList = ({ items, type = 'dot', size = 'md', start = 1 }: TextListProps) => {
    const isOrdered = type === 'decimal' || type === 'circled';
    const ListTag = isOrdered ? 'ol' : 'ul';

    return (
        <ListTag className={classNames('textList', size)} start={isOrdered && start !== 1 ? start : undefined}>
            {items.map((item, index) => {
                const data: TextListItem = typeof item === 'string' ? { content: item } : item;
                const itemType = data.type ?? type;
                const marker = data.marker ?? getMarker(itemType, data.number ?? start + index);
                return (
                    <li key={index} className="textListItem">
                        <span className={classNames('textListMarker', itemType)} aria-hidden="true">
                            {marker}
                        </span>
                        <span className="textListContent">{data.content}</span>
                    </li>
                );
            })}
        </ListTag>
    );
};

export default TextList;

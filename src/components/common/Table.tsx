import type { TableColumn, TableResultItem } from '../../types';
import { classNames } from '../../utils/classNames';

// 공통 표 (docs/components/Table.md — 구현 범위: type list(목록, 위쪽 열 머리글) · result(상세, 왼쪽 행 머리글))
// caption은 보조기술용(화면에는 숨김)입니다. 좁은 화면에서는 표가 가로 스크롤됩니다.
interface TableListProps<T> {
    type?: 'list';
    caption: string;
    columns: TableColumn<T>[];
    rows: T[];
    getRowKey: (row: T) => string;
}

interface TableResultProps {
    type: 'result';
    caption: string;
    items: TableResultItem[];
    itemsPerRow?: 1 | 2;
}

type TableProps<T> = TableListProps<T> | TableResultProps;

// 상세형: 항목을 itemsPerRow개씩 한 줄로 묶음
const chunkItems = (items: TableResultItem[], size: number) =>
    Array.from({ length: Math.ceil(items.length / size) }, (_value, index) => items.slice(index * size, index * size + size));

const isEmptyValue = (value: TableResultItem['value']) => value === null || value === undefined || value === '';

const Table = <T,>(props: TableProps<T>) => {
    if (props.type === 'result') {
        const { caption, items, itemsPerRow = 1 } = props;
        return (
            <div className="tableWrap">
                <table className={classNames('table', 'result', `perRow${itemsPerRow}`)}>
                    <caption className="srOnly">{caption}</caption>
                    <tbody>
                        {chunkItems(items, itemsPerRow).map((rowItems) => (
                            <tr key={rowItems.map((item) => item.key).join('-')}>
                                {rowItems.map((item, index) => {
                                    // 마지막 줄 항목이 모자라면 마지막 값 칸이 남은 칸을 채움
                                    const isLastShort = index === rowItems.length - 1 && rowItems.length < itemsPerRow;
                                    return [
                                        <th scope="row" key={`${item.key}-label`}>
                                            {item.label}
                                        </th>,
                                        <td key={`${item.key}-value`} colSpan={isLastShort ? (itemsPerRow - rowItems.length) * 2 + 1 : undefined}>
                                            {isEmptyValue(item.value) ? '-' : item.value}
                                        </td>
                                    ];
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    const { caption, columns, rows, getRowKey } = props;
    return (
        <div className="tableWrap">
            <table className="table list">
                <caption className="srOnly">{caption}</caption>
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th scope="col" key={column.key}>
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={getRowKey(row)}>
                            {columns.map((column) => (
                                <td key={column.key} className={column.align === 'center' ? 'alignCenter' : undefined}>
                                    {column.render ? column.render(row) : String(row[column.key] ?? '')}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;

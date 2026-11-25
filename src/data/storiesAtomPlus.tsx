import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import Chart from '../components/common/Chart';
import DatePicker from '../components/common/DatePicker';
import Icon from '../components/common/Icon';
import InputStepper from '../components/common/InputStepper';
import ScrollArea from '../components/common/ScrollArea';
import Slider from '../components/common/Slider';
import SortableList from '../components/common/SortableList';
import Stack from '../components/common/Stack';
import TextList from '../components/common/TextList';
import TreeView from '../components/common/TreeView';
import type { ComponentStory, ControlValues, IconName, TreeNode, TreeNodeId } from '../types';
import { readFlag, readNumber, readOption, readText, toJsx } from '../utils/storyCode';

// Atom 컴포넌트 스토리 (2) — 2026-11-25 미구현 명세에서 구현한 9종. 명세 화면 탭 (src/data/componentStories.ts)
// Chart(recharts)·DatePicker(react-day-picker·date-fns)·Slider(swiper)·SortableList·TreeView 드래그(@dnd-kit)는 사전 승인 라이브러리 사용

interface PlayProps {
    values: ControlValues;
}

interface SalesRow extends Record<string, string | number> {
    month: string;
    visitors: number;
    signups: number;
}

interface TaskItem {
    id: string;
    title: string;
}

interface SlideItem {
    id: string;
    title: string;
}

const ICON_NAMES: IconName[] = [
    'iconArrowDown', 'iconArrowUp', 'iconCalendar', 'iconCheck', 'iconChevronDown', 'iconChevronLeft', 'iconChevronRight', 'iconChevronUp',
    'iconChevronsLeft', 'iconChevronsRight', 'iconCircleAlert', 'iconCircleCheck', 'iconClose', 'iconFile', 'iconFolder', 'iconGripVertical',
    'iconInbox', 'iconInfo', 'iconLoader', 'iconMinus', 'iconPause', 'iconPlay', 'iconPlus', 'iconSearch', 'iconTriangleAlert'
];

const SALES: SalesRow[] = [
    { month: '7월', visitors: 1200, signups: 80 },
    { month: '8월', visitors: 1650, signups: 120 },
    { month: '9월', visitors: 1480, signups: 95 },
    { month: '10월', visitors: 2100, signups: 160 },
    { month: '11월', visitors: 2431, signups: 128 }
];

const SALES_SERIES = [
    { dataKey: 'visitors', name: '방문자', color: 'green' as const },
    { dataKey: 'signups', name: '가입', color: 'blue' as const }
];

const TREE_NODES: TreeNode[] = [
    { id: 'src', parent: 0, text: 'src', isFolder: true },
    { id: 'components', parent: 'src', text: 'components', isFolder: true },
    { id: 'button', parent: 'components', text: 'Button.tsx' },
    { id: 'card', parent: 'components', text: 'Card.tsx' },
    { id: 'modal', parent: 'components', text: 'Modal.tsx' },
    { id: 'pages', parent: 'src', text: 'pages', isFolder: true },
    { id: 'home', parent: 'pages', text: 'Home.tsx' },
    { id: 'spec', parent: 'pages', text: 'Spec.tsx' },
    { id: 'main', parent: 'src', text: 'main.tsx' },
    { id: 'readme', parent: 0, text: 'README.md' }
];

const TASKS: TaskItem[] = [
    { id: 'design', title: '시안 확인' },
    { id: 'markup', title: '마크업 작성' },
    { id: 'review', title: '접근성 검수' },
    { id: 'deploy', title: '배포' }
];

const SLIDES: SlideItem[] = [1, 2, 3, 4, 5].map((number) => ({ id: `slide${number}`, title: `슬라이드 ${number}` }));

const LONG_ITEMS = Array.from({ length: 20 }, (_value, index) => `알림 ${index + 1} · 새 댓글이 등록되었습니다.`);

const renderSlide = (item: SlideItem) => <div className="storySlide">{item.title}</div>;

// ---- 상태가 필요한 예제 ----

const InputStepperDemo = () => {
    const [count, setCount] = useState('1');
    const [ratio, setRatio] = useState('0.5');
    const [date, setDate] = useState('2026-11-25');
    return (
        <Stack gap="md">
            <InputStepper label="수량 (1~10)" value={count} onChange={setCount} min={1} max={10} />
            <InputStepper label="비율 (step 0.1)" value={ratio} onChange={setRatio} min={0} max={1} step={0.1} variant="chevron" />
            <InputStepper label="날짜 (일 단위)" mode="date" value={date} onChange={setDate} min="2026-11-20" max="2026-11-30" />
            <InputStepper label="읽기 전용" value="3" readOnly />
            <InputStepper label="오류" value="0" min={1} hasError errorMessage="1 이상 입력하세요." />
        </Stack>
    );
};

const DatePickerDemo = () => {
    const [date, setDate] = useState<Date | undefined>(new Date(2026, 10, 25));
    const [range, setRange] = useState<DateRange | undefined>({ from: new Date(2026, 10, 20), to: new Date(2026, 10, 25) });
    const [limited, setLimited] = useState<Date | undefined>(undefined);
    const today = new Date(2026, 10, 25);
    return (
        <Stack gap="md">
            <DatePicker label="시작일" value={date} onChange={setDate} hasReset />
            <DatePicker label="조회 기간" mode="range" value={range} onChange={setRange} hasReset />
            <DatePicker label="예약일 (오늘부터 14일, 주말 제외)" value={limited} onChange={setLimited} minDate={today} maxDate={addDays(today, 14)} disabledDates={[{ dayOfWeek: [0, 6] }]} />
            <DatePicker label="버튼형" variant="btnType" value={date} onChange={setDate} />
            <DatePicker label="오류" value={undefined} hasError errorMessage="날짜를 선택하세요." />
            <DatePicker label="비활성" value={date} disabled />
        </Stack>
    );
};

const SortableListDemo = () => {
    const [items, setItems] = useState(TASKS);
    return (
        <Stack gap="sm">
            <SortableList label="작업 순서" items={items} onChange={setItems} getItemLabel={(item) => item.title} renderItem={(item) => item.title} />
            <p className="storyText">현재 순서: {items.map((item) => item.title).join(' → ')}</p>
        </Stack>
    );
};

const TreeViewDemo = () => {
    const [nodes, setNodes] = useState(TREE_NODES);
    const [checkedIds, setCheckedIds] = useState<TreeNodeId[]>(['button']);
    return (
        <Stack gap="lg">
            <TreeView label="프로젝트 파일" nodes={nodes} onChange={setNodes} defaultOpenIds={['src', 'components']} isDraggable />
            <Stack gap="sm">
                <TreeView label="배포할 파일 선택" nodes={TREE_NODES} defaultOpenIds={['src', 'components', 'pages']} checkedIds={checkedIds} onCheckedChange={setCheckedIds} />
                <p className="storyText">선택: {checkedIds.join(', ') || '없음'}</p>
            </Stack>
        </Stack>
    );
};

// ---- Playground ----

const InputStepperPlay = ({ values }: PlayProps) => {
    const isDate = readText(values, 'mode') === 'date';
    const [number, setNumber] = useState('1');
    const [date, setDate] = useState('2026-11-25');
    return (
        <InputStepper
            label={readText(values, 'label') || '수량'}
            mode={isDate ? 'date' : 'number'}
            value={isDate ? date : number}
            onChange={isDate ? setDate : setNumber}
            variant={readOption(values, 'variant', ['plusMinus', 'chevron'] as const)}
            min={isDate ? undefined : readNumber(values, 'min')}
            max={isDate ? undefined : readNumber(values, 'max')}
            step={readNumber(values, 'step')}
            disabled={readFlag(values, 'disabled')}
            readOnly={readFlag(values, 'readOnly')}
            hasError={readFlag(values, 'hasError')}
            errorMessage={readText(values, 'errorMessage') || undefined}
        />
    );
};

const DatePickerPlay = ({ values }: PlayProps) => {
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [range, setRange] = useState<DateRange | undefined>(undefined);
    const common = {
        label: readText(values, 'label') || '날짜',
        variant: readOption(values, 'variant', ['default', 'btnType'] as const),
        placeholder: readText(values, 'placeholder') || undefined,
        hasReset: readFlag(values, 'hasReset'),
        disabled: readFlag(values, 'disabled'),
        hasError: readFlag(values, 'hasError'),
        errorMessage: readText(values, 'errorMessage') || undefined
    };
    return readText(values, 'mode') === 'range' ? <DatePicker {...common} mode="range" value={range} onChange={setRange} /> : <DatePicker {...common} value={date} onChange={setDate} />;
};

const SortableListPlay = ({ values }: PlayProps) => {
    const [items, setItems] = useState(TASKS.slice(0, Math.min(Math.max(readNumber(values, 'count'), 2), TASKS.length)));
    return <SortableList label="작업 순서" items={items} onChange={setItems} getItemLabel={(item) => item.title} renderItem={(item) => item.title} />;
};

const TreeViewPlay = ({ values }: PlayProps) => {
    const [nodes, setNodes] = useState(TREE_NODES);
    const [checkedIds, setCheckedIds] = useState<TreeNodeId[]>([]);
    const isCheckMode = readFlag(values, 'isCheckMode');
    return (
        <TreeView
            label="프로젝트 파일"
            nodes={nodes}
            onChange={setNodes}
            defaultOpenIds={['src']}
            isDraggable={readFlag(values, 'isDraggable')}
            isCascade={readFlag(values, 'isCascade')}
            checkedIds={isCheckMode ? checkedIds : undefined}
            onCheckedChange={setCheckedIds}
        />
    );
};

export const ATOM_PLUS_STORIES: ComponentStory[] = [
    {
        id: 'chart',
        name: 'Chart',
        category: 'atom',
        path: 'src/components/common/Chart.tsx',
        summary: 'recharts로 그립니다. 색은 토큰 이름으로만 받고, 같은 데이터를 보조기술용 숨김 표로 함께 제공합니다. 높이는 size 프리셋입니다.',
        api: [
            { name: 'type', type: "'line' | 'area' | 'bar' | 'pie' | 'radar'", defaultValue: 'required', desc: '차트 종류' },
            { name: 'data', type: 'T[]', defaultValue: 'required', desc: '행 데이터 (Record<string, string | number>)' },
            { name: 'xKey', type: 'keyof T', defaultValue: 'required', desc: 'x축(파이는 이름, 레이더는 각도) 키' },
            { name: 'series', type: 'ChartSeries[]', defaultValue: 'required', desc: 'dataKey · name · color(green·blue·yellow·red·purple·gray). 파이는 첫 항목만 사용' },
            { name: 'title', type: 'string', defaultValue: 'required', desc: '차트 요약 (figcaption·대체 표 caption, 화면에는 숨김)' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", desc: '높이 200 / 280 / 360px' },
            { name: 'hasLegend', type: 'boolean', defaultValue: 'true', desc: '범례 표시' }
        ],
        samples: [
            {
                title: 'line · bar',
                preview: (
                    <Stack gap="lg">
                        <Chart type="line" title="월별 방문자·가입 추이" data={SALES} xKey="month" series={SALES_SERIES} size="sm" />
                        <Chart type="bar" title="월별 방문자·가입 비교" data={SALES} xKey="month" series={SALES_SERIES} size="sm" />
                    </Stack>
                ),
                code: "const series = [\n    { dataKey: 'visitors', name: '방문자', color: 'green' },\n    { dataKey: 'signups', name: '가입', color: 'blue' }\n];\n<Chart type=\"line\" title=\"월별 방문자·가입 추이\" data={data} xKey=\"month\" series={series} />"
            },
            {
                title: 'area · pie · radar',
                preview: (
                    <Stack gap="lg">
                        <Chart type="area" title="월별 방문자 추이" data={SALES} xKey="month" series={SALES_SERIES.slice(0, 1)} size="sm" />
                        <Chart type="pie" title="월별 가입 비중" data={SALES} xKey="month" series={SALES_SERIES.slice(1)} size="sm" />
                        <Chart type="radar" title="월별 방문자·가입 분포" data={SALES} xKey="month" series={SALES_SERIES} size="sm" />
                    </Stack>
                ),
                code: '<Chart type="pie" title="월별 가입 비중" data={data} xKey="month" series={[{ dataKey: \'signups\', name: \'가입\', color: \'blue\' }]} />'
            }
        ],
        playground: {
            controls: [
                { name: 'type', type: 'select', options: ['line', 'area', 'bar', 'pie', 'radar'], defaultValue: 'line', isProp: false },
                { name: 'size', type: 'select', options: ['md', 'sm', 'lg'], defaultValue: 'md' },
                { name: 'hasLegend', type: 'boolean', defaultValue: true }
            ],
            render: (values) => (
                <Chart
                    type={readOption(values, 'type', ['line', 'area', 'bar', 'pie', 'radar'] as const)}
                    title="월별 방문자·가입"
                    data={SALES}
                    xKey="month"
                    series={readText(values, 'type') === 'pie' ? SALES_SERIES.slice(0, 1) : SALES_SERIES}
                    size={readOption(values, 'size', ['md', 'sm', 'lg'] as const)}
                    hasLegend={readFlag(values, 'hasLegend')}
                />
            ),
            code: (values, controls) => toJsx('Chart', values, controls, { extra: [`type="${readText(values, 'type')}"`, 'title="월별 방문자·가입"', 'data={data}', 'xKey="month"', 'series={series}'] })
        }
    },
    {
        id: 'datePicker',
        name: 'DatePicker',
        category: 'atom',
        path: 'src/components/common/DatePicker.tsx',
        summary: 'react-day-picker + date-fns. mode="range"로 기간을 고릅니다. 달력은 트리거 아래에 열리고 방향키로 날짜를 옮기며, ESC·바깥 클릭으로 닫고 트리거로 포커스가 돌아갑니다.',
        api: [
            { name: 'mode', type: "'single' | 'range'", defaultValue: "'single'", desc: '하나의 날짜 / 기간' },
            { name: 'value', type: 'Date | DateRange', defaultValue: '-', desc: 'single: Date · range: { from, to }' },
            { name: 'onChange', type: '(value: Date | DateRange | undefined) => void', defaultValue: '-', desc: '선택 값 전달 (지우기는 undefined)' },
            { name: 'label', type: 'string', defaultValue: 'required', desc: '라벨 (트리거 aria-labelledby)' },
            { name: 'variant', type: "'default' | 'btnType'", defaultValue: "'default'", desc: '입력형 / 버튼형' },
            { name: 'placeholder', type: 'string', defaultValue: "'YYYY.MM.DD'", desc: '값이 없을 때 문구' },
            { name: 'format', type: 'string', defaultValue: "'yyyy.MM.dd'", desc: 'date-fns 표시 형식' },
            { name: 'minDate · maxDate', type: 'Date', defaultValue: '-', desc: '선택 가능 범위 (달력 이동 범위도 제한)' },
            { name: 'disabledDates', type: 'Matcher[]', defaultValue: '[]', desc: '고를 수 없는 날 ({ dayOfWeek: [0, 6] }, { before }, 함수 등)' },
            { name: 'hasReset', type: 'boolean', defaultValue: 'false', desc: '지우기 버튼' },
            { name: 'disabled', type: 'boolean', defaultValue: 'false', desc: '비활성' },
            { name: 'hasError · errorMessage', type: 'boolean · string', defaultValue: 'false · -', desc: 'aria-invalid · aria-describedby' }
        ],
        samples: [
            {
                title: '단일 · 기간 · 제한 · 버튼형 · 상태',
                desc: '트리거를 눌러 달력을 열고 방향키·Enter·ESC로 확인하세요.',
                preview: <DatePickerDemo />,
                code: "const [date, setDate] = useState<Date>();\n<DatePicker label=\"시작일\" value={date} onChange={setDate} hasReset />\n\nconst [range, setRange] = useState<DateRange>();\n<DatePicker label=\"조회 기간\" mode=\"range\" value={range} onChange={setRange} />\n\n<DatePicker label=\"예약일\" minDate={today} maxDate={addDays(today, 14)} disabledDates={[{ dayOfWeek: [0, 6] }]} … />"
            }
        ],
        playground: {
            controls: [
                { name: 'mode', type: 'select', options: ['single', 'range'], defaultValue: 'single' },
                { name: 'label', type: 'text', defaultValue: '날짜', isProp: false },
                { name: 'variant', type: 'select', options: ['default', 'btnType'], defaultValue: 'default' },
                { name: 'placeholder', type: 'text', defaultValue: '' },
                { name: 'hasReset', type: 'boolean', defaultValue: false },
                { name: 'disabled', type: 'boolean', defaultValue: false },
                { name: 'hasError', type: 'boolean', defaultValue: false },
                { name: 'errorMessage', type: 'text', defaultValue: '' }
            ],
            render: (values) => <DatePickerPlay values={values} />,
            code: (values, controls) => toJsx('DatePicker', values, controls, { extra: [`label="${readText(values, 'label')}"`, 'value={value}', 'onChange={setValue}'] })
        }
    },
    {
        id: 'icon',
        name: 'Icon',
        category: 'atom',
        path: 'src/components/common/Icon.tsx',
        summary: 'src/assets/icons SVG를 CSS mask로 그려 현재 글자색을 입힙니다. label이 없으면 장식용(aria-hidden), 있으면 role="img"입니다.',
        api: [
            { name: 'name', type: 'IconName', defaultValue: 'required', desc: '아이콘 이름 = 파일명 (iconSearch 등 25종)' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", desc: '16 / 24 / 48px' },
            { name: 'label', type: 'string', defaultValue: '-', desc: '의미가 있는 아이콘의 이름 (없으면 장식용)' }
        ],
        samples: [
            {
                title: '아이콘 목록 (25종)',
                desc: 'Lucide 도형 (ISC, src/assets/icons/LICENSE-lucide.txt)',
                preview: (
                    <div className="storyIconGrid">
                        {ICON_NAMES.map((name) => (
                            <div key={name} className="storyIconCell">
                                <Icon name={name} />
                                <span>{name}</span>
                            </div>
                        ))}
                    </div>
                ),
                code: '<Icon name="iconSearch" />\n<Icon name="iconCircleAlert" size="sm" label="오류" />'
            },
            {
                title: 'size · 색',
                desc: '색은 부모 글자색(currentColor)을 따릅니다.',
                preview: (
                    <Stack direction="row" gap="md" align="center" isWrap>
                        <Icon name="iconCalendar" size="sm" />
                        <Icon name="iconCalendar" />
                        <Icon name="iconCalendar" size="lg" />
                        <span className="storyAccent">
                            <Icon name="iconCircleCheck" label="완료" />
                        </span>
                    </Stack>
                ),
                code: '<Icon name="iconCalendar" size="sm" />\n<Icon name="iconCalendar" size="lg" />'
            }
        ],
        playground: {
            controls: [
                { name: 'name', type: 'select', options: ICON_NAMES, defaultValue: 'iconSearch', isProp: false },
                { name: 'size', type: 'select', options: ['md', 'sm', 'lg'], defaultValue: 'md' },
                { name: 'label', type: 'text', defaultValue: '' }
            ],
            render: (values) => <Icon name={readOption(values, 'name', ICON_NAMES)} size={readOption(values, 'size', ['md', 'sm', 'lg'] as const)} label={readText(values, 'label') || undefined} />,
            code: (values, controls) => toJsx('Icon', values, controls, { extra: [`name="${readText(values, 'name')}"`] })
        }
    },
    {
        id: 'inputStepper',
        name: 'InputStepper',
        category: 'atom',
        path: 'src/components/common/InputStepper.tsx',
        summary: '숫자·날짜를 버튼과 ↑↓ 키로 증감합니다(spinbutton). min/max에 닿으면 해당 버튼이 비활성됩니다. date 모드는 일 단위입니다.',
        api: [
            { name: 'value', type: 'string', defaultValue: 'required', desc: "number: '1.5' / date: 'YYYY-MM-DD'" },
            { name: 'onChange', type: '(value: string) => void', defaultValue: '-', desc: '값 전달' },
            { name: 'label', type: 'string', defaultValue: 'required', desc: '라벨 (버튼 이름: "수량 감소")' },
            { name: 'mode', type: "'number' | 'date'", defaultValue: "'number'", desc: '숫자 / 날짜' },
            { name: 'variant', type: "'plusMinus' | 'chevron'", defaultValue: "'plusMinus'", desc: '양쪽 −/+ / 오른쪽 ▲▼' },
            { name: 'min · max', type: 'number | string', defaultValue: '-', desc: '범위 (date는 YYYY-MM-DD)' },
            { name: 'step', type: 'number', defaultValue: '1', desc: '증감 단위 (date는 일)' },
            { name: 'disabled · readOnly', type: 'boolean', defaultValue: 'false', desc: '비활성 · 읽기 전용(버튼도 비활성)' },
            { name: 'hasError · errorMessage', type: 'boolean · string', defaultValue: 'false · -', desc: 'aria-invalid · aria-describedby' }
        ],
        samples: [
            {
                title: '숫자 · 소수 · 날짜 · 읽기 전용 · 오류',
                preview: <InputStepperDemo />,
                code: "const [count, setCount] = useState('1');\n<InputStepper label=\"수량\" value={count} onChange={setCount} min={1} max={10} />\n<InputStepper label=\"날짜\" mode=\"date\" value={date} onChange={setDate} min=\"2026-11-20\" max=\"2026-11-30\" />"
            }
        ],
        playground: {
            controls: [
                { name: 'label', type: 'text', defaultValue: '수량', isProp: false },
                { name: 'mode', type: 'select', options: ['number', 'date'], defaultValue: 'number' },
                { name: 'variant', type: 'select', options: ['plusMinus', 'chevron'], defaultValue: 'plusMinus' },
                { name: 'min', type: 'number', defaultValue: 0 },
                { name: 'max', type: 'number', defaultValue: 10 },
                { name: 'step', type: 'number', defaultValue: 1, min: 1, max: 10 },
                { name: 'disabled', type: 'boolean', defaultValue: false },
                { name: 'readOnly', type: 'boolean', defaultValue: false },
                { name: 'hasError', type: 'boolean', defaultValue: false },
                { name: 'errorMessage', type: 'text', defaultValue: '' }
            ],
            render: (values) => <InputStepperPlay values={values} />,
            code: (values, controls) =>
                toJsx('InputStepper', values, controls, {
                    omit: ['min', 'max'],
                    extra: [`label="${readText(values, 'label')}"`, 'value={value}', 'onChange={setValue}', ...(readText(values, 'mode') === 'date' ? [] : [`min={${readNumber(values, 'min')}}`, `max={${readNumber(values, 'max')}}`])]
                })
        }
    },
    {
        id: 'scrollArea',
        name: 'ScrollArea',
        category: 'atom',
        path: 'src/components/common/ScrollArea.tsx',
        summary: '라이브러리 없이 overflow + 얇은 스크롤바로 만든 스크롤 영역입니다. tabIndex=0 · role="region" · aria-label로 키보드 스크롤이 됩니다. 높이는 size 프리셋입니다.',
        api: [
            { name: 'label', type: 'string', defaultValue: 'required', desc: '영역 이름 (aria-label)' },
            { name: 'orientation', type: "'vertical' | 'horizontal' | 'both'", defaultValue: "'vertical'", desc: '스크롤 방향' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", desc: '최대 높이 160 / 240 / 360px (디자인 확정 전 임시 값)' },
            { name: 'children', type: 'ReactNode', defaultValue: 'required', desc: '내용' }
        ],
        samples: [
            {
                title: 'vertical · horizontal',
                desc: '영역을 Tab으로 선택한 뒤 방향키로 스크롤해 보세요.',
                preview: (
                    <Stack gap="md">
                        <ScrollArea label="알림 목록" size="sm">
                            <div className="storyScrollContent">
                                <TextList items={LONG_ITEMS} size="sm" />
                            </div>
                        </ScrollArea>
                        <ScrollArea label="태그 목록" orientation="horizontal">
                            <div className="storyScrollRow">
                                {Array.from({ length: 16 }, (_value, index) => (
                                    <span key={index} className="storyBox">
                                        태그 {index + 1}
                                    </span>
                                ))}
                            </div>
                        </ScrollArea>
                    </Stack>
                ),
                code: '<ScrollArea label="알림 목록" size="sm">…</ScrollArea>\n<ScrollArea label="태그 목록" orientation="horizontal">…</ScrollArea>'
            }
        ],
        playground: {
            controls: [
                { name: 'orientation', type: 'select', options: ['vertical', 'horizontal', 'both'], defaultValue: 'vertical' },
                { name: 'size', type: 'select', options: ['md', 'sm', 'lg'], defaultValue: 'md' }
            ],
            render: (values) => (
                <ScrollArea label="샘플 영역" orientation={readOption(values, 'orientation', ['vertical', 'horizontal', 'both'] as const)} size={readOption(values, 'size', ['md', 'sm', 'lg'] as const)}>
                    <div className={readText(values, 'orientation') === 'vertical' ? 'storyScrollContent' : 'storyScrollContent wide'}>
                        <TextList items={LONG_ITEMS} size="sm" />
                    </div>
                </ScrollArea>
            ),
            code: (values, controls) => toJsx('ScrollArea', values, controls, { extra: ['label="알림 목록"'], children: '\n    …\n' })
        }
    },
    {
        id: 'slider',
        name: 'Slider',
        category: 'atom',
        path: 'src/components/common/Slider.tsx',
        summary: 'swiper/react 캐러셀입니다. navigation·pagination·autoplay·loop·breakpoints 같은 옵션은 디자인에 있는 것만 options로 넘깁니다. autoplay면 정지/재생 버튼이 함께 나옵니다.',
        api: [
            { name: 'items', type: 'T[] (T extends { id: string })', defaultValue: 'required', desc: '슬라이드 데이터' },
            { name: 'renderItem', type: '(item: T) => ReactNode', defaultValue: 'required', desc: '슬라이드 내용' },
            { name: 'label', type: 'string', defaultValue: 'required', desc: '캐러셀 이름 (aria-label)' },
            { name: 'options', type: "Omit<SwiperProps, 'children' | 'modules'>", defaultValue: '{}', desc: 'navigation · pagination · autoplay · loop · slidesPerView · breakpoints · keyboard 등' },
            { name: 'options.onSlideChange', type: '(swiper) => void', defaultValue: '-', desc: '슬라이드 변경 이벤트 (인덱스 표시가 디자인에 있을 때만)' }
        ],
        samples: [
            {
                title: 'navigation · pagination',
                preview: <Slider label="기본 슬라이드" items={SLIDES} renderItem={renderSlide} options={{ navigation: true, pagination: { clickable: true }, keyboard: { enabled: true } }} />,
                code: '<Slider label="기본 슬라이드" items={items} renderItem={(item) => <div>{item.title}</div>}\n    options={{ navigation: true, pagination: { clickable: true }, keyboard: { enabled: true } }} />'
            },
            {
                title: 'breakpoints · autoplay (정지 버튼)',
                desc: '모바일 1장 → 768px 2장 → 1024px 3장, 3초마다 이동 (오른쪽 아래 버튼으로 정지)',
                preview: (
                    <Slider
                        label="자동 재생 슬라이드"
                        items={SLIDES}
                        renderItem={renderSlide}
                        options={{ loop: true, autoplay: { delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }, pagination: { clickable: true }, breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } } }}
                    />
                ),
                code: '<Slider label="자동 재생" items={items} renderItem={renderSlide} options={{\n    loop: true,\n    autoplay: { delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true },\n    breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }\n}} />'
            }
        ],
        playground: {
            controls: [
                { name: 'navigation', type: 'boolean', defaultValue: true },
                { name: 'pagination', type: 'boolean', defaultValue: true },
                { name: 'loop', type: 'boolean', defaultValue: false },
                { name: 'autoplay', type: 'boolean', defaultValue: false },
                { name: 'slidesPerView', type: 'number', defaultValue: 1, min: 1, max: 4 }
            ],
            render: (values) => (
                <Slider
                    label="샘플 슬라이드"
                    items={SLIDES}
                    renderItem={renderSlide}
                    options={{
                        navigation: readFlag(values, 'navigation'),
                        pagination: readFlag(values, 'pagination') ? { clickable: true } : false,
                        loop: readFlag(values, 'loop'),
                        autoplay: readFlag(values, 'autoplay') ? { delay: 2500, disableOnInteraction: false } : false,
                        slidesPerView: Math.max(1, readNumber(values, 'slidesPerView'))
                    }}
                />
            ),
            code: (values) => {
                const options = [
                    readFlag(values, 'navigation') ? 'navigation: true' : '',
                    readFlag(values, 'pagination') ? 'pagination: { clickable: true }' : '',
                    readFlag(values, 'loop') ? 'loop: true' : '',
                    readFlag(values, 'autoplay') ? 'autoplay: { delay: 2500, disableOnInteraction: false }' : '',
                    readNumber(values, 'slidesPerView') > 1 ? `slidesPerView: ${readNumber(values, 'slidesPerView')}` : ''
                ].filter(Boolean);
                return `<Slider label="샘플 슬라이드" items={items} renderItem={renderSlide}${options.length ? ` options={{ ${options.join(', ')} }}` : ''} />`;
            }
        }
    },
    {
        id: 'sortableList',
        name: 'SortableList',
        category: 'atom',
        path: 'src/components/common/SortableList.tsx',
        summary: '@dnd-kit 순서 바꾸기 목록입니다. 그립 핸들을 끌거나(터치는 길게 누르기), 핸들에서 Space → ↑↓ → Space, 또는 위로·아래로 버튼으로 옮깁니다. 바뀐 순서는 aria-live로 안내합니다.',
        api: [
            { name: 'items', type: 'T[] (T extends { id: string })', defaultValue: 'required', desc: '항목 (현재 순서)' },
            { name: 'onChange', type: '(items: T[]) => void', defaultValue: '-', desc: '바뀐 순서 전달' },
            { name: 'renderItem', type: '(item: T) => ReactNode', defaultValue: 'required', desc: '항목 내용' },
            { name: 'getItemLabel', type: '(item: T) => string', defaultValue: 'required', desc: '버튼 이름·안내 문구용 항목 이름' },
            { name: 'label', type: 'string', defaultValue: 'required', desc: '목록 이름 (aria-label)' }
        ],
        samples: [{ title: '드래그 · 키보드 · 버튼', preview: <SortableListDemo />, code: 'const [items, setItems] = useState(tasks);\n<SortableList label="작업 순서" items={items} onChange={setItems}\n    getItemLabel={(item) => item.title} renderItem={(item) => item.title} />' }],
        playground: {
            controls: [{ name: 'count', type: 'number', defaultValue: 4, min: 2, max: 4, isProp: false }],
            render: (values) => <SortableListPlay values={values} />,
            code: () => '<SortableList label="작업 순서" items={items} onChange={setItems} getItemLabel={(item) => item.title} renderItem={(item) => item.title} />'
        }
    },
    {
        id: 'textList',
        name: 'TextList',
        category: 'atom',
        path: 'src/components/common/TextList.tsx',
        summary: '글머리 목록입니다. 순서형(decimal·circled)은 ol, 나머지는 ul로 그리고, 마커는 aria-hidden입니다. 간격은 size별로 고정입니다.',
        api: [
            { name: 'items', type: '(string | TextListItem)[]', defaultValue: 'required', desc: '문자열 또는 { content, type, marker, number }' },
            { name: 'type', type: "'dot' | 'decimal' | 'circled' | 'star' | 'square'", defaultValue: "'dot'", desc: '마커 종류 (항목별 type으로 덮어쓰기 가능)' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", desc: '글자 12 / 14 / 16px' },
            { name: 'start', type: 'number', defaultValue: '1', desc: 'decimal·circled 시작 번호' }
        ],
        samples: [
            {
                title: 'type',
                preview: (
                    <div className="storyColumns">
                        {(['dot', 'decimal', 'circled', 'star', 'square'] as const).map((type) => (
                            <Stack key={type} gap="sm">
                                <p className="storyText">type="{type}"</p>
                                <TextList type={type} items={['배송은 2~3일 걸립니다.', '주말에는 출고하지 않습니다.', '제주·도서 지역은 추가 비용이 있습니다.']} />
                            </Stack>
                        ))}
                    </div>
                ),
                code: "<TextList items={['배송은 2~3일 걸립니다.', '주말에는 출고하지 않습니다.']} />\n<TextList type=\"circled\" items={items} start={3} />"
            },
            {
                title: '항목별 마커 · size',
                preview: (
                    <Stack gap="md">
                        <TextList items={[{ content: '필수 항목', type: 'star' }, '일반 항목', { content: '참고', marker: '※' }]} />
                        <TextList size="sm" type="decimal" items={['작은 글자 (sm)', '두 번째']} />
                        <TextList size="lg" type="decimal" start={3} items={['큰 글자 (lg), 3부터 시작', '네 번째']} />
                    </Stack>
                ),
                code: "<TextList items={[{ content: '필수 항목', type: 'star' }, '일반 항목', { content: '참고', marker: '※' }]} />"
            }
        ],
        playground: {
            controls: [
                { name: 'type', type: 'select', options: ['dot', 'decimal', 'circled', 'star', 'square'], defaultValue: 'dot' },
                { name: 'size', type: 'select', options: ['md', 'sm', 'lg'], defaultValue: 'md' },
                { name: 'start', type: 'number', defaultValue: 1, min: 1, max: 20 }
            ],
            render: (values) => (
                <TextList
                    type={readOption(values, 'type', ['dot', 'decimal', 'circled', 'star', 'square'] as const)}
                    size={readOption(values, 'size', ['md', 'sm', 'lg'] as const)}
                    start={Math.max(1, readNumber(values, 'start'))}
                    items={['첫 번째 항목', '두 번째 항목', '세 번째 항목']}
                />
            ),
            code: (values, controls) => toJsx('TextList', values, controls, { extra: ['items={items}'] })
        }
    },
    {
        id: 'treeView',
        name: 'TreeView',
        category: 'atom',
        path: 'src/components/common/TreeView.tsx',
        summary: 'WAI-ARIA Tree View: ↑↓ 이동 · → 펼치기 · ← 접기/부모 · Home·End · Space 체크. checkedIds를 넘기면 체크 모드(하위 연동), isDraggable이면 같은 폴더 안에서 끌기·Alt+↑↓로 순서를 바꿉니다(@dnd-kit).',
        api: [
            { name: 'nodes', type: 'TreeNode[]', defaultValue: 'required', desc: '평면 배열 { id, parent, text, isFolder } (최상위 parent는 없는 id, 예: 0)' },
            { name: 'label', type: 'string', defaultValue: 'required', desc: '트리 이름 (aria-label)' },
            { name: 'defaultOpenIds', type: 'TreeNodeId[]', defaultValue: '[]', desc: '처음 펼쳐 둘 폴더' },
            { name: 'checkedIds', type: 'TreeNodeId[]', defaultValue: '-', desc: '넘기면 체크 모드 (aria-checked)' },
            { name: 'onCheckedChange', type: '(ids: TreeNodeId[]) => void', defaultValue: '-', desc: '체크된 id 전달' },
            { name: 'isCascade', type: 'boolean', defaultValue: 'true', desc: '폴더 체크 시 하위 연동, 일부만 체크면 mixed' },
            { name: 'isDraggable', type: 'boolean', defaultValue: 'false', desc: '같은 폴더 안 순서 변경 (끌기 · Alt+↑↓)' },
            { name: 'onChange', type: '(nodes: TreeNode[]) => void', defaultValue: '-', desc: '순서가 바뀐 nodes 전달' },
            { name: 'renderLabel', type: '(node: TreeNode) => ReactNode', defaultValue: '-', desc: '이름 영역 커스텀 (수정·삭제 버튼 등)' }
        ],
        samples: [
            {
                title: '드래그 정렬 · 체크(하위 연동)',
                desc: '위: 그립을 끌거나 항목에서 Alt+↑↓ / 아래: 폴더를 체크하면 하위가 함께 체크됩니다.',
                preview: <TreeViewDemo />,
                code: "const [nodes, setNodes] = useState(treeNodes);\n<TreeView label=\"프로젝트 파일\" nodes={nodes} onChange={setNodes} defaultOpenIds={['src']} isDraggable />\n\nconst [checkedIds, setCheckedIds] = useState<TreeNodeId[]>([]);\n<TreeView label=\"배포할 파일\" nodes={nodes} checkedIds={checkedIds} onCheckedChange={setCheckedIds} />"
            }
        ],
        playground: {
            controls: [
                { name: 'isCheckMode', type: 'boolean', defaultValue: false, isProp: false },
                { name: 'isCascade', type: 'boolean', defaultValue: true },
                { name: 'isDraggable', type: 'boolean', defaultValue: false }
            ],
            render: (values) => <TreeViewPlay values={values} />,
            code: (values, controls) =>
                toJsx('TreeView', values, controls, {
                    extra: ['label="프로젝트 파일"', 'nodes={nodes}', ...(readFlag(values, 'isDraggable') ? ['onChange={setNodes}'] : []), ...(readFlag(values, 'isCheckMode') ? ['checkedIds={checkedIds}', 'onCheckedChange={setCheckedIds}'] : [])]
                })
        }
    }
];

import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Chip from '../components/common/Chip';
import Grid from '../components/common/Grid';
import Section from '../components/common/Section';
import Stack from '../components/common/Stack';
import Table from '../components/common/Table';
import type { ChipColor, ComponentStory, SpaceSize, TableColumn, TableResultItem } from '../types';
import { readFlag, readNumber, readOption, readText, toJsx } from '../utils/storyCode';

// 배치 컴포넌트 스토리 (docs/component-ssot.md 2.3) — 명세 화면 탭 (src/data/componentStories.ts)
// 예제 마크업은 common.css 클래스만 씁니다 (story* 클래스).

interface SampleRow {
    id: string;
    task: string;
    owner: string;
    status: string;
    color: ChipColor;
}

interface StoryBoxesProps {
    count: number;
}

const SPACE_SIZES: SpaceSize[] = ['sm', 'md', 'lg'];
const SPACE_OPTIONS = ['sm', 'md', 'lg'] as const;

const SAMPLE_ROWS: SampleRow[] = [
    { id: 'banner', task: '배너 문구 수정', owner: '디자인팀', status: '완료', color: 'green' },
    { id: 'api', task: '회원 통계 API 점검', owner: '개발팀', status: '진행중', color: 'blue' }
];

const SAMPLE_COLUMNS: TableColumn<SampleRow>[] = [
    { key: 'task', header: '업무' },
    { key: 'owner', header: '담당', align: 'center' },
    { key: 'status', header: '상태', render: (row) => <Chip label={row.status} color={row.color} /> }
];

const SAMPLE_RESULT_ITEMS: TableResultItem[] = [
    { key: 'name', label: '신청자', value: '홍길동' },
    { key: 'date', label: '신청일', value: '2026-11-25' },
    { key: 'type', label: '구분', value: '지급 기준 변경' },
    { key: 'status', label: '상태', value: <Chip label="승인" color="green" /> },
    { key: 'memo', label: '메모', value: '' }
];

// 간격이 보이도록 점선 칸 (common.css .storyBox)
const StoryBoxes = ({ count }: StoryBoxesProps) => (
    <>
        {Array.from({ length: count }, (_value, index) => (
            <div key={index} className="storyBox">
                {index + 1}
            </div>
        ))}
    </>
);

export const LAYOUT_STORIES: ComponentStory[] = [
    {
        id: 'stack',
        name: 'Stack',
        category: 'layout',
        path: 'src/components/common/Stack.tsx',
        summary: '자식을 한 방향으로 쌓고 형제 사이 간격(gap)을 정합니다. 자식에 margin을 주지 않습니다.',
        api: [
            { name: 'direction', type: "'column' | 'row'", defaultValue: "'column'", desc: '쌓는 방향' },
            { name: 'gap', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", desc: '형제 사이 간격 8 / 16 / 24px (--gap-*)' },
            { name: 'align', type: "'start' | 'center' | 'end' | 'stretch'", defaultValue: "'stretch'", desc: '교차축 정렬' },
            { name: 'justify', type: "'start' | 'center' | 'end' | 'between'", defaultValue: "'start'", desc: '주축 정렬' },
            { name: 'isWrap', type: 'boolean', defaultValue: 'false', desc: 'row에서 줄바꿈' },
            { name: 'children', type: 'ReactNode', defaultValue: 'required', desc: '쌓을 요소' }
        ],
        samples: [
            {
                title: 'gap',
                desc: 'sm 8px · md 16px · lg 24px',
                preview: (
                    <Grid columns={3}>
                        {SPACE_SIZES.map((size) => (
                            <Stack key={size} gap="sm">
                                <p className="storyText">gap="{size}"</p>
                                <Stack gap={size}>
                                    <StoryBoxes count={3} />
                                </Stack>
                            </Stack>
                        ))}
                    </Grid>
                ),
                code: '<Stack gap="lg">\n    <Section …/>\n    <Section …/>\n</Stack>'
            },
            {
                title: 'row · justify · isWrap',
                desc: '버튼 줄: 오른쪽 정렬 / 양 끝 정렬',
                preview: (
                    <Stack gap="sm">
                        <Stack direction="row" gap="sm" justify="end">
                            <Button size="sm" shape="square">취소</Button>
                            <Button size="sm" shape="square">저장</Button>
                        </Stack>
                        <Stack direction="row" gap="sm" justify="between" align="center" isWrap>
                            <span className="storyText">총 24건</span>
                            <Button size="sm" shape="square">내보내기</Button>
                        </Stack>
                    </Stack>
                ),
                code: '<Stack direction="row" gap="sm" justify="end">\n    <Button size="sm" shape="square">취소</Button>\n    <Button size="sm" shape="square">저장</Button>\n</Stack>'
            }
        ],
        playground: {
            controls: [
                { name: 'direction', type: 'select', options: ['column', 'row'], defaultValue: 'column' },
                { name: 'gap', type: 'select', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
                { name: 'align', type: 'select', options: ['stretch', 'start', 'center', 'end'], defaultValue: 'stretch' },
                { name: 'justify', type: 'select', options: ['start', 'center', 'end', 'between'], defaultValue: 'start' },
                { name: 'isWrap', type: 'boolean', defaultValue: false },
                { name: 'count', type: 'number', defaultValue: 3, min: 1, max: 12, isProp: false }
            ],
            render: (values) => (
                <Stack
                    direction={readOption(values, 'direction', ['column', 'row'] as const)}
                    gap={readOption(values, 'gap', SPACE_OPTIONS)}
                    align={readOption(values, 'align', ['stretch', 'start', 'center', 'end'] as const)}
                    justify={readOption(values, 'justify', ['start', 'center', 'end', 'between'] as const)}
                    isWrap={readFlag(values, 'isWrap')}
                >
                    <StoryBoxes count={readNumber(values, 'count')} />
                </Stack>
            ),
            code: (values, controls) => toJsx('Stack', values, controls, { children: '\n    …\n' })
        }
    },
    {
        id: 'grid',
        name: 'Grid',
        category: 'layout',
        path: 'src/components/common/Grid.tsx',
        summary: '같은 폭의 열로 나눕니다. 모바일 1열 → 768px 최대 2열 → 1024px 이상 columns열입니다.',
        api: [
            { name: 'columns', type: '1 | 2 | 3 | 4', defaultValue: '2', desc: '데스크톱(1024px 이상) 열 수' },
            { name: 'gap', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", desc: '칸 사이 간격 8 / 16 / 24px' },
            { name: 'children', type: 'ReactNode', defaultValue: 'required', desc: '칸' }
        ],
        samples: [
            {
                title: 'columns',
                desc: '2 · 3 · 4열 (화면 폭이 좁으면 열 수가 줄어듭니다)',
                preview: (
                    <Stack gap="md">
                        <Grid columns={2}>
                            <StoryBoxes count={2} />
                        </Grid>
                        <Grid columns={3}>
                            <StoryBoxes count={3} />
                        </Grid>
                        <Grid columns={4}>
                            <StoryBoxes count={4} />
                        </Grid>
                    </Stack>
                ),
                code: '<Grid columns={3}>\n    <Card title="방문자">…</Card>\n    <Card title="가입">…</Card>\n    <Card title="매출">…</Card>\n</Grid>'
            },
            {
                title: 'gap',
                desc: 'sm 8px · md 16px · lg 24px',
                preview: (
                    <Stack gap="md">
                        {SPACE_SIZES.map((size) => (
                            <Grid key={size} columns={4} gap={size}>
                                <StoryBoxes count={4} />
                            </Grid>
                        ))}
                    </Stack>
                ),
                code: '<Grid columns={4} gap="sm">…</Grid>\n<Grid columns={4} gap="lg">…</Grid>'
            }
        ],
        playground: {
            controls: [
                { name: 'columns', type: 'select', options: ['1', '2', '3', '4'], defaultValue: '2' },
                { name: 'gap', type: 'select', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
                { name: 'count', type: 'number', defaultValue: 6, min: 1, max: 12, isProp: false }
            ],
            render: (values) => (
                <Grid columns={Number(readOption(values, 'columns', ['2', '1', '3', '4'] as const)) as 1 | 2 | 3 | 4} gap={readOption(values, 'gap', SPACE_OPTIONS)}>
                    <StoryBoxes count={readNumber(values, 'count')} />
                </Grid>
            ),
            code: (values, controls) =>
                toJsx('Grid', values, controls, {
                    omit: ['columns'],
                    extra: readText(values, 'columns') === '2' ? [] : [`columns={${readText(values, 'columns')}}`],
                    children: '\n    …\n'
                })
        }
    },
    {
        id: 'section',
        name: 'Section',
        category: 'layout',
        path: 'src/components/common/Section.tsx',
        summary: '제목·설명·버튼 + 콘텐츠를 묶는 배경 없는 구역입니다. section[aria-labelledby]로 렌더링합니다. headingLevel 2는 페이지 루트입니다.',
        api: [
            { name: 'title', type: 'string', defaultValue: 'required', desc: '구역 제목 (useId로 aria-labelledby 연결)' },
            { name: 'description', type: 'string', defaultValue: '-', desc: '제목 아래 설명' },
            { name: 'action', type: 'ReactNode', defaultValue: '-', desc: '머리 오른쪽 (버튼 등)' },
            { name: 'headingLevel', type: '2 | 3 | 4', defaultValue: '3', desc: '제목 태그 단계. 2 = 페이지 루트(24px), 3·4 = 구역(18px)' },
            { name: 'gap', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", desc: '머리와 몸통 사이 간격' },
            { name: 'children', type: 'ReactNode', defaultValue: 'required', desc: '구역 내용' }
        ],
        samples: [
            {
                title: '조합 예',
                desc: '페이지 Stack(lg) → Section → Grid → Card(headingLevel 4) — 배치 규칙 component-ssot.md 2.3',
                preview: (
                    <Stack gap="lg">
                        <Section title="이번 달 요약" description="11월 1일 ~ 25일 기준" action={<Button size="sm" shape="square">내보내기</Button>}>
                            <Grid columns={3}>
                                <Card title="방문자" size="sm" headingLevel={4}>
                                    <p className="storyValue">2,431</p>
                                </Card>
                                <Card title="가입" size="sm" headingLevel={4}>
                                    <p className="storyValue">128</p>
                                </Card>
                                <Card title="문의" size="sm" headingLevel={4}>
                                    <p className="storyValue">17</p>
                                </Card>
                            </Grid>
                        </Section>
                        <Section title="신청 내용">
                            <Card>
                                <Table type="result" caption="신청 내용" items={SAMPLE_RESULT_ITEMS} itemsPerRow={2} />
                            </Card>
                        </Section>
                    </Stack>
                ),
                code: '<Stack gap="lg">\n    <Section title="이번 달 요약" description="…" action={<Button size="sm">내보내기</Button>}>\n        <Grid columns={3}>\n            <Card title="방문자" size="sm" headingLevel={4}>…</Card>\n            …\n        </Grid>\n    </Section>\n    <Section title="신청 내용">\n        <Card>\n            <Table type="result" caption="신청 내용" items={items} itemsPerRow={2} />\n        </Card>\n    </Section>\n</Stack>'
            }
        ],
        playground: {
            controls: [
                { name: 'title', type: 'text', defaultValue: '이번 달 요약', isProp: false },
                { name: 'description', type: 'text', defaultValue: '11월 1일 ~ 25일 기준' },
                { name: 'headingLevel', type: 'select', options: ['3', '2', '4'], defaultValue: '3', isProp: false },
                { name: 'gap', type: 'select', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
                { name: 'hasAction', type: 'boolean', defaultValue: true, isProp: false }
            ],
            render: (values) => (
                <Section
                    title={readText(values, 'title') || '제목'}
                    description={readText(values, 'description') || undefined}
                    headingLevel={Number(readOption(values, 'headingLevel', ['3', '2', '4'] as const)) as 2 | 3 | 4}
                    gap={readOption(values, 'gap', SPACE_OPTIONS)}
                    action={readFlag(values, 'hasAction') ? <Button size="sm" shape="square">내보내기</Button> : undefined}
                >
                    <StoryBoxes count={1} />
                </Section>
            ),
            code: (values, controls) =>
                toJsx('Section', values, controls, {
                    extra: [
                        `title="${readText(values, 'title')}"`,
                        ...(readText(values, 'headingLevel') === '3' ? [] : [`headingLevel={${readText(values, 'headingLevel')}}`]),
                        ...(readFlag(values, 'hasAction') ? ['action={<Button size="sm">내보내기</Button>}'] : [])
                    ],
                    children: '\n    …\n'
                })
        }
    },
    {
        id: 'card',
        name: 'Card',
        category: 'layout',
        path: 'src/components/common/Card.tsx',
        summary: 'title이 있으면 section(aria-labelledby), 없으면 div로 렌더링합니다. 폭은 부모(Grid·Stack)가 정합니다.',
        api: [
            { name: 'title', type: 'string', defaultValue: '-', desc: '카드 제목' },
            { name: 'description', type: 'string', defaultValue: '-', desc: '제목 아래 보조 설명' },
            { name: 'size', type: "'md' | 'sm'", defaultValue: "'md'", desc: '제목 16px/600 · 14px/500' },
            { name: 'padding', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", desc: '안쪽 여백 8 / 16 / 24px (사이 간격은 절반)' },
            { name: 'headingLevel', type: '2 | 3 | 4', defaultValue: '3', desc: '제목 태그 단계 (Section 안이면 4)' },
            { name: 'action', type: 'ReactNode', defaultValue: '-', desc: '헤더 우측 영역' },
            { name: 'footer', type: 'ReactNode', defaultValue: '-', desc: '하단 영역 (위 구분선)' },
            { name: 'children', type: 'ReactNode', defaultValue: 'required', desc: '카드 본문' }
        ],
        samples: [
            {
                title: 'size · action',
                preview: (
                    <Grid columns={2}>
                        <Card title="오늘 방문자" size="sm">
                            <Stack gap="sm" align="start">
                                <p className="storyValue">2,431</p>
                                <Chip label="+12.4%" />
                            </Stack>
                        </Card>
                        <Card title="알림" action={<Button size="sm" shape="square">전체 읽음</Button>}>
                            <p className="storyText">신규 댓글이 등록되었습니다.</p>
                        </Card>
                    </Grid>
                ),
                code: '<Card title="오늘 방문자" size="sm">…</Card>\n<Card title="알림" action={<Button size="sm" shape="square">전체 읽음</Button>}>…</Card>'
            },
            {
                title: 'padding',
                desc: 'sm 8px · md 16px · lg 24px',
                preview: (
                    <Grid columns={3}>
                        {SPACE_SIZES.map((size) => (
                            <Card key={size} title={`padding="${size}"`} size="sm" padding={size}>
                                <p className="storyText">본문 내용</p>
                            </Card>
                        ))}
                    </Grid>
                ),
                code: '<Card title="요약" padding="lg">…</Card>'
            },
            {
                title: 'description · footer',
                preview: (
                    <Card
                        title="지급 계좌"
                        description="정산 금액이 입금되는 계좌입니다."
                        action={<Button size="sm" shape="square">변경</Button>}
                        footer={
                            <Stack direction="row" gap="sm" justify="end">
                                <Button size="sm" shape="square">내역 보기</Button>
                            </Stack>
                        }
                    >
                        <p className="storyText">국민은행 123-45-6789 (홍길동)</p>
                    </Card>
                ),
                code: '<Card title="지급 계좌" description="…" action={<Button size="sm">변경</Button>}\n    footer={<Stack direction="row" gap="sm" justify="end">…</Stack>}>\n    …\n</Card>'
            }
        ],
        playground: {
            controls: [
                { name: 'title', type: 'text', defaultValue: '카드 제목', isProp: false },
                { name: 'description', type: 'text', defaultValue: '' },
                { name: 'size', type: 'select', options: ['md', 'sm'], defaultValue: 'md' },
                { name: 'padding', type: 'select', options: ['md', 'sm', 'lg'], defaultValue: 'md' },
                { name: 'hasAction', type: 'boolean', defaultValue: false, isProp: false },
                { name: 'hasFooter', type: 'boolean', defaultValue: false, isProp: false }
            ],
            render: (values) => (
                <Card
                    title={readText(values, 'title') || undefined}
                    description={readText(values, 'description') || undefined}
                    size={readOption(values, 'size', ['md', 'sm'] as const)}
                    padding={readOption(values, 'padding', ['md', 'sm', 'lg'] as const)}
                    action={readFlag(values, 'hasAction') ? <Button size="sm" shape="square">더보기</Button> : undefined}
                    footer={readFlag(values, 'hasFooter') ? <p className="storyText">하단 영역</p> : undefined}
                >
                    <p className="storyText">카드 본문입니다.</p>
                </Card>
            ),
            code: (values, controls) =>
                toJsx('Card', values, controls, {
                    extra: [
                        ...(readText(values, 'title') ? [`title="${readText(values, 'title')}"`] : []),
                        ...(readFlag(values, 'hasAction') ? ['action={<Button size="sm">더보기</Button>}'] : []),
                        ...(readFlag(values, 'hasFooter') ? ['footer={…}'] : [])
                    ],
                    children: '\n    …\n'
                })
        }
    },
    {
        id: 'table',
        name: 'Table',
        category: 'layout',
        path: 'src/components/common/Table.tsx',
        summary: 'type으로 목록형(list, table-list)과 상세형(result, table-result)을 고릅니다. caption은 화면에 숨기고 보조기술에 읽힙니다.',
        api: [
            { name: 'type', type: "'list' | 'result'", defaultValue: "'list'", desc: '목록형(위쪽 열 머리글) / 상세형(왼쪽 행 머리글)' },
            { name: 'caption', type: 'string', defaultValue: 'required', desc: '표 설명 (시각적으로 숨김)' },
            { name: 'columns', type: 'TableColumn<T>[]', defaultValue: 'required (list)', desc: 'key · header · align(start|center) · render' },
            { name: 'rows', type: 'T[]', defaultValue: 'required (list)', desc: '행 데이터' },
            { name: 'getRowKey', type: '(row: T) => string', defaultValue: 'required (list)', desc: '행 고유 key' },
            { name: 'items', type: 'TableResultItem[]', defaultValue: 'required (result)', desc: 'key · label · value (비면 - 표시)' },
            { name: 'itemsPerRow', type: '1 | 2', defaultValue: '1', desc: 'result: 한 줄에 항목 몇 쌍' }
        ],
        samples: [
            {
                title: 'type="list" 목록형 (table-list, 기본)',
                preview: <Table caption="샘플 작업 목록: 업무, 담당, 상태" columns={SAMPLE_COLUMNS} rows={SAMPLE_ROWS} getRowKey={(row) => row.id} />,
                code: "const columns: TableColumn<Row>[] = [\n    { key: 'task', header: '업무' },\n    { key: 'owner', header: '담당', align: 'center' },\n    { key: 'status', header: '상태', render: (row) => <Chip label={row.status} color={row.color} /> }\n];\n\n<Table caption=\"작업 목록\" columns={columns} rows={rows} getRowKey={(row) => row.id} />"
            },
            {
                title: 'type="result" 상세형 (table-result)',
                desc: 'itemsPerRow 1 · 2 (항목 수가 홀수면 마지막 값 칸이 남은 칸을 채움)',
                preview: (
                    <Stack gap="md">
                        <Table type="result" caption="신청 내용 (한 줄에 1쌍)" items={SAMPLE_RESULT_ITEMS.slice(0, 3)} />
                        <Table type="result" caption="신청 내용 (한 줄에 2쌍)" items={SAMPLE_RESULT_ITEMS} itemsPerRow={2} />
                    </Stack>
                ),
                code: "const items: TableResultItem[] = [\n    { key: 'name', label: '신청자', value: '홍길동' },\n    { key: 'status', label: '상태', value: <Chip label=\"승인\" color=\"green\" /> }\n];\n\n<Table type=\"result\" caption=\"신청 내용\" items={items} itemsPerRow={2} />"
            }
        ],
        playground: {
            controls: [
                { name: 'type', type: 'select', options: ['list', 'result'], defaultValue: 'list' },
                { name: 'itemsPerRow', type: 'select', options: ['1', '2'], defaultValue: '1', isProp: false }
            ],
            render: (values) =>
                readText(values, 'type') === 'result' ? (
                    <Table type="result" caption="신청 내용" items={SAMPLE_RESULT_ITEMS} itemsPerRow={readText(values, 'itemsPerRow') === '2' ? 2 : 1} />
                ) : (
                    <Table caption="작업 목록" columns={SAMPLE_COLUMNS} rows={SAMPLE_ROWS} getRowKey={(row) => row.id} />
                ),
            code: (values) =>
                readText(values, 'type') === 'result'
                    ? `<Table type="result" caption="신청 내용" items={items}${readText(values, 'itemsPerRow') === '2' ? ' itemsPerRow={2}' : ''} />`
                    : '<Table caption="작업 목록" columns={columns} rows={rows} getRowKey={(row) => row.id} />'
        }
    }
];


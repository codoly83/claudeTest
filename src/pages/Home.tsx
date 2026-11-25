import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Table from '../components/common/Table';
import Chip from '../components/common/Chip';
import Accordion from '../components/common/Accordion';
import Alert from '../components/common/Alert';
import Avatar from '../components/common/Avatar';
import Breadcrumb from '../components/common/Breadcrumb';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Checkbox from '../components/common/Checkbox';
import Collapsible from '../components/common/Collapsible';
import DropdownMenu from '../components/common/DropdownMenu';
import EmptyState from '../components/common/EmptyState';
import Input from '../components/common/Input';
import Kbd from '../components/common/Kbd';
import Loading from '../components/common/Loading';
import Modal from '../components/common/Modal';
import Pagination from '../components/common/Pagination';
import Popover from '../components/common/Popover';
import Progress from '../components/common/Progress';
import Radio from '../components/common/Radio';
import RangeSlider from '../components/common/RangeSlider';
import Select from '../components/common/Select';
import Section from '../components/common/Section';
import Separator from '../components/common/Separator';
import Stack from '../components/common/Stack';
import Grid from '../components/common/Grid';
import Chart from '../components/common/Chart';
import DatePicker from '../components/common/DatePicker';
import Icon from '../components/common/Icon';
import InputStepper from '../components/common/InputStepper';
import ScrollArea from '../components/common/ScrollArea';
import Slider from '../components/common/Slider';
import SortableList from '../components/common/SortableList';
import TextList from '../components/common/TextList';
import TreeView from '../components/common/TreeView';
import Skeleton from '../components/common/Skeleton';
import Switch from '../components/common/Switch';
import Tabs from '../components/common/Tabs';
import Textarea from '../components/common/Textarea';
import ToggleGroup from '../components/common/ToggleGroup';
import Tooltip from '../components/common/Tooltip';
import { useToast } from '../hooks/useToast';
import { IA_TABLES } from '../data/iaData';
import { getComponentSpecHref } from '../data/specData';
import type { Cell, ChipColor, TableColumn, TaskKey, TreeNode } from '../types';

// 메인 (/) — 페이지 목록 + 공통 컴포넌트 목록 (docs/requirements.md 4장)
// 페이지 목록: IA 데이터(src/data/iaData.ts)를 그대로 읽어 페이지·경로·날짜·상태 표시
// 컴포넌트 목록: components/common/의 공통 컴포넌트를 실제로 렌더링하고 명세 화면(/spec/{컴포넌트}: 문서·샘플·Playground·API)으로 연결 (shadcn/ui 첫 화면 참고)

interface PageRow {
    id: string;
    name: string;
    path: string;
    date: string;
    task: TaskKey;
}

interface ComponentPreview {
    id: string;          // 컴포넌트 id (camelCase 파일명)
    name: string;
    desc: string;
    preview: ReactNode;
}

const TASK_CHIPS: Record<TaskKey, { label: string; color: ChipColor }> = {
    '0': { label: '작업중', color: 'gray' },
    '1': { label: '완료', color: 'green' },
    '2': { label: '수정', color: 'yellow' },
    '3': { label: '삭제', color: 'red' }
};

const getCellText = (row: Cell[], className: string) => row.find((cell) => cell.className.split(' ').includes(className))?.text ?? '';

const toTaskKey = (text: string): TaskKey => (text === '1' || text === '2' || text === '3' ? text : '0');

const PAGE_ROWS: PageRow[] = IA_TABLES.flatMap((table) =>
    table.rows.map((row, index) => {
        const depths = row.filter((cell) => cell.className === 'menuDepth').map((cell) => cell.text);
        return {
            id: `${table.id}-${index}`,
            name: [...depths].reverse().find(Boolean) ?? table.title,
            path: getCellText(row, 'fileName'),
            date: getCellText(row, 'date'),
            task: toTaskKey(getCellText(row, 'checkTask'))
        };
    })
);

const COLUMNS: TableColumn<PageRow>[] = [
    { key: 'name', header: '페이지' },
    { key: 'path', header: '경로' },
    {
        key: 'id',
        header: '이동',
        align: 'center',
        render: (row) =>
            row.path && (
                <Link to={row.path} aria-label={`${row.name} 보기`}>
                    보기
                </Link>
            )
    },
    { key: 'date', header: '날짜', align: 'center', render: (row) => row.date || '-' },
    { key: 'task', header: '상태', align: 'center', render: (row) => <Chip label={TASK_CHIPS[row.task].label} color={TASK_CHIPS[row.task].color} /> }
];

// ---- 컴포넌트 미리보기 (제어형 컴포넌트는 미리보기마다 상태를 둡니다) ----

const SAMPLE_TABLE_ROWS = [
    { id: 'a', name: '홍길동', role: '디자이너' },
    { id: 'b', name: '김철수', role: '개발자' }
];

const SAMPLE_TABLE_COLUMNS: TableColumn<(typeof SAMPLE_TABLE_ROWS)[number]>[] = [
    { key: 'name', header: '이름' },
    { key: 'role', header: '역할', align: 'center' }
];

const InputPreview = () => {
    const [email, setEmail] = useState('');
    return <Input label="이메일" type="email" value={email} onChange={setEmail} placeholder="name@example.com" />;
};

const CheckboxPreview = () => {
    const [isChecked, setIsChecked] = useState(true);
    return <Checkbox label="이용약관에 동의합니다" checked={isChecked} onChange={setIsChecked} />;
};

const SwitchPreview = () => {
    const [isOn, setIsOn] = useState(true);
    return (
        <div className="galleryRow">
            <Switch label="비행기 모드" checked={isOn} onChange={setIsOn} />
            <span>비행기 모드</span>
        </div>
    );
};

const RadioPreview = () => {
    const [value, setValue] = useState('comfortable');
    return (
        <Radio
            legend="표시 간격"
            value={value}
            onChange={setValue}
            options={[
                { value: 'default', label: '기본' },
                { value: 'comfortable', label: '넓게' },
                { value: 'compact', label: '좁게' }
            ]}
        />
    );
};

const SelectPreview = () => {
    const [value, setValue] = useState('');
    return (
        <Select
            label="테마"
            value={value}
            onChange={setValue}
            placeholder="선택하세요"
            options={[
                { value: 'light', label: '라이트' },
                { value: 'dark', label: '다크' },
                { value: 'system', label: '시스템' }
            ]}
        />
    );
};

const TextareaPreview = () => {
    const [text, setText] = useState('');
    return <Textarea label="메시지" value={text} onChange={setText} placeholder="메시지를 입력하세요" rows={3} maxLength={200} hasCounter />;
};

const RangeSliderPreview = () => {
    const [value, setValue] = useState([30, 70]);
    return (
        <div className="galleryStack">
            <span>
                가격 {value[0]} ~ {value[1]}
            </span>
            <RangeSlider label="가격" value={value} onChange={setValue} />
        </div>
    );
};

const ToggleGroupPreview = () => {
    const [value, setValue] = useState('center');
    return (
        <ToggleGroup
            label="정렬"
            value={value}
            onChange={setValue}
            options={[
                { value: 'left', label: '왼쪽' },
                { value: 'center', label: '가운데' },
                { value: 'right', label: '오른쪽' }
            ]}
        />
    );
};

const PaginationPreview = () => {
    const [page, setPage] = useState(3);
    return <Pagination total={10} current={page} onChange={setPage} max={3} />;
};

const ModalPreview = () => {
    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => setIsOpen(false);
    return (
        <>
            <Button size="sm" shape="square" onClick={() => setIsOpen(true)}>
                모달 열기
            </Button>
            <Modal
                isOpen={isOpen}
                onClose={handleClose}
                title="프로필 수정"
                footer={
                    <Button size="md" shape="square" onClick={handleClose}>
                        저장
                    </Button>
                }
            >
                프로필 정보를 바꾼 뒤 저장하세요. ESC로 닫을 수 있습니다.
            </Modal>
        </>
    );
};

const ToastPreview = () => {
    const { showToast } = useToast();
    return (
        <div className="galleryRow">
            <Button size="sm" shape="square" onClick={() => showToast('일정이 등록되었습니다.', { type: 'success' })}>
                알림 띄우기
            </Button>
            <Button size="sm" shape="square" onClick={() => showToast('저장에 실패했습니다.', { type: 'error' })}>
                오류 알림
            </Button>
        </div>
    );
};

const LoadingPreview = () => {
    const [isLoading, setIsLoading] = useState(true);
    return (
        <div className="galleryStack">
            <Loading isLoading={isLoading} isFullscreen={false} label="불러오는 중">
                <div className="galleryBox">결제 내역 3건</div>
            </Loading>
            <Button size="sm" shape="square" onClick={() => setIsLoading((prev) => !prev)}>
                로딩 {isLoading ? '끄기' : '켜기'}
            </Button>
        </div>
    );
};

const CHART_DATA = [
    { month: '9월', visitors: 1480 },
    { month: '10월', visitors: 2100 },
    { month: '11월', visitors: 2431 }
];

const PREVIEW_SLIDES = [1, 2, 3].map((number) => ({ id: `slide${number}`, title: `슬라이드 ${number}` }));

const PREVIEW_TREE: TreeNode[] = [
    { id: 'src', parent: 0, text: 'src', isFolder: true },
    { id: 'pages', parent: 'src', text: 'pages', isFolder: true },
    { id: 'home', parent: 'pages', text: 'Home.tsx' },
    { id: 'main', parent: 'src', text: 'main.tsx' }
];

const DatePickerPreview = () => {
    const [date, setDate] = useState<Date | undefined>(new Date(2026, 10, 25));
    return <DatePicker label="예약일" value={date} onChange={setDate} hasReset />;
};

const InputStepperPreview = () => {
    const [count, setCount] = useState('1');
    return <InputStepper label="수량" value={count} onChange={setCount} min={1} max={10} />;
};

const SortableListPreview = () => {
    const [items, setItems] = useState([
        { id: 'design', title: '시안 확인' },
        { id: 'markup', title: '마크업 작성' },
        { id: 'review', title: '검수' }
    ]);
    return <SortableList label="작업 순서" items={items} onChange={setItems} getItemLabel={(item) => item.title} renderItem={(item) => item.title} />;
};

const TreeViewPreview = () => {
    const [checkedIds, setCheckedIds] = useState<(string | number)[]>([]);
    return <TreeView label="파일 선택" nodes={PREVIEW_TREE} defaultOpenIds={['src', 'pages']} checkedIds={checkedIds} onCheckedChange={setCheckedIds} />;
};

// 이름 순으로 정렬해 보여 줍니다 (컴포넌트를 추가하면 같은 작업에서 이 목록과 스토리를 함께 갱신)
const COMPONENT_ITEMS: ComponentPreview[] = [
    {
        id: 'accordion',
        name: 'Accordion',
        desc: '제목을 눌러 내용을 접고 펼치는 목록',
        preview: (
            <Accordion
                defaultOpenIds={['a']}
                items={[
                    { id: 'a', title: '접근성을 지원하나요?', content: 'WAI-ARIA 패턴을 따릅니다.' },
                    { id: 'b', title: '스타일을 바꿀 수 있나요?', content: 'common.css 토큰을 사용합니다.' }
                ]}
            />
        )
    },
    {
        id: 'alert',
        name: 'Alert',
        desc: '주의를 끌어야 하는 안내 문구',
        preview: (
            <div className="galleryStack">
                <Alert title="업데이트가 있습니다">새 기능을 확인해 보세요.</Alert>
                <Alert title="세션이 만료되었습니다" variant="error" />
            </div>
        )
    },
    {
        id: 'avatar',
        name: 'Avatar',
        desc: '사용자 이미지, 없으면 머리글자',
        preview: (
            <div className="galleryRow">
                <Avatar name="홍길동" size="sm" />
                <Avatar name="Jane Doe" />
                <Avatar name="shadcn" size="lg" />
            </div>
        )
    },
    {
        id: 'breadcrumb',
        name: 'Breadcrumb',
        desc: '현재 페이지까지의 경로',
        preview: <Breadcrumb items={[{ label: '홈', href: '/' }, { label: '샘플 페이지', href: '/dashboard' }, { label: '대시보드' }]} />
    },
    {
        id: 'button',
        name: 'Button',
        desc: '동작을 실행하는 버튼',
        preview: (
            <div className="galleryRow">
                <Button size="md">기본</Button>
                <Button size="md" shape="square">
                    사각형
                </Button>
                <Button size="md" disabled>
                    비활성
                </Button>
            </div>
        )
    },
    {
        id: 'card',
        name: 'Card',
        desc: '배치: 제목·액션·본문·하단 상자 (padding sm·md·lg)',
        preview: (
            <Card title="오늘 방문자" size="sm">
                <strong className="galleryValue">2,431</strong>
            </Card>
        )
    },
    { id: 'checkbox', name: 'Checkbox', desc: '항목을 켜고 끄는 선택 상자', preview: <CheckboxPreview /> },
    {
        id: 'grid',
        name: 'Grid',
        desc: '배치: 반응형 열 나누기 (gap sm·md·lg)',
        preview: (
            <Grid columns={3} gap="sm">
                <span className="galleryBox">1</span>
                <span className="galleryBox">2</span>
                <span className="galleryBox">3</span>
            </Grid>
        )
    },
    {
        id: 'chip',
        name: 'Chip',
        desc: '상태·수치를 보여 주는 배지',
        preview: (
            <div className="galleryRow">
                <Chip label="완료" />
                <Chip label="진행중" color="blue" />
                <Chip label="보류" color="yellow" />
                <Chip label="삭제" color="red" />
            </div>
        )
    },
    {
        id: 'collapsible',
        name: 'Collapsible',
        desc: '한 영역만 접고 펼치기',
        preview: (
            <Collapsible title="저장소 3개 더 보기">
                <ul className="galleryList">
                    <li>@radix-ui/primitives</li>
                    <li>@radix-ui/colors</li>
                </ul>
            </Collapsible>
        )
    },
    {
        id: 'dropdownMenu',
        name: 'DropdownMenu',
        desc: '버튼을 눌러 여는 동작 메뉴',
        preview: (
            <DropdownMenu
                label="내 계정"
                items={[
                    { id: 'profile', label: '프로필' },
                    { id: 'setting', label: '설정' },
                    { id: 'logout', label: '로그아웃', isDanger: true }
                ]}
            />
        )
    },
    {
        id: 'emptyState',
        name: 'EmptyState',
        desc: '데이터가 없을 때 안내',
        preview: <EmptyState title="알림이 없습니다" description="새 알림이 오면 여기에 표시됩니다." />
    },
    { id: 'input', name: 'Input', desc: '라벨·안내·오류가 연결된 입력창', preview: <InputPreview /> },
    {
        id: 'kbd',
        name: 'Kbd',
        desc: '키보드 키 표시',
        preview: (
            <span className="galleryRow">
                <Kbd label="Ctrl" /> + <Kbd label="K" /> 검색
            </span>
        )
    },
    { id: 'loading', name: 'Loading', desc: '불러오는 중 표시 (영역 · 전체 화면)', preview: <LoadingPreview /> },
    { id: 'modal', name: 'Modal', desc: '화면 위에 뜨는 대화 상자 (Alert Dialog 포함)', preview: <ModalPreview /> },
    { id: 'pagination', name: 'Pagination', desc: '페이지 번호 이동', preview: <PaginationPreview /> },
    {
        id: 'popover',
        name: 'Popover',
        desc: '버튼 옆에 뜨는 작은 패널',
        preview: (
            <Popover trigger="크기 설정" title="크기" placement="bottom-start" size="sm">
                너비와 높이를 정합니다.
            </Popover>
        )
    },
    { id: 'progress', name: 'Progress', desc: '작업 진행률', preview: <Progress label="업로드" value={66} /> },
    { id: 'radio', name: 'Radio', desc: '여러 개 중 하나를 고르는 그룹', preview: <RadioPreview /> },
    { id: 'rangeSlider', name: 'RangeSlider', desc: '값·범위를 끌어서 선택', preview: <RangeSliderPreview /> },
    {
        id: 'section',
        name: 'Section',
        desc: '배치: 제목·버튼 + 콘텐츠 구역',
        preview: (
            <Section title="이번 달 요약" headingLevel={4} gap="sm" action={<Button size="sm" shape="square">내보내기</Button>}>
                <span className="galleryBox">콘텐츠</span>
            </Section>
        )
    },
    { id: 'select', name: 'Select', desc: '목록에서 하나를 고르는 선택 상자', preview: <SelectPreview /> },
    {
        id: 'separator',
        name: 'Separator',
        desc: '내용을 나누는 구분선',
        preview: (
            <div className="galleryStack">
                <span>Radix Primitives</span>
                <Separator />
                <span className="galleryRow">
                    Blog <Separator orientation="vertical" /> Docs <Separator orientation="vertical" /> Source
                </span>
            </div>
        )
    },
    {
        id: 'skeleton',
        name: 'Skeleton',
        desc: '내용을 불러오기 전 자리 표시',
        preview: (
            <div className="galleryRow" aria-busy="true">
                <Skeleton shape="avatar" />
                <div className="galleryStack galleryGrow">
                    <Skeleton shape="title" />
                    <Skeleton />
                </div>
            </div>
        )
    },
    {
        id: 'stack',
        name: 'Stack',
        desc: '배치: 세로·가로 쌓기 (gap sm·md·lg)',
        preview: (
            <Stack gap="sm">
                <span className="galleryBox">1</span>
                <Stack direction="row" gap="sm" justify="end">
                    <Button size="sm" shape="square">취소</Button>
                    <Button size="sm" shape="square">저장</Button>
                </Stack>
            </Stack>
        )
    },
    { id: 'switch', name: 'Switch', desc: '설정을 바로 켜고 끄는 스위치', preview: <SwitchPreview /> },
    {
        id: 'table',
        name: 'Table',
        desc: '목록형(list) · 상세형(result) 표',
        preview: <Table caption="샘플 구성원: 이름, 역할" columns={SAMPLE_TABLE_COLUMNS} rows={SAMPLE_TABLE_ROWS} getRowKey={(row) => row.id} />
    },
    {
        id: 'tabs',
        name: 'Tabs',
        desc: '같은 자리에서 내용을 바꿔 보는 탭',
        preview: (
            <Tabs
                label="설정"
                items={[
                    { id: 'account', label: '계정', content: '계정 정보를 바꿉니다.' },
                    { id: 'password', label: '비밀번호', content: '비밀번호를 바꿉니다.' }
                ]}
            />
        )
    },
    { id: 'textarea', name: 'Textarea', desc: '여러 줄 입력과 글자 수', preview: <TextareaPreview /> },
    { id: 'toast', name: 'Toast', desc: '잠깐 떴다 사라지는 알림', preview: <ToastPreview /> },
    { id: 'toggleGroup', name: 'ToggleGroup', desc: '하나만 고르는 버튼 묶음', preview: <ToggleGroupPreview /> },
    {
        id: 'tooltip',
        name: 'Tooltip',
        desc: '마우스·포커스 시 뜨는 설명',
        preview: (
            <Tooltip content="장바구니에 담기">
                <Button size="sm" shape="square">
                    마우스를 올려 보세요
                </Button>
            </Tooltip>
        )
    },
    {
        id: 'chart',
        name: 'Chart',
        desc: '선·막대·파이 등 차트 (recharts)',
        preview: <Chart type="line" title="월별 방문자" data={CHART_DATA} xKey="month" series={[{ dataKey: 'visitors', name: '방문자', color: 'green' }]} size="sm" hasLegend={false} />
    },
    { id: 'datePicker', name: 'DatePicker', desc: '날짜·기간 선택 달력', preview: <DatePickerPreview /> },
    {
        id: 'icon',
        name: 'Icon',
        desc: '글자색을 따르는 아이콘 25종',
        preview: (
            <div className="galleryRow">
                <Icon name="iconSearch" />
                <Icon name="iconCalendar" />
                <Icon name="iconFolder" />
                <Icon name="iconCircleCheck" />
                <Icon name="iconTriangleAlert" />
            </div>
        )
    },
    { id: 'inputStepper', name: 'InputStepper', desc: '숫자·날짜를 −/+로 증감', preview: <InputStepperPreview /> },
    {
        id: 'scrollArea',
        name: 'ScrollArea',
        desc: '키보드로도 스크롤되는 영역',
        preview: (
            <ScrollArea label="알림 목록" size="sm">
                <div className="galleryScroll">
                    <TextList size="sm" items={Array.from({ length: 12 }, (_value, index) => `알림 ${index + 1}`)} />
                </div>
            </ScrollArea>
        )
    },
    {
        id: 'slider',
        name: 'Slider',
        desc: '슬라이드·캐러셀 (swiper)',
        preview: <Slider label="미리보기 슬라이드" items={PREVIEW_SLIDES} renderItem={(item) => <div className="gallerySlide">{item.title}</div>} options={{ pagination: { clickable: true } }} />
    },
    { id: 'sortableList', name: 'SortableList', desc: '끌거나 버튼으로 순서 바꾸기', preview: <SortableListPreview /> },
    {
        id: 'textList',
        name: 'TextList',
        desc: '글머리 기호·번호 목록',
        preview: <TextList type="circled" items={['배송은 2~3일 걸립니다.', '주말에는 출고하지 않습니다.']} />
    },
    { id: 'treeView', name: 'TreeView', desc: '펼치고 체크하는 트리', preview: <TreeViewPreview /> }
];

const COMPONENT_LIST = [...COMPONENT_ITEMS].sort((a, b) => a.name.localeCompare(b.name));

const Home = () => {
    return (
        <div className="home">
            <section className="homeSection" aria-labelledby="homePageTitle">
                <h2 id="homePageTitle" className="homeTitle">
                    페이지 목록
                </h2>
                <div className="pageList">
                    <Table caption="페이지 목록: 페이지, 경로, 이동, 날짜, 상태" columns={COLUMNS} rows={PAGE_ROWS} getRowKey={(row) => row.id} />
                </div>
            </section>

            <section className="homeSection" aria-labelledby="homeComponentTitle">
                <div className="homeHead">
                    <h2 id="homeComponentTitle" className="homeTitle">
                        컴포넌트 <span className="homeCount">{COMPONENT_LIST.length}</span>
                    </h2>
                    <p className="homeDesc">
                        shadcn/ui 구성을 참고해 이 프로젝트 규칙(common.css 토큰·접근성)으로 만든 공통 컴포넌트입니다. 각 카드는 실제로 동작하며, "명세"를 누르면 문서·샘플·Playground·API를
                        볼 수 있습니다.
                    </p>
                </div>
                <ul className="componentGallery">
                    {COMPONENT_LIST.map((item) => (
                        <li key={item.id} className="galleryItem">
                            <Card
                                title={item.name}
                                size="sm"
                                action={
                                    <Link to={getComponentSpecHref(item.name)} className="galleryLink" aria-label={`${item.name} 명세 보기`}>
                                        명세
                                    </Link>
                                }
                            >
                                <p className="galleryDesc">{item.desc}</p>
                                <div className="galleryPreview">{item.preview}</div>
                            </Card>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default Home;

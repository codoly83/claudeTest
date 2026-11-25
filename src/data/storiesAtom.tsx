import { useState } from 'react';
import Accordion from '../components/common/Accordion';
import Alert from '../components/common/Alert';
import Avatar from '../components/common/Avatar';
import Breadcrumb from '../components/common/Breadcrumb';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Checkbox from '../components/common/Checkbox';
import Chip from '../components/common/Chip';
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
import Separator from '../components/common/Separator';
import Skeleton from '../components/common/Skeleton';
import Stack from '../components/common/Stack';
import Switch from '../components/common/Switch';
import Tabs from '../components/common/Tabs';
import Textarea from '../components/common/Textarea';
import ToggleGroup from '../components/common/ToggleGroup';
import Tooltip from '../components/common/Tooltip';
import { useToast } from '../hooks/useToast';
import type { ChipColor, ComponentStory, ControlValues, Placement, ToastPosition, ToastType } from '../types';
import { readFlag, readNumber, readOption, readText, toJsx } from '../utils/storyCode';

// Atom 컴포넌트 스토리 — 명세 화면 탭 (src/data/componentStories.ts)
// 예제 마크업은 common.css 클래스만 씁니다. 상태가 필요한 예제는 아래 *Demo·*Play 컴포넌트로 둡니다.

interface PlayProps {
    values: ControlValues;
}

const CHIP_COLORS: ChipColor[] = ['green', 'blue', 'yellow', 'red', 'purple', 'gray'];
const TOAST_TYPES: ToastType[] = ['default', 'success', 'info', 'warning', 'error'];
const TOAST_POSITIONS: ToastPosition[] = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'];
const PLACEMENTS: Placement[] = ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end'];
const POPOVER_PLACEMENTS: Placement[] = ['top', 'bottom-start', 'bottom', 'bottom-end', 'right', 'left'];
const SKELETON_SHAPES = ['text', 'title', 'avatar', 'button', 'image'] as const;
const MODAL_SIZES = ['small', 'medium', 'large', 'full'] as const;
const PROGRESS_VALUES = [0, 35, 100];

const ACCORDION_ITEMS = [
    { id: 'shipping', title: '배송은 얼마나 걸리나요?', content: '결제 후 영업일 기준 2~3일 안에 도착합니다.' },
    { id: 'refund', title: '환불 규정이 궁금해요', content: '수령 후 7일 이내 미사용 상품은 전액 환불됩니다.' },
    { id: 'disabled', title: '비활성 항목', content: '열 수 없는 항목입니다.', disabled: true }
];

const TAB_ITEMS = [
    { id: 'account', label: '계정', content: '이름과 이메일 등 계정 정보를 바꿉니다.' },
    { id: 'password', label: '비밀번호', content: '현재 비밀번호를 확인한 뒤 새 비밀번호로 바꿉니다.' },
    { id: 'disabled', label: '비활성', content: '선택할 수 없는 탭입니다.', disabled: true }
];

const SELECT_OPTIONS = [
    { value: 'apple', label: '사과', group: '과일' },
    { value: 'banana', label: '바나나', group: '과일' },
    { value: 'carrot', label: '당근', group: '채소' },
    { value: 'onion', label: '양파(품절)', group: '채소', disabled: true }
];

const RADIO_OPTIONS = [
    { value: 'basic', label: '기본 요금제', description: '월 9,900원' },
    { value: 'pro', label: '프로 요금제', description: '월 19,900원' },
    { value: 'team', label: '팀 요금제', description: '준비 중', disabled: true }
];

const TOGGLE_OPTIONS = [
    { value: 'day', label: '일간' },
    { value: 'week', label: '주간' },
    { value: 'month', label: '월간' }
];

const MENU_ITEMS = [
    { id: 'profile', label: '프로필' },
    { id: 'setting', label: '설정' },
    { id: 'billing', label: '결제 (준비 중)', disabled: true },
    { id: 'logout', label: '로그아웃', isDanger: true }
];

const BREADCRUMB_ITEMS = [{ label: '홈', href: '/' }, { label: '샘플 페이지', href: '/dashboard' }, { label: '설정', href: '/payout' }, { label: '대시보드' }];

// ---- 샘플: 상태가 필요한 예제 ----

const InputDemo = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('wrong-email');
    return (
        <Stack gap="md">
            <Input label="이름" value={name} onChange={setName} placeholder="홍길동" required />
            <Input label="비밀번호" type="password" value="" helpText="영문과 숫자를 포함해 8자 이상" />
            <Input label="이메일" type="email" value={email} onChange={setEmail} hasError errorMessage="이메일 형식이 올바르지 않습니다." />
            <Input label="아이디" value="disabled-user" disabled />
        </Stack>
    );
};

const CheckboxDemo = () => {
    const [isChecked, setIsChecked] = useState(false);
    return (
        <Stack gap="md">
            <Checkbox label="기본 (클릭해 보세요)" checked={isChecked} onChange={setIsChecked} />
            <Checkbox label="선택됨" checked />
            <Checkbox label="비활성" checked={false} disabled />
            <Checkbox label="선택 + 비활성" checked disabled />
            <Checkbox label="[필수] 이용약관 동의" checked={false} hasError errorMessage="이용약관에 동의해야 가입할 수 있습니다." />
        </Stack>
    );
};

const SwitchDemo = () => {
    const [isOn, setIsOn] = useState(false);
    return (
        <Stack direction="row" gap="md" align="center" isWrap>
            <Switch label="알림 받기" checked={isOn} onChange={setIsOn} />
            <Switch label="알림 받기 (sm)" size="sm" checked={isOn} onChange={setIsOn} />
            <Switch label="비활성" checked={false} disabled />
            <Switch label="선택 + 비활성" checked disabled />
        </Stack>
    );
};

const SelectDemo = () => {
    const [fruit, setFruit] = useState('');
    return (
        <Stack gap="md">
            <Select label="품목" options={SELECT_OPTIONS} value={fruit} onChange={setFruit} placeholder="선택하세요" />
            <Select label="작은 크기 (sm)" size="sm" options={SELECT_OPTIONS} value="apple" />
            <Select label="오류" options={SELECT_OPTIONS} value="" placeholder="선택하세요" hasError errorMessage="품목을 선택하세요." />
            <Select label="비활성" options={SELECT_OPTIONS} value="banana" disabled />
        </Stack>
    );
};

const RadioDemo = () => {
    const [plan, setPlan] = useState('basic');
    return (
        <Stack gap="md">
            <Radio legend="요금제" options={RADIO_OPTIONS} value={plan} onChange={setPlan} />
            <Radio legend="오류 예시" options={RADIO_OPTIONS.slice(0, 2)} value="" hasError errorMessage="요금제를 선택하세요." />
        </Stack>
    );
};

const TextareaDemo = () => {
    const [text, setText] = useState('');
    return (
        <Stack gap="md">
            <Textarea label="문의 내용" value={text} onChange={setText} placeholder="내용을 입력하세요" maxLength={100} hasCounter helpText="개인정보는 입력하지 마세요." required />
            <Textarea label="오류" value="" hasError errorMessage="내용을 입력하세요." rows={2} />
            <Textarea label="비활성" value="수정할 수 없습니다." disabled rows={2} />
        </Stack>
    );
};

const RangeSliderDemo = () => {
    const [volume, setVolume] = useState([40]);
    const [price, setPrice] = useState([20, 80]);
    return (
        <Stack gap="md">
            <p className="storyText">음량 {volume[0]}</p>
            <RangeSlider label="음량" value={volume} onChange={setVolume} />
            <p className="storyText">
                가격 {price[0]} ~ {price[1]}만 원 (최소 간격 10)
            </p>
            <RangeSlider label="가격" value={price} onChange={setPrice} minGap={10} size="lg" />
            <RangeSlider label="비활성" value={[60]} size="sm" disabled />
        </Stack>
    );
};

const ToggleGroupDemo = () => {
    const [period, setPeriod] = useState('week');
    return (
        <Stack direction="row" gap="md" align="center" isWrap>
            <ToggleGroup label="조회 기간" options={TOGGLE_OPTIONS} value={period} onChange={setPeriod} />
            <ToggleGroup label="조회 기간 (sm)" size="sm" options={[...TOGGLE_OPTIONS, { value: 'year', label: '연간', disabled: true }]} value={period} onChange={setPeriod} />
        </Stack>
    );
};

const PaginationDemo = () => {
    const [page, setPage] = useState(1);
    return (
        <Stack gap="md">
            <Pagination total={20} current={page} onChange={setPage} />
            <Pagination total={20} current={page} onChange={setPage} hasEllipsis />
        </Stack>
    );
};

const ModalDemo = () => {
    const [openSize, setOpenSize] = useState<(typeof MODAL_SIZES)[number] | 'alert' | null>(null);
    const handleClose = () => setOpenSize(null);
    return (
        <Stack direction="row" gap="sm" isWrap>
            <Button size="sm" shape="square" onClick={() => setOpenSize('alert')}>
                alert
            </Button>
            {MODAL_SIZES.map((size) => (
                <Button key={size} size="sm" shape="square" onClick={() => setOpenSize(size)}>
                    {size}
                </Button>
            ))}
            <Modal
                isOpen={openSize === 'alert'}
                onClose={handleClose}
                size="alert"
                title="정말 삭제할까요?"
                footer={
                    <>
                        <Button size="md" shape="square" onClick={handleClose}>
                            취소
                        </Button>
                        <Button size="md" shape="square" onClick={handleClose}>
                            삭제
                        </Button>
                    </>
                }
            >
                삭제한 데이터는 되돌릴 수 없습니다.
            </Modal>
            {MODAL_SIZES.map((size) => (
                <Modal
                    key={size}
                    isOpen={openSize === size}
                    onClose={handleClose}
                    size={size}
                    title={`프로필 수정 (${size})`}
                    footer={
                        <Button size="md" shape="square" onClick={handleClose}>
                            저장
                        </Button>
                    }
                >
                    <Input label="이름" value="홍길동" />
                </Modal>
            ))}
        </Stack>
    );
};

const ToastDemo = () => {
    const { showToast } = useToast();
    return (
        <Stack gap="sm">
            <Stack direction="row" gap="sm" isWrap>
                {TOAST_TYPES.map((type) => (
                    <Button key={type} size="sm" shape="square" onClick={() => showToast(`${type} 알림입니다.`, { type })}>
                        {type}
                    </Button>
                ))}
            </Stack>
            <Stack direction="row" gap="sm" isWrap>
                {TOAST_POSITIONS.map((position) => (
                    <Button key={position} size="sm" shape="square" onClick={() => showToast(`${position} 위치 알림`, { position })}>
                        {position}
                    </Button>
                ))}
            </Stack>
        </Stack>
    );
};

const LoadingDemo = () => {
    const [isAreaLoading, setIsAreaLoading] = useState(true);
    const [isFullLoading, setIsFullLoading] = useState(false);
    const handleFullscreen = () => {
        setIsFullLoading(true);
        window.setTimeout(() => setIsFullLoading(false), 1500);
    };
    return (
        <Stack gap="md">
            <Stack direction="row" gap="sm" isWrap>
                <Button size="sm" shape="square" onClick={() => setIsAreaLoading((prev) => !prev)}>
                    영역 로딩 {isAreaLoading ? '끄기' : '켜기'}
                </Button>
                <Button size="sm" shape="square" onClick={handleFullscreen}>
                    전체 화면 로딩 (1.5초)
                </Button>
            </Stack>
            <Loading isLoading={isAreaLoading} isFullscreen={false} label="불러오는 중">
                <Card title="최근 주문">
                    <p className="storyText">주문 3건이 있습니다.</p>
                </Card>
            </Loading>
            <Loading isLoading={isFullLoading} />
        </Stack>
    );
};

const CollapsibleDemo = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <Stack gap="md" align="start">
            <Collapsible title="주문 상세 보기 (내부 상태)">
                <p className="storyText">상품 2개 · 배송비 무료</p>
            </Collapsible>
            <Button size="sm" shape="square" onClick={() => setIsOpen((prev) => !prev)}>
                바깥 버튼으로 {isOpen ? '닫기' : '열기'}
            </Button>
            <Collapsible title="제어형 (isOpen)" isOpen={isOpen} onChange={setIsOpen}>
                <p className="storyText">부모 상태로 열고 닫습니다.</p>
            </Collapsible>
            <Collapsible title="비활성" disabled>
                <p className="storyText">열 수 없습니다.</p>
            </Collapsible>
        </Stack>
    );
};

// ---- Playground: 제어형 컴포넌트는 값 상태를 안에 둡니다 ----

const InputPlay = ({ values }: PlayProps) => {
    const [value, setValue] = useState('');
    return (
        <Input
            label={readText(values, 'label') || '라벨'}
            value={value}
            onChange={setValue}
            type={readOption(values, 'type', ['text', 'email', 'password', 'number'] as const)}
            placeholder={readText(values, 'placeholder') || undefined}
            helpText={readText(values, 'helpText') || undefined}
            required={readFlag(values, 'required')}
            disabled={readFlag(values, 'disabled')}
            hasError={readFlag(values, 'hasError')}
            errorMessage={readText(values, 'errorMessage') || undefined}
        />
    );
};

const CheckboxPlay = ({ values }: PlayProps) => {
    const [isChecked, setIsChecked] = useState(false);
    return (
        <Checkbox
            label={readText(values, 'label') || '라벨'}
            checked={isChecked}
            onChange={setIsChecked}
            disabled={readFlag(values, 'disabled')}
            hasError={readFlag(values, 'hasError')}
            errorMessage={readText(values, 'errorMessage') || undefined}
        />
    );
};

const SwitchPlay = ({ values }: PlayProps) => {
    const [isOn, setIsOn] = useState(false);
    return (
        <Switch
            label={readText(values, 'label') || '스위치'}
            checked={isOn}
            onChange={setIsOn}
            size={readOption(values, 'size', ['md', 'sm'] as const)}
            onLabel={readText(values, 'onLabel') || undefined}
            offLabel={readText(values, 'offLabel') || undefined}
            disabled={readFlag(values, 'disabled')}
        />
    );
};

const SelectPlay = ({ values }: PlayProps) => {
    const [value, setValue] = useState('');
    return (
        <Select
            label={readText(values, 'label') || '라벨'}
            options={SELECT_OPTIONS}
            value={value}
            onChange={setValue}
            placeholder={readText(values, 'placeholder') || undefined}
            size={readOption(values, 'size', ['md', 'sm'] as const)}
            disabled={readFlag(values, 'disabled')}
            hasError={readFlag(values, 'hasError')}
            errorMessage={readText(values, 'errorMessage') || undefined}
        />
    );
};

const RadioPlay = ({ values }: PlayProps) => {
    const [value, setValue] = useState('basic');
    return (
        <Radio
            legend={readText(values, 'legend') || '그룹'}
            options={RADIO_OPTIONS}
            value={value}
            onChange={setValue}
            hasError={readFlag(values, 'hasError')}
            errorMessage={readText(values, 'errorMessage') || undefined}
        />
    );
};

const TextareaPlay = ({ values }: PlayProps) => {
    const [value, setValue] = useState('');
    const maxLength = readNumber(values, 'maxLength');
    return (
        <Textarea
            label={readText(values, 'label') || '라벨'}
            value={value}
            onChange={setValue}
            placeholder={readText(values, 'placeholder') || undefined}
            rows={readNumber(values, 'rows')}
            maxLength={maxLength > 0 ? maxLength : undefined}
            hasCounter={readFlag(values, 'hasCounter')}
            helpText={readText(values, 'helpText') || undefined}
            required={readFlag(values, 'required')}
            disabled={readFlag(values, 'disabled')}
            hasError={readFlag(values, 'hasError')}
            errorMessage={readText(values, 'errorMessage') || undefined}
        />
    );
};

const RangeSliderPlay = ({ values }: PlayProps) => {
    const isRange = readFlag(values, 'isRange');
    const [single, setSingle] = useState([40]);
    const [range, setRange] = useState([20, 80]);
    return (
        <Stack gap="sm">
            <p className="storyText">값: {(isRange ? range : single).join(' ~ ')}</p>
            <RangeSlider
                label="값"
                value={isRange ? range : single}
                onChange={isRange ? setRange : setSingle}
                step={readNumber(values, 'step')}
                minGap={readNumber(values, 'minGap')}
                size={readOption(values, 'size', ['md', 'sm', 'lg'] as const)}
                disabled={readFlag(values, 'disabled')}
            />
        </Stack>
    );
};

const ToggleGroupPlay = ({ values }: PlayProps) => {
    const [value, setValue] = useState('week');
    return <ToggleGroup label="조회 기간" options={TOGGLE_OPTIONS} value={value} onChange={setValue} size={readOption(values, 'size', ['md', 'sm'] as const)} />;
};

const PaginationPlay = ({ values }: PlayProps) => {
    const [page, setPage] = useState(1);
    const total = Math.max(1, readNumber(values, 'total'));
    return <Pagination total={total} current={Math.min(page, total)} onChange={setPage} max={Math.max(1, readNumber(values, 'max'))} hasEllipsis={readFlag(values, 'hasEllipsis')} />;
};

const ModalPlay = ({ values }: PlayProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => setIsOpen(false);
    return (
        <>
            <Button size="sm" shape="square" onClick={() => setIsOpen(true)}>
                Modal 열기
            </Button>
            <Modal
                isOpen={isOpen}
                onClose={handleClose}
                size={readOption(values, 'size', ['medium', 'alert', 'small', 'large', 'full'] as const)}
                title={readText(values, 'title') || undefined}
                footer={
                    readFlag(values, 'hasFooter') ? (
                        <Button size="md" shape="square" onClick={handleClose}>
                            확인
                        </Button>
                    ) : undefined
                }
            >
                <p className="storyText">모달 본문입니다. ESC로 닫을 수 있습니다.</p>
            </Modal>
        </>
    );
};

const ToastPlay = ({ values }: PlayProps) => {
    const { showToast } = useToast();
    const handleShow = () =>
        showToast(readText(values, 'message') || '알림입니다.', {
            type: readOption(values, 'type', ['default', 'success', 'info', 'warning', 'error'] as const),
            position: readOption(values, 'position', ['bottom-right', 'top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center'] as const),
            duration: readNumber(values, 'duration')
        });
    return (
        <Button size="sm" shape="square" onClick={handleShow}>
            Toast 띄우기
        </Button>
    );
};

const CollapsiblePlay = ({ values }: PlayProps) => (
    <Collapsible title={readText(values, 'title') || '제목'} defaultOpen={readFlag(values, 'defaultOpen')} disabled={readFlag(values, 'disabled')}>
        <p className="storyText">펼친 내용입니다.</p>
    </Collapsible>
);

// 문자열 Props 코드: 값이 있을 때만 name="value"
const textAttr = (values: ControlValues, name: string) => (readText(values, name) ? [`${name}="${readText(values, name)}"`] : []);

export const ATOM_STORIES: ComponentStory[] = [
    {
        id: 'accordion',
        name: 'Accordion',
        category: 'atom',
        path: 'src/components/common/Accordion.tsx',
        summary: 'WAI-ARIA Accordion 패턴: Enter·Space 토글, ↑↓·Home·End로 머리글 이동',
        api: [
            { name: 'items', type: 'AccordionItem[]', defaultValue: 'required', desc: 'id · title · content · disabled' },
            { name: 'isMultiple', type: 'boolean', defaultValue: 'false', desc: '여러 항목 동시 열기' },
            { name: 'isCollapsible', type: 'boolean', defaultValue: 'true', desc: '하나만 열 때 열린 항목을 다시 눌러 닫기' },
            { name: 'defaultOpenIds', type: 'string[]', defaultValue: '[]', desc: '처음 열어 둘 항목 id' }
        ],
        samples: [
            {
                title: '단일 · 여러 개 · disabled',
                preview: (
                    <Stack gap="md">
                        <Accordion items={ACCORDION_ITEMS} defaultOpenIds={['shipping']} />
                        <Accordion items={ACCORDION_ITEMS.slice(0, 2)} isMultiple />
                    </Stack>
                ),
                code: "<Accordion items={items} defaultOpenIds={['shipping']} />\n<Accordion items={items} isMultiple />"
            }
        ],
        playground: {
            controls: [
                { name: 'isMultiple', type: 'boolean', defaultValue: false },
                { name: 'isCollapsible', type: 'boolean', defaultValue: true }
            ],
            render: (values) => <Accordion items={ACCORDION_ITEMS} isMultiple={readFlag(values, 'isMultiple')} isCollapsible={readFlag(values, 'isCollapsible')} />,
            code: (values, controls) => toJsx('Accordion', values, controls, { extra: ['items={items}'] })
        }
    },
    {
        id: 'alert',
        name: 'Alert',
        category: 'atom',
        path: 'src/components/common/Alert.tsx',
        summary: 'error는 role="alert"로 바로 읽힙니다.',
        api: [
            { name: 'title', type: 'string', defaultValue: 'required', desc: '제목' },
            { name: 'variant', type: "'default' | 'error'", defaultValue: "'default'", desc: '안내 / 오류' },
            { name: 'children', type: 'ReactNode', defaultValue: '-', desc: '설명' }
        ],
        samples: [
            {
                title: 'variant',
                preview: (
                    <Stack gap="md">
                        <Alert title="변경 사항이 저장되었습니다.">설정은 다음 로그인부터 적용됩니다.</Alert>
                        <Alert title="결제에 실패했습니다." variant="error">
                            카드 정보를 확인한 뒤 다시 시도하세요.
                        </Alert>
                    </Stack>
                ),
                code: '<Alert title="저장되었습니다.">설명</Alert>\n<Alert title="결제 실패" variant="error">설명</Alert>'
            }
        ],
        playground: {
            controls: [
                { name: 'title', type: 'text', defaultValue: '변경 사항이 저장되었습니다.', isProp: false },
                { name: 'variant', type: 'select', options: ['default', 'error'], defaultValue: 'default' },
                { name: 'children', type: 'text', defaultValue: '설정은 다음 로그인부터 적용됩니다.', isProp: false }
            ],
            render: (values) => (
                <Alert title={readText(values, 'title') || '제목'} variant={readOption(values, 'variant', ['default', 'error'] as const)}>
                    {readText(values, 'children') || undefined}
                </Alert>
            ),
            code: (values, controls) => toJsx('Alert', values, controls, { extra: textAttr(values, 'title'), children: readText(values, 'children') || undefined })
        }
    },
    {
        id: 'avatar',
        name: 'Avatar',
        category: 'atom',
        path: 'src/components/common/Avatar.tsx',
        summary: 'src가 없거나 불러오지 못하면 이름 머리글자를 보여 줍니다. 이미지 에셋은 디자인 원본에서 받습니다.',
        api: [
            { name: 'name', type: 'string', defaultValue: 'required', desc: '이미지 alt · 머리글자' },
            { name: 'src', type: 'string', defaultValue: '-', desc: '이미지 경로' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", desc: '24 / 32 / 48px' }
        ],
        samples: [
            {
                title: 'size · 머리글자',
                preview: (
                    <Stack direction="row" gap="md" align="center" isWrap>
                        <Avatar name="홍길동" size="sm" />
                        <Avatar name="Jane Doe" />
                        <Avatar name="shadcn" size="lg" />
                        <Avatar name="이미지 오류" src="/not-found.png" />
                    </Stack>
                ),
                code: '<Avatar name="홍길동" size="sm" />\n<Avatar name="Jane Doe" src={profileImage} />'
            }
        ],
        playground: {
            controls: [
                { name: 'name', type: 'text', defaultValue: '홍길동', isProp: false },
                { name: 'size', type: 'select', options: ['md', 'sm', 'lg'], defaultValue: 'md' }
            ],
            render: (values) => <Avatar name={readText(values, 'name') || '이름'} size={readOption(values, 'size', ['md', 'sm', 'lg'] as const)} />,
            code: (values, controls) => toJsx('Avatar', values, controls, { extra: textAttr(values, 'name') })
        }
    },
    {
        id: 'breadcrumb',
        name: 'Breadcrumb',
        category: 'atom',
        path: 'src/components/common/Breadcrumb.tsx',
        summary: '마지막 항목은 현재 페이지(aria-current="page")로 링크 없이 표시합니다.',
        api: [{ name: 'items', type: '{ label: string; href?: string }[]', defaultValue: 'required', desc: '경로 항목 (href는 React Router 경로)' }],
        samples: [
            {
                title: '기본',
                preview: <Breadcrumb items={[{ label: '홈', href: '/' }, { label: '샘플 페이지', href: '/dashboard' }, { label: '대시보드' }]} />,
                code: "<Breadcrumb items={[{ label: '홈', href: '/' }, { label: '대시보드' }]} />"
            }
        ],
        playground: {
            controls: [{ name: 'depth', type: 'number', defaultValue: 3, min: 1, max: 4, isProp: false }],
            render: (values) => {
                const depth = Math.min(Math.max(readNumber(values, 'depth'), 1), BREADCRUMB_ITEMS.length);
                const items = BREADCRUMB_ITEMS.slice(0, depth).map((item, index) => (index === depth - 1 ? { label: item.label } : item));
                return <Breadcrumb items={items} />;
            },
            code: (values) => `<Breadcrumb items={items} /> // 항목 ${readNumber(values, 'depth')}개, 마지막은 현재 페이지`
        }
    },
    {
        id: 'button',
        name: 'Button',
        category: 'atom',
        path: 'src/components/common/Button.tsx',
        summary: 'button 기본 속성(onClick, type 등)을 그대로 전달합니다. className은 받지 않습니다.',
        api: [
            { name: 'size', type: "'lg' | 'md' | 'sm'", defaultValue: "'lg'", desc: '높이 48 / 40 / 32px' },
            { name: 'shape', type: "'default' | 'square'", defaultValue: "'default'", desc: '둥근형 / 모서리 8px' },
            { name: 'disabled', type: 'boolean', defaultValue: 'false', desc: '비활성 (투명도 0.4)' },
            { name: 'type', type: "'button' | 'submit' | 'reset'", defaultValue: "'button'", desc: 'button 타입' },
            { name: 'onClick', type: '(event: MouseEvent) => void', defaultValue: '-', desc: '클릭 이벤트' },
            { name: 'children', type: 'ReactNode', defaultValue: 'required', desc: '버튼 내용' }
        ],
        samples: [
            {
                title: 'size · shape · disabled',
                desc: '모든 size × shape 조합과 disabled 상태',
                preview: (
                    <Stack gap="md">
                        <Stack direction="row" gap="sm" align="end" isWrap>
                            <Button>Button</Button>
                            <Button size="md">Button</Button>
                            <Button size="sm">Button</Button>
                            <Button disabled>Button</Button>
                        </Stack>
                        <Stack direction="row" gap="sm" align="end" isWrap>
                            <Button shape="square">Button</Button>
                            <Button size="md" shape="square">Button</Button>
                            <Button size="sm" shape="square">Button</Button>
                            <Button shape="square" disabled>Button</Button>
                        </Stack>
                    </Stack>
                ),
                code: '<Button>Button</Button>\n<Button size="sm" shape="square">Button</Button>\n<Button disabled>Button</Button>'
            }
        ],
        playground: {
            controls: [
                { name: 'children', type: 'text', defaultValue: 'Button', isProp: false },
                { name: 'size', type: 'select', options: ['lg', 'md', 'sm'], defaultValue: 'lg' },
                { name: 'shape', type: 'select', options: ['default', 'square'], defaultValue: 'default' },
                { name: 'disabled', type: 'boolean', defaultValue: false }
            ],
            render: (values) => (
                <Button size={readOption(values, 'size', ['lg', 'md', 'sm'] as const)} shape={readOption(values, 'shape', ['default', 'square'] as const)} disabled={readFlag(values, 'disabled')}>
                    {readText(values, 'children') || 'Button'}
                </Button>
            ),
            code: (values, controls) => toJsx('Button', values, controls, { children: readText(values, 'children') })
        }
    },
    {
        id: 'checkbox',
        name: 'Checkbox',
        category: 'atom',
        path: 'src/components/common/Checkbox.tsx',
        summary: '실제 input[type=checkbox]를 사용합니다. 라벨 클릭·Space로 선택하고, 선택 상태 클래스는 on입니다.',
        api: [
            { name: 'checked', type: 'boolean', defaultValue: 'required', desc: '선택 여부 (제어형)' },
            { name: 'onChange', type: '(checked: boolean) => void', defaultValue: '-', desc: '선택 값 전달' },
            { name: 'label', type: 'string', defaultValue: 'required', desc: '라벨' },
            { name: 'name', type: 'string', defaultValue: '-', desc: 'input name' },
            { name: 'disabled', type: 'boolean', defaultValue: 'false', desc: '비활성' },
            { name: 'hasError', type: 'boolean', defaultValue: 'false', desc: 'aria-invalid + 빨간 테두리' },
            { name: 'errorMessage', type: 'string', defaultValue: '-', desc: '오류 문구 (aria-describedby 연결)' }
        ],
        samples: [{ title: '상태', desc: '기본 · on · disabled · on + disabled · 오류', preview: <CheckboxDemo />, code: 'const [checked, setChecked] = useState(false);\n<Checkbox label="전체 동의" checked={checked} onChange={setChecked} />' }],
        playground: {
            controls: [
                { name: 'label', type: 'text', defaultValue: '전체 동의', isProp: false },
                { name: 'disabled', type: 'boolean', defaultValue: false },
                { name: 'hasError', type: 'boolean', defaultValue: false },
                { name: 'errorMessage', type: 'text', defaultValue: '' }
            ],
            render: (values) => <CheckboxPlay values={values} />,
            code: (values, controls) => toJsx('Checkbox', values, controls, { extra: [...textAttr(values, 'label'), 'checked={checked}', 'onChange={setChecked}'] })
        }
    },
    {
        id: 'chip',
        name: 'Chip',
        category: 'atom',
        path: 'src/components/common/Chip.tsx',
        summary: '상태·수치를 보여 주는 배지입니다. 색만으로 의미를 전달하지 않도록 글자를 함께 씁니다.',
        api: [
            { name: 'label', type: 'string', defaultValue: 'required', desc: '표시 글자' },
            { name: 'color', type: "'green' | 'blue' | 'yellow' | 'red' | 'purple' | 'gray'", defaultValue: "'green'", desc: 'solid 배경색' }
        ],
        samples: [
            {
                title: 'color',
                preview: (
                    <Stack direction="row" gap="sm" isWrap>
                        {CHIP_COLORS.map((color) => (
                            <Chip key={color} label={color} color={color} />
                        ))}
                    </Stack>
                ),
                code: '<Chip label="완료" color="green" />\n<Chip label="대기" color="gray" />'
            }
        ],
        playground: {
            controls: [
                { name: 'label', type: 'text', defaultValue: '완료', isProp: false },
                { name: 'color', type: 'select', options: CHIP_COLORS, defaultValue: 'green' }
            ],
            render: (values) => <Chip label={readText(values, 'label') || '라벨'} color={readOption(values, 'color', CHIP_COLORS)} />,
            code: (values, controls) => toJsx('Chip', values, controls, { extra: textAttr(values, 'label') })
        }
    },
    {
        id: 'collapsible',
        name: 'Collapsible',
        category: 'atom',
        path: 'src/components/common/Collapsible.tsx',
        summary: '단일 접기/펼치기입니다. 여러 항목 묶음은 Accordion을 사용합니다.',
        api: [
            { name: 'title', type: 'string', defaultValue: 'required', desc: '트리거 라벨' },
            { name: 'isOpen', type: 'boolean', defaultValue: '-', desc: '넘기면 제어형' },
            { name: 'defaultOpen', type: 'boolean', defaultValue: 'false', desc: '내부 상태 초기값' },
            { name: 'onChange', type: '(isOpen: boolean) => void', defaultValue: '-', desc: '열림 상태 전달' },
            { name: 'disabled', type: 'boolean', defaultValue: 'false', desc: '비활성' },
            { name: 'children', type: 'ReactNode', defaultValue: 'required', desc: '펼칠 내용' }
        ],
        samples: [
            {
                title: '내부 상태 · 제어형 · disabled',
                preview: <CollapsibleDemo />,
                code: '<Collapsible title="주문 상세 보기">…</Collapsible>\n<Collapsible title="제어형" isOpen={isOpen} onChange={setIsOpen}>…</Collapsible>'
            }
        ],
        playground: {
            controls: [
                { name: 'title', type: 'text', defaultValue: '주문 상세 보기', isProp: false },
                { name: 'defaultOpen', type: 'boolean', defaultValue: false },
                { name: 'disabled', type: 'boolean', defaultValue: false }
            ],
            render: (values) => <CollapsiblePlay values={values} />,
            code: (values, controls) => toJsx('Collapsible', values, controls, { extra: textAttr(values, 'title'), children: '…' })
        }
    },
    {
        id: 'dropdownMenu',
        name: 'DropdownMenu',
        category: 'atom',
        path: 'src/components/common/DropdownMenu.tsx',
        summary: 'WAI-ARIA Menu Button: ↓·Enter·Space로 열기, ↑↓·Home·End 이동, ESC는 닫고 트리거로 포커스',
        api: [
            { name: 'label', type: 'string', defaultValue: 'required', desc: '트리거 문구' },
            { name: 'items', type: 'DropdownMenuItem[]', defaultValue: 'required', desc: 'id · label · onSelect · disabled · isDanger' },
            { name: 'align', type: "'start' | 'end'", defaultValue: "'start'", desc: '메뉴 정렬' },
            { name: 'items[].onSelect', type: '() => void', defaultValue: '-', desc: '항목 선택 이벤트 (선택 후 메뉴 닫힘)' }
        ],
        samples: [
            {
                title: 'align',
                preview: (
                    <Stack direction="row" gap="sm" isWrap>
                        <DropdownMenu label="내 계정" items={MENU_ITEMS} />
                        <DropdownMenu label="오른쪽 정렬" items={MENU_ITEMS} align="end" />
                    </Stack>
                ),
                code: "<DropdownMenu label=\"내 계정\" items={[{ id: 'logout', label: '로그아웃', isDanger: true, onSelect: handleLogout }]} />"
            }
        ],
        playground: {
            controls: [
                { name: 'label', type: 'text', defaultValue: '내 계정', isProp: false },
                { name: 'align', type: 'select', options: ['start', 'end'], defaultValue: 'start' }
            ],
            render: (values) => <DropdownMenu label={readText(values, 'label') || '메뉴'} items={MENU_ITEMS} align={readOption(values, 'align', ['start', 'end'] as const)} />,
            code: (values, controls) => toJsx('DropdownMenu', values, controls, { extra: [...textAttr(values, 'label'), 'items={items}'] })
        }
    },
    {
        id: 'emptyState',
        name: 'EmptyState',
        category: 'atom',
        path: 'src/components/common/EmptyState.tsx',
        summary: '데이터가 없을 때 안내 문구와 다음 동작 버튼을 보여 줍니다.',
        api: [
            { name: 'title', type: 'string', defaultValue: 'required', desc: '제목' },
            { name: 'description', type: 'string', defaultValue: '-', desc: '설명' },
            { name: 'action', type: 'ReactNode', defaultValue: '-', desc: '버튼 영역' }
        ],
        samples: [
            {
                title: '기본',
                preview: <EmptyState title="등록된 프로젝트가 없습니다" description="첫 프로젝트를 만들어 작업을 시작하세요." action={<Button size="sm">프로젝트 만들기</Button>} />,
                code: '<EmptyState title="등록된 프로젝트가 없습니다" description="…" action={<Button size="sm">만들기</Button>} />'
            }
        ],
        playground: {
            controls: [
                { name: 'title', type: 'text', defaultValue: '등록된 프로젝트가 없습니다', isProp: false },
                { name: 'description', type: 'text', defaultValue: '첫 프로젝트를 만들어 작업을 시작하세요.' },
                { name: 'hasAction', type: 'boolean', defaultValue: true, isProp: false }
            ],
            render: (values) => (
                <EmptyState
                    title={readText(values, 'title') || '제목'}
                    description={readText(values, 'description') || undefined}
                    action={readFlag(values, 'hasAction') ? <Button size="sm">프로젝트 만들기</Button> : undefined}
                />
            ),
            code: (values, controls) =>
                toJsx('EmptyState', values, controls, {
                    omit: ['description'],
                    extra: [...textAttr(values, 'title'), ...textAttr(values, 'description'), ...(readFlag(values, 'hasAction') ? ['action={<Button size="sm">만들기</Button>}'] : [])]
                })
        }
    },
    {
        id: 'input',
        name: 'Input',
        category: 'atom',
        path: 'src/components/common/Input.tsx',
        summary: '제어형입니다. input 기본 속성(name, type, placeholder, autoComplete, required, disabled 등)을 그대로 전달합니다.',
        api: [
            { name: 'label', type: 'string', defaultValue: 'required', desc: '라벨 (useId로 input과 연결)' },
            { name: 'value', type: 'string', defaultValue: 'required', desc: '입력값' },
            { name: 'onChange', type: '(value: string) => void', defaultValue: '-', desc: '입력값 전달' },
            { name: 'type', type: 'string', defaultValue: "'text'", desc: 'input 타입' },
            { name: 'helpText', type: 'string', defaultValue: '-', desc: '안내 문구 (aria-describedby)' },
            { name: 'hasError', type: 'boolean', defaultValue: 'false', desc: 'aria-invalid + 빨간 테두리' },
            { name: 'errorMessage', type: 'string', defaultValue: '-', desc: '오류 문구 (aria-describedby)' },
            { name: 'required', type: 'boolean', defaultValue: 'false', desc: '필수 (라벨 옆 * 표시)' }
        ],
        samples: [
            {
                title: '상태',
                desc: '필수 · 안내 문구 · 오류 · 비활성',
                preview: <InputDemo />,
                code: "const [email, setEmail] = useState('');\n<Input label=\"이메일\" type=\"email\" value={email} onChange={setEmail} required\n    hasError={Boolean(error)} errorMessage={error} />"
            }
        ],
        playground: {
            controls: [
                { name: 'label', type: 'text', defaultValue: '이메일', isProp: false },
                { name: 'type', type: 'select', options: ['text', 'email', 'password', 'number'], defaultValue: 'text' },
                { name: 'placeholder', type: 'text', defaultValue: '' },
                { name: 'helpText', type: 'text', defaultValue: '' },
                { name: 'required', type: 'boolean', defaultValue: false },
                { name: 'disabled', type: 'boolean', defaultValue: false },
                { name: 'hasError', type: 'boolean', defaultValue: false },
                { name: 'errorMessage', type: 'text', defaultValue: '' }
            ],
            render: (values) => <InputPlay values={values} />,
            code: (values, controls) => toJsx('Input', values, controls, { extra: [...textAttr(values, 'label'), 'value={value}', 'onChange={setValue}'] })
        }
    },
    {
        id: 'kbd',
        name: 'Kbd',
        category: 'atom',
        path: 'src/components/common/Kbd.tsx',
        summary: '키보드 키를 표시합니다. 조합 키는 Kbd를 나란히 씁니다.',
        api: [{ name: 'label', type: 'string', defaultValue: 'required', desc: '키 이름' }],
        samples: [
            {
                title: '기본 · 조합',
                preview: (
                    <Stack direction="row" gap="md" align="center" isWrap>
                        <Kbd label="Esc" />
                        <span className="storyText">
                            <Kbd label="Ctrl" /> + <Kbd label="K" />
                        </span>
                    </Stack>
                ),
                code: '<Kbd label="Ctrl" /> + <Kbd label="K" />'
            }
        ],
        playground: {
            controls: [{ name: 'label', type: 'text', defaultValue: 'Ctrl', isProp: false }],
            render: (values) => <Kbd label={readText(values, 'label') || 'Key'} />,
            code: (values, controls) => toJsx('Kbd', values, controls, { extra: textAttr(values, 'label') })
        }
    },
    {
        id: 'loading',
        name: 'Loading',
        category: 'atom',
        path: 'src/components/common/Loading.tsx',
        summary: 'role="status"로 읽힙니다. 전체 화면은 #modalWrap에 그리고 배경 스크롤을 잠급니다.',
        api: [
            { name: 'isLoading', type: 'boolean', defaultValue: 'required', desc: '로딩 중 여부' },
            { name: 'label', type: 'string', defaultValue: "'로딩 중'", desc: '안내 문구' },
            { name: 'isFullscreen', type: 'boolean', defaultValue: 'true', desc: 'false면 children 영역만 덮음 (aria-busy)' },
            { name: 'children', type: 'ReactNode', defaultValue: '-', desc: '영역 로딩 대상' }
        ],
        samples: [
            {
                title: '영역 · 전체 화면',
                preview: <LoadingDemo />,
                code: '<Loading isLoading={isLoading} isFullscreen={false}>\n    <Card title="최근 주문">…</Card>\n</Loading>\n<Loading isLoading={isSaving} label="저장 중" />'
            }
        ],
        playground: {
            controls: [
                { name: 'isLoading', type: 'boolean', defaultValue: true, isProp: false },
                { name: 'label', type: 'text', defaultValue: '' }
            ],
            render: (values) => (
                <Loading isLoading={readFlag(values, 'isLoading')} isFullscreen={false} label={readText(values, 'label') || undefined}>
                    <Card title="최근 주문">
                        <p className="storyText">주문 3건이 있습니다.</p>
                    </Card>
                </Loading>
            ),
            code: (values, controls) => toJsx('Loading', values, controls, { extra: [`isLoading={${readFlag(values, 'isLoading')}}`, 'isFullscreen={false}'], children: '\n    …\n' })
        }
    },
    {
        id: 'modal',
        name: 'Modal',
        category: 'atom',
        path: 'src/components/common/Modal.tsx',
        summary: '#modalWrap Portal · ESC 닫기 · 포커스 트랩 · 닫으면 연 버튼으로 포커스 복귀 · 배경 스크롤 잠금. alert는 role="alertdialog"이고 버튼으로만 닫습니다.',
        api: [
            { name: 'isOpen', type: 'boolean', defaultValue: 'required', desc: '열림 여부 (부모 상태)' },
            { name: 'onClose', type: '() => void', defaultValue: 'required', desc: '닫기 요청 (ESC·닫기 버튼·딤 클릭)' },
            { name: 'size', type: "'alert' | 'small' | 'medium' | 'large' | 'full'", defaultValue: "'medium'", desc: '최대 폭 400 / 400 / 520 / 800px / 전체' },
            { name: 'title', type: 'string', defaultValue: '-', desc: '제목 (없으면 숨김 제목 "알림")' },
            { name: 'footer', type: 'ReactNode', defaultValue: '-', desc: '버튼 영역' },
            { name: 'children', type: 'ReactNode', defaultValue: 'required', desc: '본문' }
        ],
        samples: [
            {
                title: 'size',
                desc: '버튼을 눌러 열고 ESC·Tab으로 확인하세요.',
                preview: <ModalDemo />,
                code: 'const [isOpen, setIsOpen] = useState(false);\n<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="프로필 수정"\n    footer={<Button onClick={handleSave}>저장</Button>}>…</Modal>'
            }
        ],
        playground: {
            controls: [
                { name: 'size', type: 'select', options: ['medium', 'alert', 'small', 'large', 'full'], defaultValue: 'medium' },
                { name: 'title', type: 'text', defaultValue: '프로필 수정' },
                { name: 'hasFooter', type: 'boolean', defaultValue: true, isProp: false }
            ],
            render: (values) => <ModalPlay values={values} />,
            code: (values, controls) =>
                toJsx('Modal', values, controls, {
                    omit: ['title'],
                    extra: ['isOpen={isOpen}', 'onClose={handleClose}', ...textAttr(values, 'title'), ...(readFlag(values, 'hasFooter') ? ['footer={<Button>확인</Button>}'] : [])],
                    children: '\n    …\n'
                })
        }
    },
    {
        id: 'pagination',
        name: 'Pagination',
        category: 'atom',
        path: 'src/components/common/Pagination.tsx',
        summary: '현재 페이지는 aria-current="page". « »는 max만큼, ‹ ›는 1페이지씩 이동합니다.',
        api: [
            { name: 'total', type: 'number', defaultValue: 'required', desc: '전체 페이지 수' },
            { name: 'current', type: 'number', defaultValue: 'required', desc: '현재 페이지' },
            { name: 'onChange', type: '(page: number) => void', defaultValue: '-', desc: '페이지 전달' },
            { name: 'max', type: 'number', defaultValue: '5', desc: '한 번에 보일 번호 수 · « » 이동 거리' },
            { name: 'hasEllipsis', type: 'boolean', defaultValue: 'false', desc: '첫·마지막 페이지와 … 표시' },
            { name: 'getHref', type: '(page: number) => string', defaultValue: '-', desc: '있으면 a 링크로 렌더링' }
        ],
        samples: [{ title: '기본 · hasEllipsis', preview: <PaginationDemo />, code: '<Pagination total={20} current={page} onChange={setPage} hasEllipsis />' }],
        playground: {
            controls: [
                { name: 'total', type: 'number', defaultValue: 20, min: 1, max: 100, isProp: false },
                { name: 'max', type: 'number', defaultValue: 5, min: 1, max: 10 },
                { name: 'hasEllipsis', type: 'boolean', defaultValue: false }
            ],
            render: (values) => <PaginationPlay values={values} />,
            code: (values, controls) => toJsx('Pagination', values, controls, { extra: [`total={${readNumber(values, 'total')}}`, 'current={page}', 'onChange={setPage}'] })
        }
    },
    {
        id: 'popover',
        name: 'Popover',
        category: 'atom',
        path: 'src/components/common/Popover.tsx',
        summary: '바깥 클릭·ESC로 닫힙니다. ESC로 닫으면 트리거로 포커스가 돌아갑니다.',
        api: [
            { name: 'trigger', type: 'ReactNode', defaultValue: 'required', desc: '트리거 버튼 내용' },
            { name: 'title', type: 'string', defaultValue: '-', desc: '제목 (aria-labelledby)' },
            { name: 'placement', type: 'Placement', defaultValue: "'bottom'", desc: 'top·bottom·left·right × start·end (12종)' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", desc: '폭 200 / 280 / 360px' },
            { name: 'children', type: 'ReactNode', defaultValue: 'required', desc: '내용' }
        ],
        samples: [
            {
                title: 'placement · size',
                preview: (
                    <div className="storyPopoverArea">
                        <Stack direction="row" gap="sm" justify="center" isWrap>
                            {POPOVER_PLACEMENTS.map((placement) => (
                                <Popover key={placement} trigger={placement} title="크기 설정" placement={placement} size="sm">
                                    너비와 높이를 정합니다.
                                </Popover>
                            ))}
                        </Stack>
                    </div>
                ),
                code: '<Popover trigger="크기 설정" title="크기 설정" placement="bottom-start">…</Popover>'
            }
        ],
        playground: {
            controls: [
                { name: 'title', type: 'text', defaultValue: '크기 설정' },
                { name: 'placement', type: 'select', options: ['bottom', ...PLACEMENTS.filter((item) => item !== 'bottom')], defaultValue: 'bottom' },
                { name: 'size', type: 'select', options: ['md', 'sm', 'lg'], defaultValue: 'md' }
            ],
            render: (values) => (
                <div className="storyPopoverArea">
                    <Stack direction="row" justify="center">
                        <Popover
                            trigger="열기"
                            title={readText(values, 'title') || undefined}
                            placement={readOption(values, 'placement', PLACEMENTS)}
                            size={readOption(values, 'size', ['md', 'sm', 'lg'] as const)}
                        >
                            너비와 높이를 정합니다.
                        </Popover>
                    </Stack>
                </div>
            ),
            code: (values, controls) => toJsx('Popover', values, controls, { omit: ['title'], extra: ['trigger="열기"', ...textAttr(values, 'title')], children: '…' })
        }
    },
    {
        id: 'portal',
        name: 'Portal',
        category: 'internal',
        path: 'src/components/common/Portal.tsx',
        summary: 'Modal·Toast·Loading(전체 화면)이 사용하는 내부 유틸입니다. 대상은 #wrap 안의 #modalWrap으로 고정이며 document.body에 렌더링하지 않습니다.',
        api: [{ name: 'children', type: 'ReactNode', defaultValue: 'required', desc: '#modalWrap에 그릴 내용' }],
        samples: [{ title: '사용 위치', desc: '화면에 직접 쓰지 않습니다. Modal 샘플에서 동작을 확인하세요.', preview: <p className="storyText">Modal · Toast · Loading(전체 화면) 내부</p>, code: '<Portal>\n    <div className="modalOverlay">…</div>\n</Portal>' }]
    },
    {
        id: 'progress',
        name: 'Progress',
        category: 'atom',
        path: 'src/components/common/Progress.tsx',
        summary: '네이티브 progress를 사용해 인라인 스타일 없이 진행률을 표시합니다.',
        api: [
            { name: 'value', type: 'number', defaultValue: 'required', desc: '현재 값' },
            { name: 'label', type: 'string', defaultValue: 'required', desc: '라벨 (progress와 연결)' },
            { name: 'max', type: 'number', defaultValue: '100', desc: '최댓값' },
            { name: 'hasValueText', type: 'boolean', defaultValue: 'true', desc: '% 글자 표시' }
        ],
        samples: [
            {
                title: '값',
                preview: (
                    <Stack gap="md">
                        {PROGRESS_VALUES.map((value) => (
                            <Progress key={value} label={`업로드 ${value}%`} value={value} />
                        ))}
                    </Stack>
                ),
                code: '<Progress label="업로드" value={35} />'
            }
        ],
        playground: {
            controls: [
                { name: 'label', type: 'text', defaultValue: '업로드', isProp: false },
                { name: 'value', type: 'number', defaultValue: 35, min: 0, max: 100, isProp: false },
                { name: 'hasValueText', type: 'boolean', defaultValue: true }
            ],
            render: (values) => <Progress label={readText(values, 'label') || '진행률'} value={readNumber(values, 'value')} hasValueText={readFlag(values, 'hasValueText')} />,
            code: (values, controls) => toJsx('Progress', values, controls, { extra: [...textAttr(values, 'label'), `value={${readNumber(values, 'value')}}`] })
        }
    },
    {
        id: 'radio',
        name: 'Radio',
        category: 'atom',
        path: 'src/components/common/Radio.tsx',
        summary: 'fieldset > legend + 네이티브 radio (방향키 이동). 선택 상태 클래스 on',
        api: [
            { name: 'options', type: 'RadioOption[]', defaultValue: 'required', desc: 'value · label · description · disabled' },
            { name: 'value', type: 'string', defaultValue: 'required', desc: '선택 값 (제어형)' },
            { name: 'onChange', type: '(value: string) => void', defaultValue: '-', desc: '선택 값 전달' },
            { name: 'legend', type: 'string', defaultValue: 'required', desc: '그룹 이름' },
            { name: 'name', type: 'string', defaultValue: 'useId', desc: 'radio name' },
            { name: 'hasError', type: 'boolean', defaultValue: 'false', desc: 'aria-invalid' },
            { name: 'errorMessage', type: 'string', defaultValue: '-', desc: '오류 문구 (aria-describedby)' }
        ],
        samples: [{ title: '상태', desc: '기본 · on · 설명 · disabled · 오류', preview: <RadioDemo />, code: "const [plan, setPlan] = useState('basic');\n<Radio legend=\"요금제\" options={options} value={plan} onChange={setPlan} />" }],
        playground: {
            controls: [
                { name: 'legend', type: 'text', defaultValue: '요금제', isProp: false },
                { name: 'hasError', type: 'boolean', defaultValue: false },
                { name: 'errorMessage', type: 'text', defaultValue: '' }
            ],
            render: (values) => <RadioPlay values={values} />,
            code: (values, controls) => toJsx('Radio', values, controls, { extra: [...textAttr(values, 'legend'), 'options={options}', 'value={plan}', 'onChange={setPlan}'] })
        }
    },
    {
        id: 'rangeSlider',
        name: 'RangeSlider',
        category: 'atom',
        path: 'src/components/common/RangeSlider.tsx',
        summary: '네이티브 range 사용(방향키·Home·End). 트랙(바)을 눌러도 이동합니다. 값이 2개면 범위 선택입니다. 채워진 트랙 위치는 인라인 CSS 변수(design.md 6.2)',
        api: [
            { name: 'value', type: 'number[]', defaultValue: 'required', desc: '[50] 단일 / [20, 80] 범위' },
            { name: 'onChange', type: '(value: number[]) => void', defaultValue: '-', desc: '값 전달 (손잡이·트랙 클릭·드래그·키보드)' },
            { name: 'label', type: 'string', defaultValue: 'required', desc: 'aria-label (범위는 최솟값·최댓값을 덧붙임)' },
            { name: 'min · max · step', type: 'number', defaultValue: '0 · 100 · 1', desc: '범위와 간격' },
            { name: 'minGap', type: 'number', defaultValue: '0', desc: '두 값 사이 최소 간격' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", desc: '트랙·손잡이 크기' },
            { name: 'disabled', type: 'boolean', defaultValue: 'false', desc: '비활성' }
        ],
        samples: [{ title: '단일 · 범위 · size · disabled', preview: <RangeSliderDemo />, code: 'const [price, setPrice] = useState([20, 80]);\n<RangeSlider label="가격" value={price} onChange={setPrice} minGap={10} />' }],
        playground: {
            controls: [
                { name: 'isRange', type: 'boolean', defaultValue: false, isProp: false },
                { name: 'step', type: 'number', defaultValue: 1, min: 1, max: 25 },
                { name: 'minGap', type: 'number', defaultValue: 0, min: 0, max: 50 },
                { name: 'size', type: 'select', options: ['md', 'sm', 'lg'], defaultValue: 'md' },
                { name: 'disabled', type: 'boolean', defaultValue: false }
            ],
            render: (values) => <RangeSliderPlay values={values} />,
            code: (values, controls) => toJsx('RangeSlider', values, controls, { extra: ['label="값"', `value={${readFlag(values, 'isRange') ? '[20, 80]' : '[40]'}}`, 'onChange={setValue}'] })
        }
    },
    {
        id: 'select',
        name: 'Select',
        category: 'atom',
        path: 'src/components/common/Select.tsx',
        summary: '네이티브 select 단일 선택. option에 group을 주면 optgroup으로 묶습니다.',
        api: [
            { name: 'options', type: 'SelectOption[]', defaultValue: 'required', desc: 'value · label · disabled · group' },
            { name: 'value', type: 'string', defaultValue: 'required', desc: "선택 값 ('' = placeholder)" },
            { name: 'onChange', type: '(value: string) => void', defaultValue: '-', desc: '선택 값 전달' },
            { name: 'label', type: 'string', defaultValue: 'required', desc: '라벨 (useId 연결)' },
            { name: 'placeholder', type: 'string', defaultValue: '-', desc: '선택 전 문구' },
            { name: 'size', type: "'md' | 'sm'", defaultValue: "'md'", desc: '높이 36 / 32px' },
            { name: 'disabled', type: 'boolean', defaultValue: 'false', desc: '비활성' },
            { name: 'hasError · errorMessage', type: 'boolean · string', defaultValue: 'false · -', desc: 'aria-invalid · aria-describedby' }
        ],
        samples: [{ title: '상태', desc: '기본(그룹) · sm · 오류 · 비활성', preview: <SelectDemo />, code: "const [fruit, setFruit] = useState('');\n<Select label=\"품목\" options={options} value={fruit} onChange={setFruit} placeholder=\"선택하세요\" />" }],
        playground: {
            controls: [
                { name: 'label', type: 'text', defaultValue: '품목', isProp: false },
                { name: 'placeholder', type: 'text', defaultValue: '선택하세요' },
                { name: 'size', type: 'select', options: ['md', 'sm'], defaultValue: 'md' },
                { name: 'disabled', type: 'boolean', defaultValue: false },
                { name: 'hasError', type: 'boolean', defaultValue: false },
                { name: 'errorMessage', type: 'text', defaultValue: '' }
            ],
            render: (values) => <SelectPlay values={values} />,
            code: (values, controls) => toJsx('Select', values, controls, { omit: ['placeholder'], extra: [...textAttr(values, 'label'), 'options={options}', 'value={value}', 'onChange={setValue}', ...textAttr(values, 'placeholder')] })
        }
    },
    {
        id: 'separator',
        name: 'Separator',
        category: 'atom',
        path: 'src/components/common/Separator.tsx',
        summary: '내용을 나누는 구분선입니다. 의미가 있는 구분이면 isDecorative={false}로 role="separator"를 줍니다.',
        api: [
            { name: 'orientation', type: "'horizontal' | 'vertical'", defaultValue: "'horizontal'", desc: '방향' },
            { name: 'isDecorative', type: 'boolean', defaultValue: 'true', desc: 'false면 role="separator"' }
        ],
        samples: [
            {
                title: '가로 · 세로',
                preview: (
                    <Stack gap="sm">
                        <p className="storyText">Radix Primitives</p>
                        <Separator />
                        <Stack direction="row" gap="sm" align="center">
                            <span className="storyText">Blog</span>
                            <Separator orientation="vertical" />
                            <span className="storyText">Docs</span>
                            <Separator orientation="vertical" />
                            <span className="storyText">Source</span>
                        </Stack>
                    </Stack>
                ),
                code: '<Separator />\n<Separator orientation="vertical" />'
            }
        ],
        playground: {
            controls: [
                { name: 'orientation', type: 'select', options: ['horizontal', 'vertical'], defaultValue: 'horizontal' },
                { name: 'isDecorative', type: 'boolean', defaultValue: true }
            ],
            render: (values) => (
                <Stack direction={readText(values, 'orientation') === 'vertical' ? 'row' : 'column'} gap="sm" align={readText(values, 'orientation') === 'vertical' ? 'center' : 'stretch'}>
                    <span className="storyText">앞 내용</span>
                    <Separator orientation={readOption(values, 'orientation', ['horizontal', 'vertical'] as const)} isDecorative={readFlag(values, 'isDecorative')} />
                    <span className="storyText">뒤 내용</span>
                </Stack>
            ),
            code: (values, controls) => toJsx('Separator', values, controls)
        }
    },
    {
        id: 'skeleton',
        name: 'Skeleton',
        category: 'atom',
        path: 'src/components/common/Skeleton.tsx',
        summary: '크기는 shape 프리셋으로만 정합니다(D8). 감싸는 영역에 aria-busy를 지정하세요.',
        api: [
            { name: 'variant', type: "'default' | 'muted'", defaultValue: "'default'", desc: '색 농도' },
            { name: 'shape', type: "'text' | 'title' | 'avatar' | 'button' | 'image'", defaultValue: "'text'", desc: '형태 프리셋' }
        ],
        samples: [
            {
                title: 'shape · variant',
                preview: (
                    <Stack gap="md">
                        {SKELETON_SHAPES.map((shape) => (
                            <Skeleton key={shape} shape={shape} />
                        ))}
                        <Skeleton variant="muted" />
                    </Stack>
                ),
                code: '<Skeleton shape="avatar" />\n<Skeleton shape="title" />\n<Skeleton variant="muted" />'
            }
        ],
        playground: {
            controls: [
                { name: 'shape', type: 'select', options: [...SKELETON_SHAPES], defaultValue: 'text' },
                { name: 'variant', type: 'select', options: ['default', 'muted'], defaultValue: 'default' }
            ],
            render: (values) => <Skeleton shape={readOption(values, 'shape', SKELETON_SHAPES)} variant={readOption(values, 'variant', ['default', 'muted'] as const)} />,
            code: (values, controls) => toJsx('Skeleton', values, controls)
        }
    },
    {
        id: 'switch',
        name: 'Switch',
        category: 'atom',
        path: 'src/components/common/Switch.tsx',
        summary: 'button[role=switch]. Header 다크모드 스위치도 이 컴포넌트를 사용합니다.',
        api: [
            { name: 'checked', type: 'boolean', defaultValue: 'required', desc: '켜짐 여부 (제어형)' },
            { name: 'onChange', type: '(checked: boolean) => void', defaultValue: '-', desc: '값 전달' },
            { name: 'label', type: 'string', defaultValue: 'required', desc: '접근 가능한 이름 (aria-label)' },
            { name: 'onLabel · offLabel', type: 'string', defaultValue: "'ON' · 'OFF'", desc: '스위치 안 글자' },
            { name: 'size', type: "'md' | 'sm'", defaultValue: "'md'", desc: '68×32 / 52×24px' },
            { name: 'disabled', type: 'boolean', defaultValue: 'false', desc: '비활성' }
        ],
        samples: [{ title: 'size · 상태', preview: <SwitchDemo />, code: '<Switch label="알림 받기" checked={isOn} onChange={setIsOn} />' }],
        playground: {
            controls: [
                { name: 'label', type: 'text', defaultValue: '알림 받기', isProp: false },
                { name: 'size', type: 'select', options: ['md', 'sm'], defaultValue: 'md' },
                { name: 'onLabel', type: 'text', defaultValue: '' },
                { name: 'offLabel', type: 'text', defaultValue: '' },
                { name: 'disabled', type: 'boolean', defaultValue: false }
            ],
            render: (values) => <SwitchPlay values={values} />,
            code: (values, controls) => toJsx('Switch', values, controls, { extra: [...textAttr(values, 'label'), 'checked={isOn}', 'onChange={setIsOn}'] })
        }
    },
    {
        id: 'tabs',
        name: 'Tabs',
        category: 'atom',
        path: 'src/components/common/Tabs.tsx',
        summary: 'WAI-ARIA Tabs: ←→·Home·End로 이동하면 바로 선택됩니다.',
        api: [
            { name: 'items', type: 'TabItem[]', defaultValue: 'required', desc: 'id · label · content · disabled' },
            { name: 'label', type: 'string', defaultValue: '-', desc: 'tablist aria-label' },
            { name: 'appearance', type: "'default' | 'line'", defaultValue: "'default'", desc: '묶음형 / 밑줄형' },
            { name: 'activeIndex', type: 'number', defaultValue: '-', desc: '외부 제어 시에만' },
            { name: 'onChange', type: '(index: number) => void', defaultValue: '-', desc: '선택 탭 전달' }
        ],
        samples: [
            {
                title: 'appearance',
                preview: (
                    <Stack gap="lg">
                        <Tabs label="계정 설정" items={TAB_ITEMS} />
                        <Tabs label="계정 설정 (line)" items={TAB_ITEMS} appearance="line" />
                    </Stack>
                ),
                code: '<Tabs label="계정 설정" items={items} />\n<Tabs label="계정 설정" items={items} appearance="line" />'
            }
        ],
        playground: {
            controls: [{ name: 'appearance', type: 'select', options: ['default', 'line'], defaultValue: 'default' }],
            render: (values) => <Tabs label="계정 설정" items={TAB_ITEMS} appearance={readOption(values, 'appearance', ['default', 'line'] as const)} />,
            code: (values, controls) => toJsx('Tabs', values, controls, { extra: ['label="계정 설정"', 'items={items}'] })
        }
    },
    {
        id: 'textarea',
        name: 'Textarea',
        category: 'atom',
        path: 'src/components/common/Textarea.tsx',
        summary: '안내·글자 수·오류 문구를 aria-describedby로 연결합니다. 글자 수 90% 이상이면 빨간색.',
        api: [
            { name: 'value', type: 'string', defaultValue: 'required', desc: '입력값' },
            { name: 'onChange', type: '(value: string) => void', defaultValue: '-', desc: '입력값 전달' },
            { name: 'label', type: 'string', defaultValue: 'required', desc: '라벨' },
            { name: 'rows', type: 'number', defaultValue: '4', desc: '기본 줄 수' },
            { name: 'maxLength · hasCounter', type: 'number · boolean', defaultValue: '- · false', desc: '최대 글자 수 · 0 / 100 표시' },
            { name: 'helpText', type: 'string', defaultValue: '-', desc: '안내 문구' },
            { name: 'footer', type: 'ReactNode', defaultValue: '-', desc: '아래쪽 버튼 영역' },
            { name: 'required · disabled', type: 'boolean', defaultValue: 'false', desc: '필수 * 표시 · 비활성' },
            { name: 'hasError · errorMessage', type: 'boolean · string', defaultValue: 'false · -', desc: 'aria-invalid · 오류 문구' }
        ],
        samples: [{ title: '상태', desc: '글자 수 · 오류 · 비활성', preview: <TextareaDemo />, code: '<Textarea label="문의 내용" value={text} onChange={setText} maxLength={100} hasCounter />' }],
        playground: {
            controls: [
                { name: 'label', type: 'text', defaultValue: '문의 내용', isProp: false },
                { name: 'placeholder', type: 'text', defaultValue: '' },
                { name: 'rows', type: 'number', defaultValue: 4, min: 1, max: 10 },
                { name: 'maxLength', type: 'number', defaultValue: 0, min: 0, max: 500 },
                { name: 'hasCounter', type: 'boolean', defaultValue: false },
                { name: 'helpText', type: 'text', defaultValue: '' },
                { name: 'required', type: 'boolean', defaultValue: false },
                { name: 'disabled', type: 'boolean', defaultValue: false },
                { name: 'hasError', type: 'boolean', defaultValue: false },
                { name: 'errorMessage', type: 'text', defaultValue: '' }
            ],
            render: (values) => <TextareaPlay values={values} />,
            code: (values, controls) => toJsx('Textarea', values, controls, { extra: [...textAttr(values, 'label'), 'value={text}', 'onChange={setText}'] })
        }
    },
    {
        id: 'toast',
        name: 'Toast',
        category: 'atom',
        path: 'src/components/common/Toast.tsx',
        summary: 'ToastProvider(Layout·MemberLayout에 1회)가 #modalWrap에 그립니다. useToast().showToast(message, options)로 띄웁니다.',
        api: [
            { name: 'message', type: 'string', defaultValue: 'required', desc: '알림 문구 (showToast 첫 인자)' },
            { name: 'type', type: "'default' | 'success' | 'info' | 'warning' | 'error'", defaultValue: "'default'", desc: '아이콘 · error는 role="alert"' },
            { name: 'position', type: 'ToastPosition (6종)', defaultValue: "'bottom-right'", desc: 'top·bottom × left·center·right' },
            { name: 'duration', type: 'number', defaultValue: '4000', desc: '자동 닫힘(ms), 닫기 버튼 제공' }
        ],
        samples: [{ title: 'type · position', preview: <ToastDemo />, code: "const { showToast } = useToast();\nshowToast('저장했습니다.', { type: 'success', position: 'top-center' });" }],
        playground: {
            controls: [
                { name: 'message', type: 'text', defaultValue: '저장했습니다.' },
                { name: 'type', type: 'select', options: TOAST_TYPES, defaultValue: 'default' },
                { name: 'position', type: 'select', options: ['bottom-right', 'top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center'], defaultValue: 'bottom-right' },
                { name: 'duration', type: 'number', defaultValue: 4000, min: 1000, max: 10000 }
            ],
            render: (values) => <ToastPlay values={values} />,
            code: (values, controls) => {
                const options = controls
                    .filter((control) => control.name !== 'message' && values[control.name] !== control.defaultValue)
                    .map((control) => `${control.name}: ${typeof values[control.name] === 'number' ? values[control.name] : `'${values[control.name]}'`}`);
                return `const { showToast } = useToast();\nshowToast('${readText(values, 'message')}'${options.length ? `, { ${options.join(', ')} }` : ''});`;
            }
        }
    },
    {
        id: 'toggleGroup',
        name: 'ToggleGroup',
        category: 'atom',
        path: 'src/components/common/ToggleGroup.tsx',
        summary: '하나만 선택하는 버튼 묶음 (aria-pressed)',
        api: [
            { name: 'options', type: 'ToggleOption[]', defaultValue: 'required', desc: 'value · label · disabled' },
            { name: 'value', type: 'string', defaultValue: 'required', desc: '선택 값' },
            { name: 'onChange', type: '(value: string) => void', defaultValue: '-', desc: '선택 값 전달' },
            { name: 'label', type: 'string', defaultValue: 'required', desc: 'group aria-label' },
            { name: 'size', type: "'md' | 'sm'", defaultValue: "'md'", desc: '높이 36 / 30px' }
        ],
        samples: [{ title: 'size · disabled', preview: <ToggleGroupDemo />, code: '<ToggleGroup label="조회 기간" options={options} value={period} onChange={setPeriod} />' }],
        playground: {
            controls: [{ name: 'size', type: 'select', options: ['md', 'sm'], defaultValue: 'md' }],
            render: (values) => <ToggleGroupPlay values={values} />,
            code: (values, controls) => toJsx('ToggleGroup', values, controls, { extra: ['label="조회 기간"', 'options={options}', 'value={period}', 'onChange={setPeriod}'] })
        }
    },
    {
        id: 'tooltip',
        name: 'Tooltip',
        category: 'atom',
        path: 'src/components/common/Tooltip.tsx',
        summary: '마우스를 올리거나 Tab으로 포커스하면 보이고, ESC로 숨깁니다. children은 포커스 가능한 요소 하나입니다.',
        api: [
            { name: 'content', type: 'string', defaultValue: 'required', desc: '툴팁 문구 (aria-describedby)' },
            { name: 'placement', type: "'top' | 'right' | 'bottom' | 'left'", defaultValue: "'top'", desc: '위치' },
            { name: 'hasArrow', type: 'boolean', defaultValue: 'true', desc: '화살표' },
            { name: 'children', type: 'ReactElement', defaultValue: 'required', desc: '트리거' }
        ],
        samples: [
            {
                title: 'placement',
                preview: (
                    <div className="storyPopoverArea">
                        <Stack direction="row" gap="sm" justify="center" isWrap>
                            {(['top', 'right', 'bottom', 'left'] as const).map((placement) => (
                                <Tooltip key={placement} content="장바구니에 담기" placement={placement}>
                                    <Button size="sm" shape="square">
                                        {placement}
                                    </Button>
                                </Tooltip>
                            ))}
                            <Tooltip content="화살표 없음" hasArrow={false}>
                                <Button size="sm" shape="square">
                                    no arrow
                                </Button>
                            </Tooltip>
                        </Stack>
                    </div>
                ),
                code: '<Tooltip content="장바구니에 담기">\n    <Button size="sm">담기</Button>\n</Tooltip>'
            }
        ],
        playground: {
            controls: [
                { name: 'content', type: 'text', defaultValue: '장바구니에 담기', isProp: false },
                { name: 'placement', type: 'select', options: ['top', 'right', 'bottom', 'left'], defaultValue: 'top' },
                { name: 'hasArrow', type: 'boolean', defaultValue: true }
            ],
            render: (values) => (
                <div className="storyPopoverArea">
                    <Stack direction="row" justify="center">
                        <Tooltip content={readText(values, 'content') || '설명'} placement={readOption(values, 'placement', ['top', 'right', 'bottom', 'left'] as const)} hasArrow={readFlag(values, 'hasArrow')}>
                            <Button size="sm" shape="square">
                                마우스를 올려 보세요
                            </Button>
                        </Tooltip>
                    </Stack>
                </div>
            ),
            code: (values, controls) => toJsx('Tooltip', values, controls, { extra: textAttr(values, 'content'), children: '\n    <Button size="sm">담기</Button>\n' })
        }
    }
];

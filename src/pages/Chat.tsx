import { useEffect, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import Accordion from '../components/common/Accordion';
import Alert from '../components/common/Alert';
import Avatar from '../components/common/Avatar';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Chart from '../components/common/Chart';
import Chip from '../components/common/Chip';
import Grid from '../components/common/Grid';
import Input from '../components/common/Input';
import Progress from '../components/common/Progress';
import Section from '../components/common/Section';
import Slider from '../components/common/Slider';
import Stack from '../components/common/Stack';
import Table from '../components/common/Table';
import TextList from '../components/common/TextList';
import {
    CHAT_ANSWER_RULES,
    NOTICE_FAQ,
    ORDER_ROWS,
    PRODUCT_ITEMS,
    PROGRESS_ITEMS,
    SALES_ROWS,
    SALES_SUMMARY,
    SCHEDULE_ITEMS,
    TEAM_MEMBERS,
    WEATHER_DAYS,
    WELCOME_TEXT,
    findAnswerKind,
    getAnswerIntro
} from '../data/chatData';
import type { ChatAnswerKind, OrderRow } from '../data/chatData';
import { useToast } from '../hooks/useToast';
import type { TableColumn } from '../types';

// 챗봇 샘플 (/chat) — docs/requirements.md 4장
// 질문을 보내면 키워드로 답변 종류를 골라(src/data/chatData.ts) 종류마다 다른 공통 컴포넌트로 답합니다.
// 답변 8종: 매출(Chart+상세형 Table) · 주문(목록형 Table+Chip) · 날씨(Grid+Card) · 일정(TextList+Button)
//          · 추천(Slider+Card) · 담당자(카드형: Grid+Card+Avatar) · 공지(Alert+Accordion) · 진행률(Progress) + 이해 못 함(추천 질문)
// 답변 문장과 내용은 한 말풍선(.chatBubble.hasRich) 안에 둡니다.
// 대화 기록은 role="log"로 새 메시지를 보조기술에 알립니다. (목업: 실제 AI·서버 연동 없음)

interface ChatMessage {
    id: number;
    role: 'user' | 'bot';
    text: string;
    kind?: ChatAnswerKind;
    hasSuggestions?: boolean;      // 첫 인사: 추천 질문 버튼 표시
    time: string;
}

interface SuggestionButtonsProps {
    onAsk: (question: string) => void;
}

interface BotAnswerProps {
    kind: ChatAnswerKind;
    onAsk: (question: string) => void;
}

const BOT_DELAY = 700;

const ORDER_COLUMNS: TableColumn<OrderRow>[] = [
    { key: 'id', header: '주문번호', align: 'center' },
    { key: 'product', header: '상품' },
    { key: 'date', header: '주문일', align: 'center' },
    { key: 'amount', header: '금액', align: 'center' },
    { key: 'status', header: '상태', align: 'center', render: (row) => <Chip label={row.status} color={row.statusColor} /> }
];

const getTime = () => new Intl.DateTimeFormat('ko-KR', { hour: '2-digit', minute: '2-digit' }).format(new Date());

// 추천 질문 버튼 묶음 (첫 화면·이해 못 한 질문에 사용)
const SuggestionButtons = ({ onAsk }: SuggestionButtonsProps) => (
    <Stack direction="row" gap="sm" isWrap>
        {CHAT_ANSWER_RULES.map((rule) => (
            <Button key={rule.kind} size="sm" shape="square" onClick={() => onAsk(rule.sampleQuestion)}>
                {rule.sampleQuestion}
            </Button>
        ))}
    </Stack>
);

const ScheduleAnswer = () => {
    const { showToast } = useToast();
    return (
        <Card
            title="오늘 일정"
            size="sm"
            headingLevel={4}
            footer={
                <Stack direction="row" justify="end">
                    <Button size="sm" shape="square" onClick={() => showToast('일정 4건을 캘린더에 추가했습니다.', { type: 'success' })}>
                        캘린더에 추가
                    </Button>
                </Stack>
            }
        >
            <TextList type="decimal" items={SCHEDULE_ITEMS} />
        </Card>
    );
};

// 카드형 데이터: 담당자 프로필 카드 (Grid 2열)
const TeamAnswer = () => {
    const { showToast } = useToast();
    return (
        <Grid columns={2} gap="sm">
            {TEAM_MEMBERS.map((member) => (
                <Card
                    key={member.id}
                    title={member.name}
                    description={`${member.team} · ${member.role}`}
                    size="sm"
                    headingLevel={4}
                    action={<Chip label={member.status} color={member.statusColor} />}
                    footer={
                        <Stack direction="row" gap="sm" justify="end">
                            <Button size="sm" shape="square" onClick={() => showToast(`${member.name}님에게 메시지를 보냈습니다.`, { type: 'success' })}>
                                메시지
                            </Button>
                        </Stack>
                    }
                >
                    <Stack direction="row" gap="md" align="center">
                        <Avatar name={member.name} size="lg" />
                        <TextList size="sm" items={[`메일 ${member.email}`, `내선 ${member.phone}`, `담당 ${member.duty}`]} />
                    </Stack>
                </Card>
            ))}
        </Grid>
    );
};

// 답변 종류별 화면
const BotAnswer = ({ kind, onAsk }: BotAnswerProps) => {
    const answers: Record<ChatAnswerKind, ReactNode> = {
        sales: (
            <Stack gap="sm">
                <Card title="월별 매출·이익 (단위: 만 원)" size="sm" headingLevel={4}>
                    <Chart
                        type="bar"
                        title="7월~11월 월별 매출과 이익"
                        data={SALES_ROWS}
                        xKey="month"
                        size="sm"
                        series={[
                            { dataKey: 'revenue', name: '매출', color: 'green' },
                            { dataKey: 'profit', name: '이익', color: 'blue' }
                        ]}
                    />
                </Card>
                <Table type="result" caption="이번 분기 매출 요약" items={SALES_SUMMARY} />
            </Stack>
        ),
        orders: <Table caption="최근 주문 내역: 주문번호, 상품, 주문일, 금액, 상태" columns={ORDER_COLUMNS} rows={ORDER_ROWS} getRowKey={(row) => row.id} />,
        weather: (
            <Grid columns={3} gap="sm">
                {WEATHER_DAYS.map((day) => (
                    <Card key={day.id} title={day.day} description={day.summary} size="sm" headingLevel={4}>
                        <Stack gap="sm">
                            <p className="chatTemp">
                                {day.high}° <span>/ {day.low}°</span>
                            </p>
                            <Progress label="강수 확률" value={day.rain} />
                        </Stack>
                    </Card>
                ))}
            </Grid>
        ),
        schedule: <ScheduleAnswer />,
        products: (
            <Slider
                label="추천 노트북"
                items={PRODUCT_ITEMS}
                options={{ navigation: true, pagination: { clickable: true }, breakpoints: { 768: { slidesPerView: 2 } } }}
                renderItem={(item) => (
                    <Card title={item.name} description={item.spec} size="sm" headingLevel={4} action={<Chip label={item.tag} color={item.tagColor} />}>
                        <p className="chatPrice">{item.price}</p>
                    </Card>
                )}
            />
        ),
        team: <TeamAnswer />,
        notice: (
            <Stack gap="sm">
                <Alert title="12월 1일부터 반품 접수 방법이 바뀝니다.">마이페이지 &gt; 주문 내역에서 바로 신청할 수 있습니다.</Alert>
                <Accordion items={NOTICE_FAQ} defaultOpenIds={['refund']} />
            </Stack>
        ),
        progress: (
            <Card title="프로젝트 진행률" size="sm" headingLevel={4}>
                <Stack gap="md">
                    {PROGRESS_ITEMS.map((item) => (
                        <Progress key={item.id} label={`${item.name} (마감 ${item.due})`} value={item.value} />
                    ))}
                </Stack>
            </Card>
        ),
        fallback: <SuggestionButtons onAsk={onAsk} />
    };
    return <>{answers[kind]}</>;
};

const Chat = () => {
    const [messages, setMessages] = useState<ChatMessage[]>(() => [{ id: 0, role: 'bot', text: WELCOME_TEXT, hasSuggestions: true, time: getTime() }]);
    const [question, setQuestion] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const nextIdRef = useRef(1);
    const timerRef = useRef<number | undefined>(undefined);
    const logRef = useRef<HTMLDivElement>(null);

    // 새 메시지가 오면 대화 기록 맨 아래로 스크롤
    useEffect(() => {
        logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages, isTyping]);

    // 화면을 떠나면 답변 대기 타이머 정리
    useEffect(() => () => window.clearTimeout(timerRef.current), []);

    const handleAsk = (text: string) => {
        const trimmed = text.trim();
        if (!trimmed || isTyping) return;
        const kind = findAnswerKind(trimmed);
        setMessages((prev) => [...prev, { id: nextIdRef.current++, role: 'user', text: trimmed, time: getTime() }]);
        setQuestion('');
        setIsTyping(true);
        timerRef.current = window.setTimeout(() => {
            setMessages((prev) => [...prev, { id: nextIdRef.current++, role: 'bot', text: getAnswerIntro(kind), kind, time: getTime() }]);
            setIsTyping(false);
        }, BOT_DELAY);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        handleAsk(question);
    };

    const handleReset = () => {
        window.clearTimeout(timerRef.current);
        setIsTyping(false);
        setMessages([{ id: nextIdRef.current++, role: 'bot', text: WELCOME_TEXT, hasSuggestions: true, time: getTime() }]);
    };

    return (
        <div className="chat">
            <Section
                headingLevel={2}
                title="챗봇 샘플"
                description="질문에 맞춰 차트·표·카드로 답하는 대화 화면입니다. (목업 데이터)"
                action={
                    <Button size="sm" shape="square" onClick={handleReset}>
                        대화 초기화
                    </Button>
                }
                gap="lg"
            >
                <Card padding="sm">
                    <div className="chatLog" ref={logRef} role="log" aria-label="대화 기록" aria-live="polite" tabIndex={0}>
                        {messages.map((message) => (
                            <div key={message.id} className={`chatMessage ${message.role}`}>
                                {message.role === 'bot' && <Avatar name="AI" size="sm" />}
                                <div className="chatBody">
                                    {/* 답변 문장과 차트·표·카드를 한 말풍선 안에 둠 */}
                                    <div className={message.kind || message.hasSuggestions ? 'chatBubble hasRich' : 'chatBubble'}>
                                        <p className="chatText">
                                            <span className="srOnly">{message.role === 'bot' ? '챗봇: ' : '나: '}</span>
                                            {message.text}
                                        </p>
                                        {message.kind && (
                                            <div className="chatRich">
                                                <BotAnswer kind={message.kind} onAsk={handleAsk} />
                                            </div>
                                        )}
                                        {message.hasSuggestions && (
                                            <div className="chatRich">
                                                <SuggestionButtons onAsk={handleAsk} />
                                            </div>
                                        )}
                                    </div>
                                    <span className="chatTime">{message.time}</span>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="chatMessage bot">
                                <Avatar name="AI" size="sm" />
                                <div className="chatBubble">
                                    <p className="chatText chatTyping">답변을 준비하고 있어요…</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <form className="chatForm" onSubmit={handleSubmit}>
                        <div className="chatInput">
                            <Input label="질문 입력" value={question} onChange={setQuestion} placeholder="예: 이번 분기 매출 알려줘" autoComplete="off" />
                        </div>
                        <Button type="submit" size="md" shape="square" disabled={!question.trim() || isTyping}>
                            보내기
                        </Button>
                    </form>
                </Card>
            </Section>
        </div>
    );
};

export default Chat;

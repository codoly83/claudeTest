import type { ChipColor } from '../types';

// 챗봇 샘플(/chat) 목업 데이터 — docs/requirements.md 4장
// 질문 글자에 들어 있는 키워드로 답변 종류를 고르고, 종류마다 다른 공통 컴포넌트(Chart·Table·Card·Slider 등)로 보여 줍니다.
// 실제 AI·서버 연동은 없습니다.

export type ChatAnswerKind = 'sales' | 'orders' | 'weather' | 'schedule' | 'products' | 'team' | 'notice' | 'progress' | 'fallback';

interface ChatAnswerRule {
    kind: Exclude<ChatAnswerKind, 'fallback'>;
    label: string;                 // 추천 질문 버튼 묶음 이름
    keywords: string[];
    sampleQuestion: string;        // 추천 질문
    intro: string;                 // 답변 첫 문장
}

export const CHAT_ANSWER_RULES: ChatAnswerRule[] = [
    { kind: 'sales', label: '매출', keywords: ['매출', '실적', '수익', 'sales'], sampleQuestion: '이번 분기 매출 알려줘', intro: '최근 5개월 매출 추이와 이번 분기 요약입니다.' },
    { kind: 'orders', label: '주문', keywords: ['주문', '배송', '택배', 'order'], sampleQuestion: '최근 주문 내역 보여줘', intro: '최근 주문 4건의 처리 상태입니다.' },
    { kind: 'weather', label: '날씨', keywords: ['날씨', '기온', '우산', '예보', 'weather'], sampleQuestion: '이번 주 날씨 어때?', intro: '서울 기준 3일 예보입니다.' },
    { kind: 'schedule', label: '일정', keywords: ['일정', '회의', '미팅', '약속', 'schedule'], sampleQuestion: '오늘 일정 정리해줘', intro: '오늘(11월 25일) 일정 4건입니다.' },
    { kind: 'products', label: '추천', keywords: ['추천', '상품', '제품', '구매', 'product'], sampleQuestion: '노트북 추천해줘', intro: '조건에 맞는 노트북 4개를 골랐습니다. 옆으로 넘겨 보세요.' },
    { kind: 'team', label: '담당자', keywords: ['담당자', '팀원', '직원', '연락처', '누구', 'team'], sampleQuestion: '프로젝트 담당자 알려줘', intro: '웹사이트 개편 프로젝트 담당자 4명입니다.' },
    { kind: 'notice', label: '공지', keywords: ['공지', '도움', '문의', '환불', '자주', 'faq'], sampleQuestion: '환불 규정이 궁금해', intro: '관련 공지와 자주 묻는 질문입니다.' },
    { kind: 'progress', label: '진행률', keywords: ['진행', '프로젝트', '현황', '작업', 'progress'], sampleQuestion: '프로젝트 진행 현황 알려줘', intro: '진행 중인 프로젝트 3개의 진행률입니다.' }
];

export const FALLBACK_INTRO = '질문을 이해하지 못했어요. 아래 추천 질문을 눌러 보거나 매출·주문·날씨·일정·추천·담당자·공지·진행률 중 하나를 넣어 물어봐 주세요.';

export const WELCOME_TEXT = '안녕하세요! 궁금한 것을 물어보세요. 답변 종류에 따라 차트·표·카드로 보여 드립니다.';

// 질문 → 답변 종류 (먼저 맞는 키워드 우선)
export const findAnswerKind = (question: string): ChatAnswerKind => {
    const text = question.toLowerCase();
    return CHAT_ANSWER_RULES.find((rule) => rule.keywords.some((keyword) => text.includes(keyword)))?.kind ?? 'fallback';
};

export const getAnswerIntro = (kind: ChatAnswerKind) => CHAT_ANSWER_RULES.find((rule) => rule.kind === kind)?.intro ?? FALLBACK_INTRO;

// ---- 답변별 데이터 ----

export interface SalesRow extends Record<string, string | number> {
    month: string;
    revenue: number;
    profit: number;
}

export const SALES_ROWS: SalesRow[] = [
    { month: '7월', revenue: 1200, profit: 210 },
    { month: '8월', revenue: 1380, profit: 260 },
    { month: '9월', revenue: 1290, profit: 230 },
    { month: '10월', revenue: 1640, profit: 330 },
    { month: '11월', revenue: 1820, profit: 395 }
];

export const SALES_SUMMARY = [
    { key: 'total', label: '분기 매출', value: '4,750만 원' },
    { key: 'growth', label: '전 분기 대비', value: '+18.2%' },
    { key: 'best', label: '최고 매출 월', value: '11월' }
];

export interface OrderRow {
    id: string;
    product: string;
    date: string;
    amount: string;
    status: string;
    statusColor: ChipColor;
}

export const ORDER_ROWS: OrderRow[] = [
    { id: 'A-1042', product: '무선 키보드', date: '11.24', amount: '59,000원', status: '배송중', statusColor: 'blue' },
    { id: 'A-1039', product: '27인치 모니터', date: '11.22', amount: '329,000원', status: '배송완료', statusColor: 'green' },
    { id: 'A-1031', product: 'USB-C 허브', date: '11.20', amount: '45,000원', status: '취소', statusColor: 'red' },
    { id: 'A-1028', product: '노트북 거치대', date: '11.18', amount: '32,000원', status: '준비중', statusColor: 'yellow' }
];

export interface WeatherDay {
    id: string;
    day: string;
    summary: string;
    high: number;
    low: number;
    rain: number;
}

export const WEATHER_DAYS: WeatherDay[] = [
    { id: 'wed', day: '수 (오늘)', summary: '맑음', high: 9, low: 1, rain: 10 },
    { id: 'thu', day: '목', summary: '구름 많음', high: 7, low: 0, rain: 30 },
    { id: 'fri', day: '금', summary: '비', high: 6, low: 2, rain: 80 }
];

export const SCHEDULE_ITEMS = ['09:30 주간 회의 (3층 회의실)', '11:00 디자인 시안 검토', '14:00 고객사 미팅 (온라인)', '17:30 배포 점검'];

export interface ProductItem {
    id: string;
    name: string;
    spec: string;
    price: string;
    tag: string;
    tagColor: ChipColor;
}

export const PRODUCT_ITEMS: ProductItem[] = [
    { id: 'p1', name: '라이트북 14', spec: '14형 · 1.2kg · 16GB', price: '1,290,000원', tag: '가성비', tagColor: 'green' },
    { id: 'p2', name: '프로북 16', spec: '16형 · 2.1kg · 32GB', price: '2,490,000원', tag: '고성능', tagColor: 'purple' },
    { id: 'p3', name: '에어노트 13', spec: '13형 · 0.9kg · 8GB', price: '990,000원', tag: '휴대성', tagColor: 'blue' },
    { id: 'p4', name: '스튜디오 15', spec: '15형 · 1.6kg · 32GB', price: '1,890,000원', tag: '디자인', tagColor: 'yellow' }
];

export const NOTICE_FAQ = [
    { id: 'refund', title: '환불은 언제까지 가능한가요?', content: '수령 후 7일 이내, 사용하지 않은 상품은 전액 환불됩니다.' },
    { id: 'fee', title: '반품 배송비는 누가 내나요?', content: '단순 변심은 고객 부담(왕복 6,000원), 불량은 판매자가 부담합니다.' },
    { id: 'period', title: '환불 금액은 언제 들어오나요?', content: '반품 확인 후 영업일 기준 3일 안에 결제 수단으로 환불됩니다.' }
];

export const PROGRESS_ITEMS = [
    { id: 'web', name: '웹사이트 개편', value: 82, due: '12월 5일' },
    { id: 'app', name: '모바일 앱 2.0', value: 45, due: '12월 20일' },
    { id: 'admin', name: '관리자 화면', value: 15, due: '1월 10일' }
];

export interface TeamMember {
    id: string;
    name: string;
    team: string;
    role: string;
    email: string;
    phone: string;
    duty: string;
    status: string;
    statusColor: ChipColor;
}

export const TEAM_MEMBERS: TeamMember[] = [
    { id: 'kim', name: '김하늘', team: '기획팀', role: 'PM', email: 'sky.kim@example.com', phone: '1024', duty: '일정·요구사항 관리', status: '근무중', statusColor: 'green' },
    { id: 'lee', name: '이서준', team: '디자인팀', role: 'UI 디자이너', email: 'seojun.lee@example.com', phone: '1031', duty: '화면 시안·디자인 시스템', status: '회의중', statusColor: 'yellow' },
    { id: 'park', name: '박지민', team: '개발팀', role: '퍼블리셔', email: 'jimin.park@example.com', phone: '1047', duty: '마크업·공통 컴포넌트', status: '근무중', statusColor: 'green' },
    { id: 'choi', name: '최유나', team: '개발팀', role: '프론트엔드', email: 'yuna.choi@example.com', phone: '1052', duty: 'API 연동·배포', status: '휴가', statusColor: 'gray' }
];

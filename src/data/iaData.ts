import type { Cell, HeaderCell, IaTable, TaskKey } from '../types';

// IA 관리 화면 데이터 (docs/ia-spec.md)
// - 화면 목록은 docs/requirements.md 페이지 목록과 실제 React Router 경로 기준입니다.
// - Task 상태는 docs/tasks.md 완료 기록 기준이며, 페이지를 추가·수정하면 이 파일도 함께 갱신합니다.

export const TASKS: { key: TaskKey; name: string }[] = [
    { key: '0', name: 'Undone' },
    { key: '1', name: 'Done' },
    { key: '2', name: 'Modify' },
    { key: '3', name: 'Delete' }
];

// 프로젝트마다 바꾸는 값: title(h1 <em> 문구), worksheet(작업 영역 제목)
// notice 문구는 원본 그대로 유지합니다.
export const IA_INFO = {
    title: '프로젝트 이름',
    worksheet: 'Worksheet: Web',
    notice: 'Undone: 코딩중, Done: 코딩완료, Modify: 코딩 완료 후 HTML수정, Delete: 코딩 완료 후 SB삭제'
};

// 메뉴 깊이 열 개수 (원본 기본값: 5~6. 프로젝트 메뉴 깊이에 맞게 조정)
const DEPTH_COUNT = 2;

const createHeaders = (depthCount: number): HeaderCell[] => [
    ...Array.from({ length: depthCount }, (_, index) => ({ className: 'menuDepth', text: `Depth${index + 1}` })),
    { className: 'fileName', text: 'File Name/ID' },
    { className: 'dueDate', text: 'Done/Modify' },
    { className: 'people', text: 'People' },
    { className: 'issueMemo', text: 'Issue/Memo' },
    { className: 'checkTask', text: 'Task' }
];

interface RowOption {
    date?: string;
    people?: string;
    memo?: string;
    task?: TaskKey;
}

// depths: 메뉴 깊이별 이름 (상위 메뉴와 같은 행이 아니면 빈 문자열)
// fileName: 실제 React Router 경로 (IA에서 새 창 열기·미리보기 링크로 사용)
// task 기본값은 '0'(Undone). 검증된 페이지만 '1'(Done)로 바꿉니다.
const createRow = (depths: string[], fileName: string, option: RowOption = {}): Cell[] => {
    const { date = '', people = '', memo = '', task = '0' } = option;
    return [
        ...Array.from({ length: DEPTH_COUNT }, (_, index) => ({ className: 'menuDepth', text: depths[index] ?? '' })),
        { className: 'fileName', text: fileName },
        { className: 'date', text: date },
        { className: 'people', text: people },
        { className: 'issueMemo', text: memo },
        { className: 'checkTask', text: task }
    ];
};

// 메뉴(테이블)마다 id는 menuIdx1부터 순서대로 부여합니다.
// 메인(/)은 필수 고정 항목이며 항상 첫 번째(menuIdx1)에 둡니다. (docs/ia-spec.md, 2026-11-25 /Guide 폐지로 변경)
// 일반 페이지는 Phase 4에서 페이지를 만들 때 같은 작업에서 추가합니다.
export const IA_TABLES: IaTable[] = [
    {
        id: 'menuIdx1',
        title: '홈',
        path: '',
        headers: createHeaders(DEPTH_COUNT),
        rows: [createRow(['페이지 목록'], '/', { date: '2026-11-25', memo: 'IA 데이터 기반 페이지 목록 표 + 컴포넌트 목록 42종 (명세 화면 링크)', task: '1' })]
    },
    {
        id: 'menuIdx2',
        title: '명세',
        path: '',
        headers: createHeaders(DEPTH_COUNT),
        rows: [createRow(['명세 문서 보기'], '/spec/base', { memo: '/spec/:slug 동적 경로 (기본설정·Layout·페이지 기능·Hooks·컴포넌트 명세, docs/*.md 표시)', date: '2026-11-24', task: '1' })]
    },
    {
        id: 'menuIdx3',
        title: '샘플 페이지',
        path: '',
        headers: createHeaders(DEPTH_COUNT),
        rows: [
            createRow(['샘플 페이지', '대시보드'], '/dashboard', { date: '2026-11-24', memo: 'Button·Card·Chip·Table 사용, 목업 데이터', task: '1' }),
            createRow(['', '회원가입'], '/signup', { date: '2026-11-24', memo: '회원 레이아웃, Card·Input·Checkbox·Button, 입력값 검사 목업', task: '1' }),
            createRow(['', '지급 기준 설정'], '/payout', { date: '2026-11-25', memo: '현재 기준 Card(상세형 Table) + 설정 Modal(Select·RangeSlider·Textarea), 저장 시 Toast 목업', task: '1' }),
            createRow(['', '챗봇'], '/chat', { date: '2026-11-25', memo: '질문 키워드별 답변 8종(Chart·Table·카드형·Slider·Accordion·Progress 등) 말풍선 목업 (확인 대기)', task: '0' })
        ]
    }
];

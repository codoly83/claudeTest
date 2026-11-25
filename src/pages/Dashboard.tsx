import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Chip from '../components/common/Chip';
import Grid from '../components/common/Grid';
import Section from '../components/common/Section';
import Stack from '../components/common/Stack';
import Table from '../components/common/Table';
import type { ChipColor, TableColumn } from '../types';

// 대시보드 샘플 (/dashboard) — 참고 사이트 /publish/dashboard/dashboard 형식 (docs/requirements.md 4장)
// 배치 규칙(docs/component-ssot.md 2.3): 페이지 Section(h2) → Stack → Grid(통계 Card) + Card(목록형 Table)
// 목업 데이터는 이 화면에서만 사용합니다.

interface StatItem {
    id: string;
    label: string;
    value: string;
    change: string;
    color: ChipColor;
}

interface TaskRow {
    id: string;
    task: string;
    owner: string;
    status: string;
    statusColor: ChipColor;
}

const STATS: StatItem[] = [
    { id: 'visitors', label: '오늘 방문자', value: '2,431', change: '+12.4%', color: 'green' },
    { id: 'signups', label: '신규 가입', value: '128', change: '+4.2%', color: 'blue' },
    { id: 'projects', label: '활성 프로젝트', value: '37', change: '-1.1%', color: 'yellow' },
    { id: 'errors', label: '오류 건수', value: '3', change: '-62.5%', color: 'purple' }
];

const TASKS: TaskRow[] = [
    { id: 'banner', task: '배너 문구 수정', owner: '디자인팀', status: '완료', statusColor: 'green' },
    { id: 'api', task: '회원 통계 API 점검', owner: '개발팀', status: '진행중', statusColor: 'blue' },
    { id: 'notice', task: '공지사항 등록', owner: '운영팀', status: '대기', statusColor: 'gray' }
];

const TASK_COLUMNS: TableColumn<TaskRow>[] = [
    { key: 'task', header: '업무' },
    { key: 'owner', header: '담당' },
    { key: 'status', header: '상태', render: (row) => <Chip label={row.status} color={row.statusColor} /> }
];

const Dashboard = () => {
    return (
        <div className="dashboard">
            <Section
                headingLevel={2}
                title="Dashboard"
                description="운영 현황을 한눈에 볼 수 있는 샘플 대시보드입니다."
                // 퍼블리싱 목업: 실제 다운로드 기능은 개발 단계에서 연결
                action={<Button size="sm">리포트 다운로드</Button>}
                gap="lg"
            >
                <Stack gap="md">
                    <Grid columns={4}>
                        {STATS.map((stat) => (
                            <Card key={stat.id} title={stat.label} size="sm">
                                <Stack gap="sm" align="start">
                                    <p className="statValue">{stat.value}</p>
                                    <Chip label={stat.change} color={stat.color} />
                                </Stack>
                            </Card>
                        ))}
                    </Grid>

                    <Card title="최근 작업 현황">
                        <Table caption="최근 작업 현황: 업무, 담당, 상태" columns={TASK_COLUMNS} rows={TASKS} getRowKey={(row) => row.id} />
                    </Card>
                </Stack>
            </Section>
        </div>
    );
};

export default Dashboard;

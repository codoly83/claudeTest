import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Checkbox from '../components/common/Checkbox';
import Input from '../components/common/Input';
import Section from '../components/common/Section';
import Select from '../components/common/Select';
import Stack from '../components/common/Stack';
import Table from '../components/common/Table';
import Tabs from '../components/common/Tabs';
import { getSpecItem, resolveSpecLink } from '../data/specData';
import { useToast } from '../hooks/useToast';
import type { ApiRow, ComponentStory, ControlValue, ControlValues, PlaygroundControl, StoryPlayground, TableColumn } from '../types';
import { renderMarkdown } from '../utils/renderMarkdown';
import { getDefaultValues } from '../utils/storyCode';

// 명세 문서 보기 (/spec/:slug) — docs/requirements.md 4장
// - docs/ 마크다운을 그대로 그립니다. 내용 수정은 문서(docs/component-ssot.md, docs/components/*.md)에서 합니다.
// - 구현된 공통 컴포넌트는 스토리북처럼 탭으로 봅니다: 문서(SSOT) · 샘플 · Playground · API
//   샘플·Playground·API는 src/data/componentStories.ts에서 읽습니다. (2026-11-25 /Guide 폐지 — 컴포넌트 설명·검수는 이 화면)

interface PlaygroundViewProps {
    playground: StoryPlayground;
}

interface ControlFieldProps {
    control: PlaygroundControl;
    value: ControlValue;
    onChange: (value: ControlValue) => void;
}

interface CodeBlockProps {
    code: string;
}

const API_COLUMNS: TableColumn<ApiRow>[] = [
    { key: 'name', header: '이름', render: (row) => <code className="storyInlineCode">{row.name}</code> },
    { key: 'type', header: '타입', render: (row) => <code className="storyInlineCode">{row.type}</code> },
    { key: 'defaultValue', header: '기본값', align: 'center' },
    { key: 'desc', header: '설명' }
];

// 콜백 Props(onXxx)는 이벤트 표로 나눔
const isEventRow = (row: ApiRow) => /(^|\.)on[A-Z]/.test(row.name);

const CodeBlock = ({ code }: CodeBlockProps) => {
    const { showToast } = useToast();
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            showToast('코드를 복사했습니다.', { type: 'success' });
        } catch {
            showToast('복사하지 못했습니다. 코드를 직접 선택해 복사하세요.', { type: 'error' });
        }
    };
    return (
        <Stack gap="sm">
            <Stack direction="row" justify="end">
                <Button size="sm" shape="square" onClick={handleCopy}>
                    코드 복사
                </Button>
            </Stack>
            <pre className="storyCode">
                <code>{code}</code>
            </pre>
        </Stack>
    );
};

const ControlField = ({ control, value, onChange }: ControlFieldProps) => {
    if (control.type === 'boolean') return <Checkbox label={control.name} checked={value === true} onChange={onChange} />;
    if (control.type === 'select') {
        return <Select label={control.name} size="sm" options={(control.options ?? []).map((option) => ({ value: option, label: option }))} value={String(value)} onChange={onChange} />;
    }
    if (control.type === 'number') {
        return <Input label={control.name} type="number" min={control.min} max={control.max} value={String(value)} onChange={(next) => onChange(Number(next))} />;
    }
    return <Input label={control.name} value={String(value)} onChange={onChange} />;
};

// Playground: 왼쪽 미리보기 + 오른쪽 Controls, 아래 현재 값으로 만든 코드
const PlaygroundView = ({ playground }: PlaygroundViewProps) => {
    const [values, setValues] = useState<ControlValues>(() => getDefaultValues(playground.controls));
    const handleChange = (name: string) => (value: ControlValue) => setValues((prev) => ({ ...prev, [name]: value }));
    const handleReset = () => setValues(getDefaultValues(playground.controls));

    return (
        <Stack gap="md">
            <div className="storyPlayground">
                {/* 값이 바뀌면 다시 그려 내부 상태(열림 등)를 초기화 */}
                <div className="storyCanvas" key={JSON.stringify(values)}>
                    {playground.render(values)}
                </div>
                <Card title="Controls" size="sm" headingLevel={4} action={<Button size="sm" shape="square" onClick={handleReset}>초기화</Button>}>
                    <Stack gap="md">
                        {playground.controls.map((control) => (
                            <ControlField key={control.name} control={control} value={values[control.name]} onChange={handleChange(control.name)} />
                        ))}
                    </Stack>
                </Card>
            </div>
            <CodeBlock code={playground.code(values, playground.controls)} />
        </Stack>
    );
};

// 샘플·API 탭 내용 (훅 없음)
const buildStoryPanels = (story: ComponentStory) => {
    const props = story.api.filter((row) => !isEventRow(row));
    const events = story.api.filter(isEventRow);

    const samples = (
        <Stack gap="lg">
            {story.samples.map((sample) => (
                <Section key={sample.title} title={sample.title} description={sample.desc} gap="sm">
                    <Stack gap="sm">
                        <div className="storyCanvas">{sample.preview}</div>
                        <CodeBlock code={sample.code} />
                    </Stack>
                </Section>
            ))}
        </Stack>
    );

    const api = (
        <Stack gap="lg">
            <p className="storyNotice">{story.summary}</p>
            <Section title="Props" description={`${story.path}`} gap="sm">
                <Table caption={`${story.name} Props: 이름, 타입, 기본값, 설명`} columns={API_COLUMNS} rows={props} getRowKey={(row) => row.name} />
            </Section>
            {events.length > 0 && (
                <Section title="이벤트 (콜백 Props)" gap="sm">
                    <Table caption={`${story.name} 이벤트: 이름, 타입, 기본값, 설명`} columns={API_COLUMNS} rows={events} getRowKey={(row) => row.name} />
                </Section>
            )}
        </Stack>
    );

    return { samples, api };
};

const Spec = () => {
    const { slug = '' } = useParams();
    const item = getSpecItem(slug);
    const content = useMemo(() => (item ? renderMarkdown(item.markdown, resolveSpecLink) : null), [item]);
    const [stories, setStories] = useState<ComponentStory[] | null>(null);
    const storyName = item?.storyName;

    // 스토리(샘플·라이브러리 포함)는 구현된 컴포넌트 화면에 처음 들어올 때 따로 불러옵니다 (첫 화면 용량 줄이기)
    useEffect(() => {
        if (!storyName || stories) return;
        let isActive = true;
        import('../data/componentStories').then((module) => {
            if (isActive) setStories(module.COMPONENT_STORIES);
        });
        return () => {
            isActive = false;
        };
    }, [storyName, stories]);

    const story = storyName ? stories?.find((candidate) => candidate.name === storyName) : undefined;

    if (!item) {
        return (
            <article className="specPage">
                <h2 className="specTitle">문서를 찾을 수 없습니다.</h2>
                <p>
                    <Link to="/">페이지 목록으로 이동</Link>
                </p>
            </article>
        );
    }

    const doc = <div className="mdContent">{content}</div>;
    const view = story ? buildStoryPanels(story) : null;

    return (
        <article className="specPage">
            <header className="specHead">
                <span className="specGroup">{item.groupTitle}</span>
                <h2 className="specTitle">{item.label}</h2>
                <p className="specPath">{item.docPath}</p>
            </header>
            {storyName && !story && <p className="storyNotice">샘플 · Playground · API 탭을 불러오는 중입니다…</p>}
            {story && view ? (
                <Tabs
                    // 다른 컴포넌트로 이동하면 첫 탭(문서)부터 다시 보기
                    key={slug}
                    label={`${story.name} 보기`}
                    appearance="line"
                    items={[
                        { id: 'doc', label: '문서 (SSOT)', content: <div className="storyPanel">{doc}</div> },
                        { id: 'samples', label: `샘플 ${story.samples.length}`, content: <div className="storyPanel">{view.samples}</div> },
                        {
                            id: 'playground',
                            label: 'Playground',
                            content: <div className="storyPanel">{story.playground ? <PlaygroundView playground={story.playground} /> : <p className="storyNotice">화면에 직접 쓰지 않는 내부 유틸이라 Playground가 없습니다.</p>}</div>
                        },
                        { id: 'api', label: 'API', content: <div className="storyPanel">{view.api}</div> }
                    ]}
                />
            ) : (
                doc
            )}
        </article>
    );
};

export default Spec;

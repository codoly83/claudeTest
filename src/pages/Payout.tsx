import { useState } from 'react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import RangeSlider from '../components/common/RangeSlider';
import Section from '../components/common/Section';
import Select from '../components/common/Select';
import Stack from '../components/common/Stack';
import Table from '../components/common/Table';
import Textarea from '../components/common/Textarea';
import { useToast } from '../hooks/useToast';
import type { TableResultItem } from '../types';

// 지급 기준 설정 샘플 (/payout) — docs/requirements.md 4장
// 배치 규칙(docs/component-ssot.md 2.3): 페이지 Section(h2) → Card(상세형 Table), 모달 폼은 Stack
// 페이지에 현재 지급 기준을 보여 주고, '기준 변경' 버튼으로 설정 모달(Modal)을 엽니다.
// 저장하면 토스트를 띄우고 모달을 닫습니다. (목업: 실제 전송 없음)

interface PayoutSetting {
    currency: string;
    amount: number;
    notes: string;
}

const MIN_AMOUNT = 50;
const MAX_AMOUNT = 10000;
const AMOUNT_STEP = 50;
const NOTES_MAX_LENGTH = 200;

const CURRENCY_OPTIONS = [
    { value: 'USD', label: 'USD — 미국 달러' },
    { value: 'KRW', label: 'KRW — 대한민국 원' },
    { value: 'EUR', label: 'EUR — 유로' },
    { value: 'JPY', label: 'JPY — 일본 엔' }
];

const INITIAL_SETTING: PayoutSetting = { currency: 'USD', amount: 2500, notes: '' };

// 통화 기호·자릿수 표시: formatAmount('USD', 2500) → '$2,500.00'
const formatAmount = (currency: string, amount: number, hasFraction = true) =>
    new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency,
        currencyDisplay: 'narrowSymbol',
        minimumFractionDigits: hasFraction && currency !== 'KRW' && currency !== 'JPY' ? 2 : 0,
        maximumFractionDigits: hasFraction && currency !== 'KRW' && currency !== 'JPY' ? 2 : 0
    }).format(amount);

const getCurrencyLabel = (currency: string) => CURRENCY_OPTIONS.find((option) => option.value === currency)?.label ?? currency;

const Payout = () => {
    const { showToast } = useToast();
    const [setting, setSetting] = useState<PayoutSetting>(INITIAL_SETTING);
    const [draft, setDraft] = useState<PayoutSetting>(INITIAL_SETTING);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 모달을 열 때 저장된 값으로 입력값을 채웁니다 (닫으면 바꾼 내용은 버림)
    const handleOpen = () => {
        setDraft(setting);
        setIsModalOpen(true);
    };

    const handleClose = () => setIsModalOpen(false);

    const handleChangeDraft = <K extends keyof PayoutSetting>(key: K) => (value: PayoutSetting[K]) => {
        setDraft((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        setSetting(draft);
        setIsModalOpen(false);
        showToast('지급 기준이 저장되었습니다.', { type: 'success' });
    };

    // 현재 설정 요약: 한 건의 항목:값이므로 상세형 표 (Table type="result")
    const summaryItems: TableResultItem[] = [
        { key: 'currency', label: '선호 통화', value: getCurrencyLabel(setting.currency) },
        { key: 'amount', label: '최소 지급 금액', value: <strong className="payoutSummaryAmount">{formatAmount(setting.currency, setting.amount)}</strong> },
        { key: 'notes', label: '메모', value: setting.notes }
    ];

    return (
        <div className="payout">
            <Section headingLevel={2} title="지급 설정" description="잔액이 기준 금액 이상이 되면 자동으로 지급됩니다." gap="lg">
                <Card
                    title="현재 지급 기준"
                    action={
                        <Button size="sm" shape="square" onClick={handleOpen}>
                            기준 변경
                        </Button>
                    }
                >
                    <Table type="result" caption="현재 지급 기준: 선호 통화, 최소 지급 금액, 메모" items={summaryItems} />
                </Card>
            </Section>

            <Modal
                isOpen={isModalOpen}
                onClose={handleClose}
                size="small"
                title="지급 기준 금액"
                footer={
                    <div className="payoutSave">
                        <Button size="md" shape="square" onClick={handleSave}>
                            기준 저장
                        </Button>
                    </div>
                }
            >
                {/* 폼 필드 사이 md, 금액 묶음 안 sm (docs/component-ssot.md 2.3.2) */}
                <Stack gap="md">
                    <p className="payoutFormDesc">지급이 시작되는 최소 잔액을 설정하세요.</p>
                    <Select label="선호 통화" options={CURRENCY_OPTIONS} value={draft.currency} onChange={handleChangeDraft('currency')} />
                    <Stack gap="sm">
                        <Stack direction="row" gap="sm" justify="between" align="center" isWrap>
                            <span className="payoutAmountLabel">최소 지급 금액</span>
                            <strong className="payoutAmountValue" aria-live="polite">
                                {formatAmount(draft.currency, draft.amount)}
                            </strong>
                        </Stack>
                        <RangeSlider
                            label="최소 지급 금액"
                            value={[draft.amount]}
                            onChange={(value) => handleChangeDraft('amount')(value[0])}
                            min={MIN_AMOUNT}
                            max={MAX_AMOUNT}
                            step={AMOUNT_STEP}
                        />
                        <Stack direction="row" gap="sm" justify="between">
                            <span className="payoutAmountRange" aria-hidden="true">
                                {formatAmount(draft.currency, MIN_AMOUNT, false)} (최소)
                            </span>
                            <span className="payoutAmountRange" aria-hidden="true">
                                {formatAmount(draft.currency, MAX_AMOUNT, false)} (최대)
                            </span>
                        </Stack>
                    </Stack>
                    <Textarea
                        label="메모"
                        value={draft.notes}
                        onChange={handleChangeDraft('notes')}
                        placeholder="이 지급 설정에 대한 메모를 입력하세요."
                        rows={4}
                        maxLength={NOTES_MAX_LENGTH}
                    />
                </Stack>
            </Modal>
        </div>
    );
};

export default Payout;

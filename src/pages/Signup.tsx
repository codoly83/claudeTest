import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Checkbox from '../components/common/Checkbox';
import Button from '../components/common/Button';

// 회원가입 샘플 (/signup, 회원 레이아웃) — docs/requirements.md 4장
// 퍼블리싱 목업: 입력값 검사·오류 안내까지만 하고 실제 전송은 하지 않습니다.

interface SignupForm {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
    phone: string;
}

interface Agreements {
    terms: boolean;
    privacy: boolean;
    marketing: boolean;
}

type FieldName = keyof SignupForm | 'terms' | 'privacy';
type FormErrors = Partial<Record<FieldName, string>>;

const INITIAL_FORM: SignupForm = { name: '', email: '', password: '', passwordConfirm: '', phone: '' };
const INITIAL_AGREEMENTS: Agreements = { terms: false, privacy: false, marketing: false };

// 오류를 보여 줄 순서 (첫 오류 칸으로 포커스 이동)
const FIELD_ORDER: FieldName[] = ['name', 'email', 'password', 'passwordConfirm', 'phone', 'terms', 'privacy'];

const AGREEMENT_ITEMS: { key: keyof Agreements; label: string }[] = [
    { key: 'terms', label: '[필수] 이용약관 동의' },
    { key: 'privacy', label: '[필수] 개인정보 수집·이용 동의' },
    { key: 'marketing', label: '[선택] 마케팅 정보 수신 동의' }
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
const PHONE_PATTERN = /^01[016789]-?\d{3,4}-?\d{4}$/;

const validate = (form: SignupForm, agreements: Agreements): FormErrors => {
    const errors: FormErrors = {};
    if (!form.name.trim()) errors.name = '이름을 입력하세요.';
    if (!form.email.trim()) errors.email = '이메일을 입력하세요.';
    else if (!EMAIL_PATTERN.test(form.email.trim())) errors.email = '이메일 형식이 올바르지 않습니다. 예: name@example.com';
    if (!form.password) errors.password = '비밀번호를 입력하세요.';
    else if (!PASSWORD_PATTERN.test(form.password)) errors.password = '영문과 숫자를 포함해 8자 이상 입력하세요.';
    if (!form.passwordConfirm) errors.passwordConfirm = '비밀번호를 한 번 더 입력하세요.';
    else if (form.passwordConfirm !== form.password) errors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    if (!form.phone.trim()) errors.phone = '휴대폰 번호를 입력하세요.';
    else if (!PHONE_PATTERN.test(form.phone.trim())) errors.phone = '휴대폰 번호 형식이 올바르지 않습니다. 예: 010-1234-5678';
    if (!agreements.terms) errors.terms = '이용약관에 동의해야 가입할 수 있습니다.';
    if (!agreements.privacy) errors.privacy = '개인정보 수집·이용에 동의해야 가입할 수 있습니다.';
    return errors;
};

const Signup = () => {
    const navigate = useNavigate();
    const formRef = useRef<HTMLFormElement>(null);
    const [form, setForm] = useState<SignupForm>(INITIAL_FORM);
    const [agreements, setAgreements] = useState<Agreements>(INITIAL_AGREEMENTS);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    // 제출을 한 번 시도한 뒤에는 입력할 때마다 다시 검사한 결과를 보여 줍니다 (계산 값은 상태에서 도출)
    const errors = isSubmitted ? validate(form, agreements) : {};
    const isAllAgreed = AGREEMENT_ITEMS.every((item) => agreements[item.key]);

    const handleChangeField = (field: keyof SignupForm) => (value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleChangeAgreement = (key: keyof Agreements) => (checked: boolean) => {
        setAgreements((prev) => ({ ...prev, [key]: checked }));
    };

    const handleChangeAll = (checked: boolean) => {
        setAgreements({ terms: checked, privacy: checked, marketing: checked });
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitted(true);
        const nextErrors = validate(form, agreements);
        const firstError = FIELD_ORDER.find((field) => nextErrors[field]);
        if (firstError) {
            const element = formRef.current?.elements.namedItem(firstError);
            if (element instanceof HTMLElement) element.focus();
            return;
        }
        setIsCompleted(true);
    };

    if (isCompleted) {
        return (
            <div className="signup">
                <Card title="회원가입 완료">
                    <div className="signupDone" role="status">
                        <p>
                            <strong>{form.name}</strong>님, 가입이 완료되었습니다.
                        </p>
                        <p className="signupNote">퍼블리싱 샘플 화면으로, 입력한 정보는 저장되지 않습니다.</p>
                        <Button onClick={() => navigate('/')}>처음으로</Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="signup">
            <Card title="회원가입">
                <p className="signupDesc">서비스 이용에 필요한 기본 정보를 입력하세요.</p>
                <form ref={formRef} className="signupForm" onSubmit={handleSubmit} noValidate>
                    <Input
                        label="이름"
                        name="name"
                        value={form.name}
                        onChange={handleChangeField('name')}
                        placeholder="홍길동"
                        autoComplete="name"
                        maxLength={30}
                        required
                        hasError={Boolean(errors.name)}
                        errorMessage={errors.name}
                    />
                    <Input
                        label="이메일"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChangeField('email')}
                        placeholder="name@example.com"
                        autoComplete="email"
                        required
                        hasError={Boolean(errors.email)}
                        errorMessage={errors.email}
                    />
                    <Input
                        label="비밀번호"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChangeField('password')}
                        autoComplete="new-password"
                        helpText="영문과 숫자를 포함해 8자 이상"
                        required
                        hasError={Boolean(errors.password)}
                        errorMessage={errors.password}
                    />
                    <Input
                        label="비밀번호 확인"
                        name="passwordConfirm"
                        type="password"
                        value={form.passwordConfirm}
                        onChange={handleChangeField('passwordConfirm')}
                        autoComplete="new-password"
                        required
                        hasError={Boolean(errors.passwordConfirm)}
                        errorMessage={errors.passwordConfirm}
                    />
                    <Input
                        label="휴대폰 번호"
                        name="phone"
                        type="tel"
                        inputMode="numeric"
                        value={form.phone}
                        onChange={handleChangeField('phone')}
                        placeholder="010-1234-5678"
                        autoComplete="tel"
                        maxLength={13}
                        required
                        hasError={Boolean(errors.phone)}
                        errorMessage={errors.phone}
                    />

                    <fieldset className="signupAgree">
                        <legend className="signupAgreeTitle">약관 동의</legend>
                        <div className="signupAgreeAll">
                            <Checkbox label="전체 동의" checked={isAllAgreed} onChange={handleChangeAll} />
                        </div>
                        <div className="signupAgreeList">
                            {AGREEMENT_ITEMS.map((item) => (
                                <Checkbox
                                    key={item.key}
                                    name={item.key}
                                    label={item.label}
                                    checked={agreements[item.key]}
                                    onChange={handleChangeAgreement(item.key)}
                                    hasError={item.key !== 'marketing' && Boolean(errors[item.key as FieldName])}
                                    errorMessage={item.key !== 'marketing' ? errors[item.key as FieldName] : undefined}
                                />
                            ))}
                        </div>
                    </fieldset>

                    <Button type="submit">가입하기</Button>
                </form>
            </Card>
        </div>
    );
};

export default Signup;

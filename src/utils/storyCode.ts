import type { ControlValue, ControlValues, PlaygroundControl } from '../types';

// Playground 값 읽기·코드 만들기 (src/data/componentStories.ts, 명세 Playground 탭)

export const readText = (values: ControlValues, name: string) => String(values[name] ?? '');
export const readNumber = (values: ControlValues, name: string) => Number(values[name] ?? 0);
export const readFlag = (values: ControlValues, name: string) => values[name] === true;

// select 값을 유니온 타입으로 좁히기: readOption(values, 'size', ['sm', 'md', 'lg'] as const)
export const readOption = <T extends string>(values: ControlValues, name: string, options: readonly T[]): T => {
    const value = readText(values, name);
    return (options as readonly string[]).includes(value) ? (value as T) : options[0];
};

export const getDefaultValues = (controls: PlaygroundControl[]): ControlValues =>
    Object.fromEntries(controls.map((control) => [control.name, control.defaultValue]));

const formatAttr = (name: string, value: ControlValue) => {
    if (typeof value === 'boolean') return value ? name : `${name}={false}`;
    if (typeof value === 'number') return `${name}={${value}}`;
    return `${name}="${value}"`;
};

// 기본값과 다른 Props만 JSX 속성으로: <Button size="md" disabled>버튼</Button>
export const toJsx = (tag: string, values: ControlValues, controls: PlaygroundControl[], options: { children?: string; omit?: string[]; extra?: string[] } = {}) => {
    const attrs = controls
        .filter((control) => control.isProp !== false && !options.omit?.includes(control.name))
        .filter((control) => values[control.name] !== control.defaultValue && values[control.name] !== '')
        .map((control) => formatAttr(control.name, values[control.name]));
    const allAttrs = [...(options.extra ?? []), ...attrs];
    const open = allAttrs.length ? `<${tag} ${allAttrs.join(' ')}` : `<${tag}`;
    return options.children === undefined ? `${open} />` : `${open}>${options.children}</${tag}>`;
};

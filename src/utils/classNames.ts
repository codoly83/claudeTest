// 조건부 클래스 이름 합치기: classNames('tabItem', isOn && 'on') → 'tabItem on'
export const classNames = (...values: (string | false | null | undefined)[]) => values.filter(Boolean).join(' ');

// 'top-start' → 'topStart' (CSS 클래스는 camelCase, AGENTS.md 5.2)
export const toCamelCase = (value: string) => value.replace(/-(\w)/g, (_match, char: string) => char.toUpperCase());

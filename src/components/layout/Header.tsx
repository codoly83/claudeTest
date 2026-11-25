import { useId, useMemo, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NAV_GROUPS } from '../../data/navData';
import { SITE_TITLE } from '../../constants';
import type { NavItem } from '../../types';
import Switch from '../common/Switch';

// 공통 Header (docs/design.md 1.2): 로고(홈 링크) · 메뉴 검색 · 다크모드 스위치
interface HeaderProps {
    isDark: boolean;
    onToggleTheme: () => void;
    hasSearch?: boolean;   // 회원 레이아웃은 메뉴 검색 없음
}

interface ThemeSwitchProps {
    isDark: boolean;
    onToggle: () => void;
}

interface SearchItem extends NavItem {
    groupTitle: string;
}

interface SearchResult extends SearchItem {
    snippet: string;
}

// 메뉴 검색 대상: 왼쪽 메뉴와 같은 목록 (맨 위 '페이지 목록' 포함)
const SEARCH_ITEMS: SearchItem[] = [
    { label: '페이지 목록', href: '/', groupTitle: '홈' },
    ...NAV_GROUPS.flatMap((group) => group.items.map((item) => ({ ...item, groupTitle: group.title })))
];

const MAX_RESULTS = 30;

// 본문에서 찾은 위치 앞뒤 글자를 결과에 보여 줌
const getSnippet = (text: string, keyword: string) => {
    const index = text.toLowerCase().indexOf(keyword);
    if (index < 0) return '';
    const start = Math.max(0, index - 20);
    const end = Math.min(text.length, index + keyword.length + 40);
    return `${start > 0 ? '…' : ''}${text.slice(start, end)}${end < text.length ? '…' : ''}`;
};

// 메뉴명·그룹명 일치를 먼저, 본문 일치를 뒤에 보여 줌
const searchMenu = (keyword: string): SearchResult[] => {
    if (!keyword) return [];
    const byName: SearchResult[] = [];
    const byText: SearchResult[] = [];
    SEARCH_ITEMS.forEach((item) => {
        if (item.label.toLowerCase().includes(keyword) || item.groupTitle.toLowerCase().includes(keyword)) {
            byName.push({ ...item, snippet: '' });
        } else if (item.searchText?.toLowerCase().includes(keyword)) {
            byText.push({ ...item, snippet: getSnippet(item.searchText, keyword) });
        }
    });
    return [...byName, ...byText].slice(0, MAX_RESULTS);
};

// 메뉴 검색: WAI-ARIA Combobox(목록형) 패턴
const MenuSearch = () => {
    const navigate = useNavigate();
    const listboxId = useId();
    const [keyword, setKeyword] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const trimmedKeyword = keyword.trim().toLowerCase();
    const results = useMemo(() => searchMenu(trimmedKeyword), [trimmedKeyword]);
    const isExpanded = isOpen && trimmedKeyword !== '';
    const hasResults = isExpanded && results.length > 0;

    const handleSelect = (item: SearchItem) => {
        navigate(item.href);
        setKeyword('');
        setIsOpen(false);
    };

    const handleChange = (value: string) => {
        setKeyword(value);
        setActiveIndex(0);
        setIsOpen(true);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Escape') {
            setIsOpen(false);
            return;
        }
        if (!hasResults) return;
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setActiveIndex((prev) => (prev + 1) % results.length);
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
        } else if (event.key === 'Enter') {
            event.preventDefault();
            handleSelect(results[activeIndex]);
        }
    };

    return (
        <div className="headerSearch">
            <div className="searchField">
                <div className="searchBox">
                    <span className="iconMask iconSearch" aria-hidden="true" />
                    <input
                        type="search"
                        className="searchInput"
                        role="combobox"
                        aria-label="메뉴 검색"
                        aria-autocomplete="list"
                        aria-expanded={hasResults}
                        aria-controls={hasResults ? listboxId : undefined}
                        aria-activedescendant={hasResults ? `${listboxId}-${activeIndex}` : undefined}
                        placeholder="메뉴 검색…"
                        value={keyword}
                        onChange={(event) => handleChange(event.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setIsOpen(true)}
                        onBlur={() => setIsOpen(false)}
                    />
                </div>
                {hasResults && (
                    <div id={listboxId} role="listbox" aria-label="메뉴 검색 결과" className="searchResult">
                        {results.map((item, index) => (
                            <div
                                key={item.href}
                                id={`${listboxId}-${index}`}
                                role="option"
                                aria-selected={index === activeIndex}
                                className={index === activeIndex ? 'searchOption on' : 'searchOption'}
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => handleSelect(item)}
                            >
                                <span className="searchOptionLabel">{item.label}</span>
                                <span className="searchOptionGroup">{item.groupTitle}</span>
                                {item.snippet && <span className="searchOptionSnippet">{item.snippet}</span>}
                            </div>
                        ))}
                    </div>
                )}
                {isExpanded && results.length === 0 && (
                    <p className="searchResult searchEmpty" role="status">
                        검색 결과가 없습니다.
                    </p>
                )}
            </div>
        </div>
    );
};

// 다크모드 스위치: role="switch" (Space·Enter는 button 기본 동작)
const ThemeSwitch = ({ isDark, onToggle }: ThemeSwitchProps) => {
    return (
        <div className="themeSwitch">
            {/* 화면에 보이는 문구, 접근 가능한 이름은 Switch의 label */}
            <span className="themeSwitchLabel" aria-hidden="true">다크모드 설정</span>
            <Switch label="다크모드 설정" checked={isDark} onChange={onToggle} />
        </div>
    );
};

const Header = ({ isDark, onToggleTheme, hasSearch = true }: HeaderProps) => {
    return (
        <header id="header">
            <Link to="/" className="headerLogo">{SITE_TITLE}</Link>
            {hasSearch && <MenuSearch />}
            <ThemeSwitch isDark={isDark} onToggle={onToggleTheme} />
        </header>
    );
};

export default Header;

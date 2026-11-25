import type { ComponentStory } from '../types';
import { CATEGORY_ORDER } from './componentCatalog';
import { ATOM_STORIES } from './storiesAtom';
import { ATOM_PLUS_STORIES } from './storiesAtomPlus';
import { LAYOUT_STORIES } from './storiesLayout';

// 공통 컴포넌트 스토리 목록 (AGENTS.md 6.3)
// - 명세 화면(/spec/:slug)의 샘플·Playground·API 탭이 이 목록을 씁니다. (2026-11-25 /Guide 폐지)
// - 공통 컴포넌트를 추가하거나 Props를 바꾸면 같은 작업에서 storiesLayout.tsx(배치) 또는 storiesAtom.tsx(Atom)를 갱신합니다.
//   storiesAtomPlus.tsx는 2026-11-25 미구현 명세에서 구현한 9종(Chart·DatePicker·Icon·InputStepper·ScrollArea·Slider·SortableList·TextList·TreeView)입니다.
// - 이 파일은 차트·달력 등 라이브러리를 함께 불러오므로 명세 화면에서는 필요할 때 동적 import로 읽습니다.
//   메뉴 분류는 가벼운 componentCatalog.ts를 씁니다 (분류를 바꾸면 두 곳을 맞춤, check-project 검사).

export const COMPONENT_STORIES: ComponentStory[] = [...LAYOUT_STORIES, ...ATOM_STORIES, ...ATOM_PLUS_STORIES].sort(
    (a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category) || a.name.localeCompare(b.name)
);

export const getStoryByName = (name: string) => COMPONENT_STORIES.find((story) => story.name === name);

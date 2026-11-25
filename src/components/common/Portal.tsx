import { useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { MODAL_ROOT_ID } from '../../constants';

// 내부 유틸 (docs/components/Portal.md): 대상은 #wrap 안의 #modalWrap 고정 (document.body 금지, AGENTS.md 5.1.1)
// #modalWrap이 같은 렌더에서 함께 만들어지면 첫 렌더에는 없으므로, 마운트 직후 React가 값을 다시 확인해 그립니다.
interface PortalProps {
    children: ReactNode;
}

const subscribe = () => () => {};
const getTarget = () => document.getElementById(MODAL_ROOT_ID);

const Portal = ({ children }: PortalProps) => {
    const target = useSyncExternalStore(subscribe, getTarget);
    return target ? createPortal(children, target) : null;
};

export default Portal;

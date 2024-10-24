import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { AppRoute } from '@/routes';
import { getLeftActive, matchPath } from '@/utils';

interface MenuItem {
  id: string;
  name: string;
  url: string;
  icon: React.ReactNode;
  hash: string;
  childs?: MenuItem[];
}

interface AppMenu {
  topMenu: MenuItem[];
  topActive: MenuItem | null;
  leftMenu: MenuItem[];
  leftActive: MenuItem | null;
}

interface UseAppMenuOptions {
  hiddenMenuIds?: string[]; // 可选参数，用于传递需要隐藏的菜单 ID
}

export const useAppMenu = ({ hiddenMenuIds = [] }: UseAppMenuOptions = {}): { appMenu: AppMenu; shouldHideHeader: boolean } => {
  const location = useLocation();

  // 初始化菜单信息
  const appMenu = useMemo(() => {
    const topMenu: MenuItem[] = AppRoute.filter((menu: MenuItem) => !hiddenMenuIds.includes(menu.id));
    let topActive: MenuItem | null = null;
    let leftMenu: MenuItem[] = [];
    let leftActive: MenuItem | null = null;
    // window.location.hash
    topMenu.some((top) => {
      // if (matchPath(top.hash, location.hash)) {
      if (matchPath(top.hash, window.location.hash)) {
        topActive = top;
        leftMenu = top.childs || [];
        leftActive = getLeftActive(leftMenu, window.location.hash);
        return true;
      }
      return false;
    });

    return { topMenu, topActive, leftMenu, leftActive };
  }, [window.location.hash]);
  
  // 判断是否需要隐藏 AppHeader
  const shouldHideHeader = useMemo(() => {
    const hiddenPaths = ['/user/article/editor/new', '/login', '/forgot-password'];
    return hiddenPaths.includes(location.pathname);
  }, [location.pathname]);

  return { appMenu, shouldHideHeader };
};



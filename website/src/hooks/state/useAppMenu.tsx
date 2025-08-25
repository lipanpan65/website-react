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
  hiddenMenuIds?: string[]; // 需要隐藏的菜单 ID
  visibleMenuIds?: string[]; // 仅渲染的菜单 ID
}

/**
 * 过滤顶层菜单
 * @param menuItems 菜单项数组
 * @param visibleMenuIds 仅渲染的菜单 ID
 * @param hiddenMenuIds 需要隐藏的菜单 ID
 * @returns 过滤后的顶层菜单
 */
const filterTopMenuItems = (
  menuItems: MenuItem[],
  visibleMenuIds: string[],
  hiddenMenuIds: string[]
): MenuItem[] => {
  if (visibleMenuIds.length > 0) {
    return menuItems.filter((menu) => visibleMenuIds.includes(menu.id));
  }
  return menuItems.filter((menu) => !hiddenMenuIds.includes(menu.id));
};

export const useAppMenu = (
  { hiddenMenuIds = [], visibleMenuIds = [] }: UseAppMenuOptions = {}
): { appMenu: AppMenu; shouldHideHeader: boolean } => {
  const location = useLocation();

  // 初始化菜单信息
  const appMenu = useMemo(() => {
    // 过滤顶层菜单项
    const topMenu: MenuItem[] = filterTopMenuItems(AppRoute, visibleMenuIds, hiddenMenuIds);
    let topActive: MenuItem | null = null;
    let leftMenu: MenuItem[] = [];
    let leftActive: MenuItem | null = null;

    // 匹配当前激活的顶部菜单
    topMenu.some((top) => {
      if (matchPath(top.hash, window.location.hash)) {
        topActive = top;
        leftMenu = top.childs || []; // 保留所有的左侧菜单
        leftActive = getLeftActive(leftMenu, window.location.hash);
        // TODO 这里是不是可以使用break
        return true;
      }
      return false;
    });

    return { topMenu, topActive, leftMenu, leftActive };
  }, [window.location.hash, hiddenMenuIds, visibleMenuIds]);

  // // 判断是否需要隐藏 AppHeader
  // const shouldHideHeader = useMemo(() => {
  //   const hiddenPaths = ['/user/article/editor/new', '/login', '/forgot-password'];
  //   return hiddenPaths.includes(location.pathname);
  // }, [location.pathname]);

  // 判断是否需要隐藏 AppHeader
  const shouldHideHeader = useMemo(() => {
    // 使用正则表达式匹配路径模式
    const hiddenPathPatterns = [
      /^\/login$/,
      /^\/forgot-password$/,
      /^\/user\/article\/editor\/.+$/ // 匹配 /user/article/editor/ 开头的任意路径
    ];

    return hiddenPathPatterns.some(pattern => pattern.test(location.pathname));
  }, [location.pathname]);

  return { appMenu, shouldHideHeader };
};

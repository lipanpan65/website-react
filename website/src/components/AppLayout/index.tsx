import React from 'react';
import { useAppMenu } from '@/hooks/state/useAppMenu';
import BaseLayout from './BaseLayout';
import AppHeader from './AppHeader';
// import VerticalMenu from './VerticalMenu';
import './index.css'

const AppLayout: React.FC = () => {
  const { appMenu, shouldHideHeader } = useAppMenu();

  return (
    <BaseLayout
      header={!shouldHideHeader && <AppHeader appMenu={appMenu} />}
      layoutStyle={{ minHeight: '100vh' }}
    />
  );
};

export default AppLayout;

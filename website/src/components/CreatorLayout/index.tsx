import React from 'react';
import BaseLayout from '@/components/AppLayout/BaseLayout';
import AppHeader from '../AppLayout/AppHeader';
import SliderMenu from './SliderMenu';
import { useAppMenu } from '@/hooks/state/useAppMenu';

const CreatorLayout: React.FC = () => {
  const { appMenu, shouldHideHeader } = useAppMenu({ hiddenMenuIds: ['2'] });
  console.log("CreatorLayout", appMenu)
  
  return (
    <BaseLayout
      header={!shouldHideHeader && <AppHeader appMenu={appMenu} />}
      sider={<SliderMenu appMenu={appMenu.leftMenu} />}
      contentStyle={{
        // width: '100%',
        padding: '24px',
        minHeight: '100vh'
      }}
      // layoutStyle={{ display: 'flex', flexDirection: 'row' }}
      nested={true}
    />
  );
};

export default CreatorLayout;

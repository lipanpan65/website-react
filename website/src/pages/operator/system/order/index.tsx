import * as React from 'react'
import AppContainer from '@/components/AppContainer'
import AppContent from '@/components/AppContent'
import AppSearch from '@/components/AppSearch'

const AppOrder = () => {
  return (
    <AppContainer>
      <AppContent>
        <AppSearch
          onFormInstanceReady={() => { }}
          formItems={[]}
          buttonConfig={{
            label: '搜索',
            type: 'primary',
          }}
        />
      </AppContent>
    </AppContainer>
  )
}

export default AppOrder;
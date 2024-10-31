import * as React from 'react'
import AppContainer from '@/components/AppContainer'
import AppContent from '@/components/AppContent'
import { Typography } from 'antd'

import AppCode from '@/components/AppCode'
import AppCodeViewer from '@/components/AppCodeViewer'
import CodeMirrorEditor from '@/components/CodeMirrorEditor'
import AppCodeMirrorEditorGuide from './components/AppCodeMirrorEditorGuide'

const { Title, Paragraph, Text, Link } = Typography;

interface AppDeveloperProps {

}

const AppDeveloper: React.FC<AppDeveloperProps> = ({ }) => {

  return (
    <React.Fragment>
      <AppContainer>
        <AppContent>
          <Typography>
            <Title>搜索组件</Title>
            <AppCodeViewer codeKey="appSearchForm" />
          </Typography>
          <AppCodeMirrorEditorGuide />

          <CodeMirrorEditor value={''} onChange={function (value: string): void {
            // throw new Error('Function not implemented.')
            console.log(value)
          }} />

        </AppContent>
      </AppContainer>
    </React.Fragment>)
}

export default AppDeveloper


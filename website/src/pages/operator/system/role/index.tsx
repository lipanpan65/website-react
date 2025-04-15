import * as React from 'react'
import { RoleProvider } from '@/hooks/state/useRole'
import Role from './Role'

export default () => (
  <RoleProvider>
    <Role />
  </RoleProvider>
)
// hooks/usePermission.ts
import { useAuth } from './useAuth';

export interface PermissionOptions {
  strict?: boolean;  // 是否严格模式，默认为 true
}

export const usePermission = () => {
  const { isAuthenticated, userRole, permissions } = useAuth();

  console.log("permissions", permissions)

  /**
   * 检查用户是否具有指定角色
   * @param requiredRoles 需要的角色列表
   * @param options 权限检查选项
   */
  const hasRole = (requiredRoles?: string[], options: PermissionOptions = { strict: true }) => {
    if (!isAuthenticated || !requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    if (options.strict) {
      // 严格模式：必须具有所有指定角色
      return requiredRoles.includes(userRole);
    } else {
      // 宽松模式：具有任意一个指定角色即可
      return requiredRoles.some(role => role === userRole);
    }
  };

  /**
   * 检查用户是否具有指定权限
   * @param requiredPermissions 需要的权限列表
   * @param options 权限检查选项
   */
  const hasPermission = (requiredPermissions?: string[], options: PermissionOptions = { strict: true }) => {
    if (!isAuthenticated || !requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    if (options.strict) {
      // 严格模式：必须具有所有指定权限
      return requiredPermissions.every(permission => permissions.includes(permission));
    } else {
      // 宽松模式：具有任意一个指定权限即可
      return requiredPermissions.some(permission => permissions.includes(permission));
    }
  };

  /**
   * 检查用户是否具有指定角色和权限
   * @param requiredRoles 需要的角色列表
   * @param requiredPermissions 需要的权限列表
   * @param options 权限检查选项
   */
  const hasAccess = (
    requiredRoles?: string[],
    requiredPermissions?: string[],
    options: PermissionOptions = { strict: true }
  ) => {
    const roleCheck = hasRole(requiredRoles, options);
    const permissionCheck = hasPermission(requiredPermissions, options);

    console.log("roleCheck", roleCheck)
    console.log("permissionCheck", permissionCheck)

    return roleCheck && permissionCheck;
  };

  return {
    hasRole,
    hasPermission,
    hasAccess,
  };
};
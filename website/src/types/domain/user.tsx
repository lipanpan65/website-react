import { BaseEntity, BaseStatus, BasePaginationParams } from '../core';

/**
 * 用户实体
 */
export interface User extends BaseEntity {
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  lastLoginAt?: string;
}

/**
 * 用户角色
 */
export type UserRole = 'admin' | 'manager' | 'customer' | 'guest';

/**
 * 用户状态
 */
export type UserStatus = BaseStatus | 'verified' | 'unverified' | 'suspended';

/**
 * 创建用户参数
 */
export interface CreateUserParams {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
}

/**
 * 更新用户参数
 */
export interface UpdateUserParams extends Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>> {
  id: string;
}

/**
 * 用户查询参数
 */
export interface UserQueryParams extends BasePaginationParams {
  keyword?: string;
  role?: UserRole;
  status?: UserStatus;
}
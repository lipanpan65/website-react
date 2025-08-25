


```
// ===============================
// 推荐的 types 目录结构
// ===============================

/*
src/types/
├── index.ts           # 统一导出
├── core/              # 核心基础类型
│   ├── index.ts
│   ├── base.ts        # 基础实体
│   ├── api.ts         # API 相关
│   └── common.ts      # 通用类型
├── domain/            # 业务领域类型
│   ├── index.ts
│   ├── user.ts        # 用户相关
│   ├── product.ts     # 产品相关
│   └── order.ts       # 订单相关
└── ui/                # UI 组件类型
    ├── index.ts
    ├── components.ts  # 基础组件
    ├── forms.ts       # 表单组件
    └── tables.ts      # 表格组件
*/

// ===============================
// src/types/index.ts - 统一导出
// ===============================
export * from './core';
export * from './domain';
export * from './ui';

// ===============================
// src/types/core/index.ts
// ===============================
export * from './base';
export * from './api';
export * from './common';

// ===============================
// src/types/core/base.ts - 核心基础类型
// ===============================
/**
 * 基础实体接口
 */
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

/**
 * 基础状态枚举
 */
export type BaseStatus = 'active' | 'inactive' | 'pending' | 'deleted';

/**
 * 基础分页参数
 */
export interface BasePaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 基础分页响应
 */
export interface BasePaginationResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// ===============================
// src/types/core/api.ts - API 核心类型
// ===============================
/**
 * 统一 API 响应格式
 */
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  success: boolean;
  timestamp: string;
}

/**
 * API 错误响应
 */
export interface ApiError {
  code: number;
  message: string;
  details?: Record<string, any>;
}

/**
 * 请求配置
 */
export interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  params?: Record<string, any>;
  data?: any;
  headers?: Record<string, string>;
}

// ===============================
// src/types/core/common.ts - 通用类型
// ===============================
/**
 * 选择器选项
 */
export interface SelectOption<T = any> {
  label: string;
  value: T;
  disabled?: boolean;
}

/**
 * 键值对类型
 */
export type KeyValuePair<T = any> = {
  key: string;
  value: T;
};

/**
 * 表单状态
 */
export interface FormState<T = any> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
}

// ===============================
// src/types/domain/index.ts
// ===============================
export * from './user';
export * from './product';
export * from './order';

// ===============================
// src/types/domain/user.ts - 用户业务类型
// ===============================
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

// ===============================
// src/types/domain/product.ts - 产品业务类型
// ===============================
import { BaseEntity, BaseStatus } from '../core';

/**
 * 产品实体
 */
export interface Product extends BaseEntity {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  sku: string;
  stock: number;
  images: string[];
  category: ProductCategory;
  tags: string[];
  status: ProductStatus;
  featured: boolean;
}

/**
 * 产品分类
 */
export interface ProductCategory extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  level: number;
  order: number;
}

/**
 * 产品状态
 */
export type ProductStatus = BaseStatus | 'draft' | 'published' | 'outOfStock';

/**
 * 创建产品参数
 */
export interface CreateProductParams {
  name: string;
  description: string;
  price: number;
  sku: string;
  stock: number;
  categoryId: string;
  images: File[];
  tags?: string[];
}

/**
 * 产品查询参数
 */
export interface ProductQueryParams extends BasePaginationParams {
  keyword?: string;
  categoryId?: string;
  status?: ProductStatus;
  priceRange?: {
    min: number;
    max: number;
  };
}

// ===============================
// src/types/domain/order.ts - 订单业务类型
// ===============================
import { BaseEntity } from '../core';
import { User } from './user';
import { Product } from './product';

/**
 * 订单实体
 */
export interface Order extends BaseEntity {
  orderNumber: string;
  customer: User;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
}

/**
 * 订单项
 */
export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
  subtotal: number;
}

/**
 * 订单状态
 */
export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

/**
 * 支付状态
 */
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

/**
 * 支付方式
 */
export interface PaymentMethod {
  type: 'credit_card' | 'paypal' | 'bank_transfer' | 'cash_on_delivery';
  details?: Record<string, any>;
}

/**
 * 地址信息
 */
export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

/**
 * 创建订单参数
 */
export interface CreateOrderParams {
  customerId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  shippingAddressId: string;
  billingAddressId: string;
  paymentMethodId: string;
}

// ===============================
// src/types/ui/index.ts
// ===============================
export * from './components';
export * from './forms';
export * from './tables';

// ===============================
// src/types/ui/components.ts - 基础组件类型
// ===============================
/**
 * 按钮组件属性
 */
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

/**
 * 模态框组件属性
 */
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * 确认对话框属性
 */
export interface ConfirmModalProps extends Omit<ModalProps, 'children'> {
  message: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'danger';
}

// ===============================
// src/types/ui/forms.ts - 表单组件类型
// ===============================
/**
 * 输入框组件属性
 */
export interface InputProps {
  name: string;
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

/**
 * 选择框组件属性
 */
export interface SelectProps {
  name: string;
  label?: string;
  value?: string | number;
  options: Array<{
    label: string;
    value: string | number;
    disabled?: boolean;
  }>;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  onChange?: (value: string | number) => void;
  className?: string;
}

/**
 * 复选框组件属性
 */
export interface CheckboxProps {
  name: string;
  label?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

// ===============================
// src/types/ui/tables.ts - 表格组件类型
// ===============================
/**
 * 表格列定义
 */
export interface TableColumn<T = any> {
  key: keyof T | string;
  title: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  className?: string;
}

/**
 * 表格组件属性
 */
export interface TableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  rowKey?: keyof T | ((record: T) => string);
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  onRowClick?: (record: T, index: number) => void;
  className?: string;
}

// ===============================
// 使用示例
// ===============================

// 1. 统一导入方式（推荐）
import { 
  BaseEntity, 
  ApiResponse, 
  User, 
  CreateUserParams, 
  ButtonProps,
  TableColumn 
} from '@/types';

// 2. 分层导入方式
import { BaseEntity, ApiResponse } from '@/types/core';
import { User, CreateUserParams } from '@/types/domain';
import { ButtonProps, TableColumn } from '@/types/ui';

// 3. 在组件中使用
interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete }) => {
  const columns: TableColumn<User>[] = [
    {
      key: 'username',
      title: '用户名',
      width: 120,
    },
    {
      key: 'email',
      title: '邮箱',
      width: 200,
    },
    {
      key: 'role',
      title: '角色',
      width: 100,
      render: (role: string) => <span className={`role-${role}`}>{role}</span>
    },
    {
      key: 'actions',
      title: '操作',
      width: 150,
      render: (_, user: User) => (
        <div>
          <button onClick={() => onEdit(user)}>编辑</button>
          <button onClick={() => onDelete(user.id)}>删除</button>
        </div>
      )
    }
  ];

  const tableProps: TableProps<User> = {
    data: users,
    columns,
    rowKey: 'id',
    onRowClick: (user) => console.log('点击行:', user)
  };

  return <Table {...tableProps} />;
};

// 4. 在 API 服务中使用
const fetchUsers = async (params: UserQueryParams): Promise<ApiResponse<BasePaginationResponse<User>>> => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  
  return response.json();
};

// 5. 在表单中使用
const UserForm: React.FC<{ onSubmit: (data: CreateUserParams) => void }> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<CreateUserParams>({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'customer'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        name="username"
        label="用户名"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        required
      />
      <Input
        name="email"
        label="邮箱"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <Button type="submit" variant="primary">
        创建用户
      </Button>
    </form>
  );
};

```
import { BaseEntity, BaseStatus, BasePaginationParams } from '../core';
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

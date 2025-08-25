import { BaseEntity, BaseStatus, BasePaginationParams } from '../core';

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
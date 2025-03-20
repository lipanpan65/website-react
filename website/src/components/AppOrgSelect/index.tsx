import React, { useState, useEffect } from 'react';
import { message, TreeSelect } from 'antd';
import { TreeSelectProps } from 'antd/es/tree-select';
import { request } from '@/utils'; // 假设这是你封装的请求工具
import { api } from '@/api';

// 定义树形数据的类型
interface TreeNode {
  title: string;
  value: string;
  key: string;
  children?: TreeNode[];
}
interface AppOrgSelectProps {
  value?: string; // 当前选中的值
  onChange?: (value: string) => void; // 值变化的回调
  // loadData?: (parentValue: string) => Promise<TreeNode[]>; // 远程加载数据的接口
  placeholder?: string; // 占位符
  onDataLoaded?: (loaded: boolean) => void;
}

const AppOrgSelect: React.FC<AppOrgSelectProps> = ({ value, onChange, onDataLoaded, placeholder = '请选择组织' }) => {
  const [treeData, setTreeData] = useState<TreeNode[]>([]); // 存储树数据
  const [loading, setLoading] = useState<boolean>(false); // 加载状态
  const [initialValue, setInitialValue] = useState<string | undefined>(undefined); // 初始值

  const mapTreeData = (data: any[]): any[] =>
    data.map((node: any) => ({
      ...node,
      title: node.org_name,
      value: node.org_id,
      key: node.org_id,      // key 必须唯一，通常与 value 一致
      children: node.children ? mapTreeData(node.children) : undefined,
    }));

    const queryOrgs = async (orgId?: string) => {
      try {
        const { code, success, data: { page, data } } = await api.org.fetch(); // 加载根节点，传入空字符串表示根节点
        if (success) {
          const treeData = mapTreeData(data);
          setTreeData(treeData);
          setInitialValue(value); // 数据加载完成后设置初始值
        }
      } catch (error) {
        console.error('加载组织数据失败', error);
        message.error('加载组织数据失败，请稍后重试');
        if (onDataLoaded) {
          onDataLoaded(false); // 通知父组件数据加载失败
        }
      } finally {
        setLoading(false);
        if (onDataLoaded) {
          onDataLoaded(true); // 通知父组件数据加载完成
        }
      }
    };

  useEffect(() => {
    queryOrgs()
  }, [onDataLoaded])

  // 远程加载数据的处理函数
  const handleLoadData = async (node: any) => {
    setLoading(true);
    try {
      // 加载当前节点的子节点
      const children = await queryOrgs(node.value);
      node.children = children;
      setTreeData([...treeData]); // 更新树数据，React 会根据节点的变化重新渲染树
    } catch (error) {
      console.error('加载数据失败', error);
    } finally {
      setLoading(false);
    }
  };

  // 监听 value 变化，确保数据加载后更新 initialValue
  useEffect(() => {
    if (treeData.length > 0 && value) {
      setInitialValue(value);
    }
  }, [value, treeData]);

  return (
    <TreeSelect
      value={initialValue}
      onChange={onChange}
      treeData={treeData}
      // loadData={handleLoadData} // 配置远程加载数据
      treeDefaultExpandAll
      placeholder={placeholder}
      allowClear
      treeNodeFilterProp="title" // 支持搜索
      loading={loading} // 显示加载中状态
      multiple={false} // 支持单选
    />
  );
};

// export default AppOrgSelect;
export default React.memo(AppOrgSelect);

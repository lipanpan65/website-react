import React, { useState, useEffect } from 'react';
import { TreeSelect } from 'antd';
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
}

const AppOrgSelect: React.FC<AppOrgSelectProps> = ({ value, onChange, placeholder = '请选择组织' }) => {
  const [treeData, setTreeData] = useState<TreeNode[]>([]); // 存储树数据
  const [loading, setLoading] = useState<boolean>(false); // 加载状态

  const mapTreeData = (data: any[]): any[] =>
    data.map((node: any) => ({
      ...node,
      title: node.org_name,
      value: node.org_id,
      // title: renderTitle(node), // 直接赋值 `renderTitle(node)` 的返回值给 `title`
      children: node.children ? mapTreeData(node.children) : undefined,
    }));

  const queryOrgs = async (orgId?: string) => {
    try {
      const { code, success, data: { page, data } } = await api.org.fetch(); // 加载根节点，传入空字符串表示根节点
      if (success) {
        const treeData = mapTreeData(data)
        setTreeData(treeData)
      }
      // return data
    } catch (error) {
      setLoading(false)
    } finally {
      () => {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    queryOrgs()
  }, [])

  // // 初次加载根节点数据
  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       const data = await api.org.fetch(); // 加载根节点，传入空字符串表示根节点
  //       console.log("data===>", data)
  //       // setTreeData(data);
  //     } catch (error) {
  //       console.error('加载根节点数据失败', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, [loadData]);

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

  return (
    <TreeSelect
      value={value}
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

export default AppOrgSelect;

import { useState, useEffect } from 'react';
import { Dispatch } from 'react';

interface PaginationParams {
  page: number;
  pageSize: number;
  total: number;
  [key: string]: any;
}

interface UsePaginationProps {
  dispatch: Dispatch<any>;
  actionType: string;
}

const initialPaginationParams: PaginationParams = {
  page: 1,
  pageSize: 10,
  total: 0
};

export const usePagination = ({ dispatch, actionType }: UsePaginationProps) => {
  const [queryParams, setQueryParams] = useState<PaginationParams>(initialPaginationParams);

  const handlePaginationChange = (pagination: any) => {
    setQueryParams((prevParams) => ({
      ...prevParams,
      page: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total
    }));
  };

  useEffect(() => {
    if (Object.keys(queryParams).length > 0) {
      dispatch({ type: actionType, payload: { params: queryParams } });
    }
  }, [queryParams, dispatch, actionType]);

  return {
    queryParams,
    setQueryParams,
    handlePaginationChange
  };
}; 
import { useRef } from 'react';

interface DialogRef {
  showModel: (isOpen: boolean, data?: any) => void;
  onCancel: () => void;
  setOpen: (isOpen: boolean) => void;
}

export const useDialog = () => {
  const dialogRef = useRef<DialogRef>(null);

  const showModel = (_: any, data?: any) => {
    dialogRef.current?.showModel(true, data);
  };

  return {
    dialogRef,
    showModel
  };
}; 
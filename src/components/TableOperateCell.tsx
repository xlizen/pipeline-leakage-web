import { Button, Modal, Space } from 'antd';
import React from 'react';
import type { ModalFuncProps } from 'antd/lib/modal/Modal';

export type TableOperateCellProps = {
  onEditClick: React.MouseEventHandler<HTMLElement>;
  deleteMalProps: ModalFuncProps;
};

const TableOperateCell: React.FC<TableOperateCellProps> = (props) => {
  return (
    <Space size="middle">
      <Button type="primary" onClick={props.onEditClick}>
        编辑
      </Button>
      <Button
        type="primary"
        danger
        onClick={() => {
          Modal.confirm(props.deleteMalProps);
        }}
      >
        删除
      </Button>
    </Space>
  );
};
export default TableOperateCell;

import {ModalForm, ProFormText} from '@ant-design/pro-form';
import React from 'react';

export type UpdateSensorProps = {
  onSubmit: (values: API.SensorListItem) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.SensorListItem> | undefined;
  handlerVisible: (visible: boolean) => void;
};

const UpdateSensorKModal: React.FC<UpdateSensorProps> = (props) => {
  return (
    <>
      {props.updateModalVisible && (
        <ModalForm<API.SensorListItem>
          visible={props.updateModalVisible}
          onVisibleChange={props.handlerVisible}
          onFinish={props.onSubmit}
          width={"416px"}
          initialValues={props.values}
        >
          <ProFormText name="no" hidden={true}/>
          <ProFormText label="系数K" name="k"/>
        </ModalForm>
      )}
    </>
  );
};
export default UpdateSensorKModal;

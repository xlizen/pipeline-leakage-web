import ProForm, { ModalForm, ProFormRadio, ProFormText } from '@ant-design/pro-form';
import React from 'react';

export type UpdateSensorProps = {
  onSubmit: (values: API.SensorListItem) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.SensorListItem> | undefined;
  handlerVisible: (visible: boolean) => void;
};

const UpdateSensorModal: React.FC<UpdateSensorProps> = (props) => {
  return (
    <>
      {props.updateModalVisible && (
        <ModalForm<API.SensorListItem>
          visible={props.updateModalVisible}
          onVisibleChange={props.handlerVisible}
          onFinish={props.onSubmit}
          initialValues={props.values}
        >
          <ProFormText name="no" hidden={true} />
          <ProFormText label="系数K" width="lg" name="k" />
          <ProForm.Group>
            <ProFormText label="前置传感器" name="pre" />
            <ProFormText label="距前置距离" name="l" />
            <ProFormText label="后置传感器" name="next" />
          </ProForm.Group>
          <ProFormRadio.Group
            name="type"
            label="传感器类型"
            options={[
              {
                label: '支路首个传感器',
                value: 0,
              },
              {
                label: '管路首个传感器',
                value: 4,
              },
              {
                label: '普通传感器',
                value: 1,
              },
              {
                label: '变径转角处',
                value: 2,
              },
            ]}
          />
        </ModalForm>
      )}
    </>
  );
};

export default UpdateSensorModal;

import ProForm, { ModalForm, ProFormText } from '@ant-design/pro-form';
import React from 'react';

export type UpdatePipelineModalProps = {
  onSubmit: (values: API.PipeLineListItem) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.PipeLineListItem> | undefined;
  handlerVisible: (visible: boolean) => void;
};
const UpdatePipelineModal: React.FC<UpdatePipelineModalProps> = (props) => {
  return (
    <>
      {props.updateModalVisible && (
        <ModalForm<API.PipeLineListItem>
          title={'编辑管路'}
          initialValues={props.values}
          visible={props.updateModalVisible}
          onVisibleChange={props.handlerVisible}
          onFinish={props.onSubmit}
        >
          <ProFormText name="id" hidden={true} />
          <ProFormText
            rules={[
              {
                required: true,
                message: '管路名称不可为空',
              },
            ]}
            label="管路名称"
            name="name"
          />
          <ProForm.Group>
            <ProFormText
              rules={[
                {
                  required: true,
                  message: '',
                },
              ]}
              label="泄漏标准(m3/h)"
              width="md"
              name="standard"
            />
            <ProFormText
              rules={[
                {
                  required: true,
                  message: '',
                },
              ]}
              label="持续时间(h)"
              width="md"
              name="duration"
            />
          </ProForm.Group>
          <ProFormText label="管路基准点" name="referencePoint" />
        </ModalForm>
      )}
    </>
  );
};

export default UpdatePipelineModal;

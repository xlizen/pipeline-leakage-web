import ProForm, { ModalForm, ProFormText, ProFormUploadButton } from '@ant-design/pro-form';
import { message } from 'antd';
import type { UploadChangeParam } from 'antd/lib/upload/interface';
import React, { useState } from 'react';

export type UpdatePipelineModalProps = {
  onSubmit: (values: API.PipeLineListItem) => Promise<void>;
  updateModalVisible: boolean;
  handlerVisible: (visible: boolean) => void;
};
const NewPipelineModal: React.FC<UpdatePipelineModalProps> = (props) => {
  const [xlsxFilePath, setXlsxFilePath] = useState<string>('');

  return (
    <ModalForm<API.PipeLineListItem>
      title={'新增管路'}
      visible={props.updateModalVisible}
      onVisibleChange={props.handlerVisible}
      modalProps={{
        destroyOnClose: true,
      }}
      onFinish={async (values) => {
        const result = values;
        result.xlsFileName = xlsxFilePath;
        return await props.onSubmit(result);
      }}
    >
      <ProFormText
        rules={[
          {
            required: true,
            message: '',
          },
        ]}
        hidden={true}
        width="md"
        name="name"
      />
      <ProFormText
        rules={[
          {
            required: true,
            message: '填写管路名称',
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
              message: '填写泄漏标准',
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
              message: '填写持续时间',
            },
          ]}
          label="持续时间(h)"
          width="md"
          name="duration"
        />
      </ProForm.Group>
      <ProFormUploadButton
        tooltip={{ title: () => <a href="https://baidu.com">xlsx文档模板</a> }}
        label="管路信息"
        fieldProps={{
          name: 'file',
          action: '/dev/file/uploadFile',
          maxCount: 1,
          accept:
            'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          onChange: async (info: UploadChangeParam) => {
            if (info.file.status === 'done') {
              await message.success(`${info.file.name} file uploaded successfully`);
              setXlsxFilePath(info.file.response.data.title);
            } else if (info.file.status === 'error') {
              await message.error(`${info.file.name} file upload failed.`);
            } else if (info.file.status === 'removed') {
              setXlsxFilePath('');
            }
          },
        }}
        name="xlsFileName"
        rules={[
          {
            required: true,
            message: '管路信息需上传',
          },
        ]}
      />
      <ProFormText label="管路基准点" name="referencePoint" />
    </ModalForm>
  );
};

export default NewPipelineModal;

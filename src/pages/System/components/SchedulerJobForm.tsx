import React from 'react';
import {
  ModalForm,
  ProFormRadio,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-form';

export type SchedulerJobFormProps = {
  onSubmit: (values: API.SchedulerJobItem) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.SchedulerJobItem> | undefined;
  handlerVisible: (visible: boolean) => void;
  title: string;
  disable: boolean;
  jobMap: Record<string, string> | undefined;
};

const SchedulerJobForm: React.FC<SchedulerJobFormProps> = (props) => {
  return (
    <>
      {props.updateModalVisible && (
        <ModalForm<API.SchedulerJobItem>
          title={props.title}
          initialValues={props.values}
          visible={props.updateModalVisible}
          onVisibleChange={props.handlerVisible}
          onFinish={async (values) => {
            const result = values;
            result.status = values.status ? 'on' : undefined;
            result.content = props.jobMap ? props.jobMap[values.pipeLineId] : '';
            return await props.onSubmit(result);
          }}
        >
          <ProFormText name="id" hidden={true} />
          <ProFormText
            label="任务分组"
            name="jobGroup"
            rules={[
              {
                required: true,
                message: '任务分组不能为空！',
              },
            ]}
            disabled={props.disable}
          />
          <ProFormText
            label="任务名称"
            name="jobName"
            rules={[
              {
                required: true,
                message: '任务名称不能为空！',
              },
            ]}
            disabled={props.disable}
          />
          <ProFormSelect
            label="任务概要"
            name="pipeLineId"
            rules={[
              {
                required: false,
                message: '任务概要不能为空！',
              },
            ]}
            valueEnum={props.jobMap}
          />
          <ProFormText name="content" hidden={true} />
          <ProFormText label="执行间隔(s)" name="jobInterval" />
          <ProFormRadio.Group
            name="runType"
            label="执行方式"
            options={[
              {
                label: '立即执行',
                value: 1,
              },
              {
                label: '延迟执行',
                value: 0,
              },
            ]}
          />
          <ProFormSwitch name="status" label="任务状态" />
        </ModalForm>
      )}
    </>
  );
};

export default SchedulerJobForm;

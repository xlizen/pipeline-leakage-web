import type { CalibrationModelState } from '@/models/calibration';
import { PageContainer } from '@ant-design/pro-layout';
import React, { useRef, useState } from 'react';
import type { Dispatch } from 'umi';
import { connect } from 'umi';
import {
  ProFormDateTimePicker,
  ProFormDateTimeRangePicker,
  ProFormSelect,
  ProFormText,
  QueryFilter,
} from '@ant-design/pro-form';
import type { FormInstance} from 'antd';
import { Button, Card, message, Tag } from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import SchedulerJobForm from '@/pages/System/components/SchedulerJobForm';
import TableOperateCell from '@/components/TableOperateCell';
import { PlusOutlined } from '@ant-design/icons';
import {
  deleteSchedulerJob,
  saveSchedulerJob,
  schedulerJobs,
  updateSchedulerJob,
} from '@/services/monitor/schedulerJob';
import { clacK, recordZero } from '@/services/monitor/pipeline';

type SystemPageProps = {
  calibration: CalibrationModelState;
  dispatch: Dispatch;
};

const handleSchedulerJobFormSubmit = async (fields: API.SchedulerJobItem, isUpdate: boolean) => {
  const hide = message.loading('Configuring');
  try {
    if (isUpdate) {
      await updateSchedulerJob(fields);
    } else {
      await saveSchedulerJob(fields);
    }
    hide();
    message.success('Configuration is successful');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};

const handleSchedulerJobRemove = async (fields: API.SchedulerJobItem) => {
  try {
    await deleteSchedulerJob(fields);
    message.success('Configuration is successful');
    return true;
  } catch (err) {
    message.error('Configuration failed, please try again!');
    return false;
  }
};

const System: React.FC<SystemPageProps> = ({ calibration, dispatch }) => {
  const [currentRow, setCurrentRow] = useState<API.SchedulerJobItem>();

  const [schedulerJobFormVisible, handleSchedulerJobFormVisible] = useState<boolean>(false);

  const [modalTitle, setModalTitle] = useState<string>('新增任务');

  const [isUpdate, setUpdate] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  
  const formRef = useRef<FormInstance>();

  const columns: ProColumns<API.SchedulerJobItem>[] = [
    { title: '任务分组', dataIndex: 'jobGroup', key: 'jobGroup' },
    { title: '任务名称', dataIndex: 'jobName', key: 'jobName' },
    { title: '任务概要', dataIndex: 'content', key: 'content' },
    { title: '执行间隔(s)', dataIndex: 'jobInterval', key: 'jobInterval' },
    {
      title: '执行方式',
      dataIndex: 'runType',
      key: 'runType',
      valueEnum: { 1: '立即执行', 0: '延迟执行' },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      valueEnum: {
        on: { text: <Tag color="green">启用</Tag> },
        off: { text: <Tag color="magenta">禁用</Tag> },
      },
      // valueEnum: { on: '启用', off: '禁用' },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      valueType: 'option',
      search: false,
      render: (_, record) => (
        <TableOperateCell
          onEditClick={() => {
            const status = record.status === 'on' ? 'on' : '';
            const item = Object.create(null);
            item[record.pipeLineId] = record.content;
            dispatch({
              type: 'calibration/updateJobMap',
              payload: {
                ...calibration.jobMap,
                ...item,
              },
            });
            setCurrentRow({
              ...record,
              status,
            });
            setUpdate(true);
            handleSchedulerJobFormVisible(true);
            setModalTitle('编辑定时任务');
          }}
          deleteMalProps={{
            title: '删除任务',
            content: '确定删除该定时吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
              const success = await handleSchedulerJobRemove(record);
              if (success) {
                if (actionRef.current) {
                  actionRef.current.reload();
                }
                dispatch({
                  type: 'loadPipelineMap',
                });
              }
              return success;
            },
          }}
        />
      ),
    },
  ];

  const onValuesChange = (value: any) => {
    const keys = Object.keys(value);
    const key = keys[0];
    switch (key) {
      case 'pipelineId':
        formRef.current?.setFieldsValue({
          sensorId:null
        });
        dispatch({
          type: 'calibration/loadSensorMap',
          payload: value[key],
        });
        break;
      default:
        break;
    }
  };

  return (
    <PageContainer>
      <Card title={'基准压力记录'} style={{ marginBottom: 16 }}>
        <QueryFilter<API.CalibrationParam>
          labelWidth="auto"
          onFinish={async (params) => {
            const { pipelineId, create } = params;
            const [startTime, endTime] = create;
            await recordZero({
              pipelineId,
              startTime,
              endTime,
            });
            return true;
          }}
          submitter={{
            // 配置按钮文本
            searchConfig: {
              resetText: '重置',
              submitText: '提交',
            },
          }}
        >
          <ProFormSelect
            name="pipelineId"
            label="管路"
            showSearch
            valueEnum={calibration.pipelineMap}
          />
          <ProFormDateTimeRangePicker
            name="create"
            label="基准时间"
            colSize={2}
            fieldProps={{
              format: 'YYYY/MM/DD HH:mm:ss',
            }}
            rules={[{ required: true }]}
          />
        </QueryFilter>
      </Card>
      <Card title={'管路系数K计算'} style={{ marginBottom: 16 }}>
        <QueryFilter<API.CalcKParams>
          labelWidth="auto"
          formRef={formRef}
          onValuesChange={(value) => onValuesChange(value)}
          onFinish={async (params) => {
            await clacK(
              params
            );
            return true;
          }}
          submitter={{
            // 配置按钮文本
            searchConfig: {
              resetText: '重置',
              submitText: '计算',
            },
          }}
        >
          <ProFormSelect
            name="pipelineId"
            label="管路"
            showSearch
            rules={[{ required: true }]}
            valueEnum={calibration.pipelineMap}
          />
          <ProFormSelect
            name="sensorId"
            label="泄漏点"
            showSearch
            rules={[{ required: true }]}
            valueEnum={calibration.sensorMap}
          />
          <ProFormText name="q" label="泄漏量(m3/h)" rules={[{ required: true }]}/>
          <ProFormDateTimePicker
            name="end"
            label="基准时间"
            fieldProps={{
              format: 'YYYY/MM/DD HH:mm:ss',
            }}
            rules={[{ required: true }]}
          />
        </QueryFilter>
      </Card>
      <ProTable<API.SchedulerJobItem>
        headerTitle={'定时计算任务'}
        columns={columns}
        search={false}
        actionRef={actionRef}
        rowKey="id"
        request={(params) => {
          const { pageSize: limit, current: page } = params;
          return schedulerJobs({ limit, page });
        }}
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setUpdate(false);
              setCurrentRow(undefined);
              handleSchedulerJobFormVisible(true);
            }}
          >
            新建
          </Button>,
        ]}
      />
      <SchedulerJobForm
        updateModalVisible={schedulerJobFormVisible}
        jobMap={calibration.jobMap}
        values={currentRow}
        handlerVisible={(flag) => {
          if (currentRow && !flag) {
            const items = {};
            Object.keys(calibration.jobMap).forEach((key) => {
              if (key !== currentRow.pipeLineId) {
                items[key] = calibration.jobMap[key];
              }
            });
            dispatch({
              type: 'calibration/updateJobMap',
              payload: items,
            });
          }
          handleSchedulerJobFormVisible(flag);
        }}
        title={modalTitle}
        disable={isUpdate}
        onSubmit={async (values) => {
          const success = await handleSchedulerJobFormSubmit(values, isUpdate);
          if (success) {
            handleSchedulerJobFormVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      />
    </PageContainer>
  );
};

const mapStateToProps = ({ calibration }: { calibration: CalibrationModelState }) => {
  return { calibration };
};

export default connect(mapStateToProps)(System);

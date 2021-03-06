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

  const [modalTitle, setModalTitle] = useState<string>('????????????');

  const [isUpdate, setUpdate] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  
  const formRef = useRef<FormInstance>();

  const columns: ProColumns<API.SchedulerJobItem>[] = [
    { title: '????????????', dataIndex: 'jobGroup', key: 'jobGroup' },
    { title: '????????????', dataIndex: 'jobName', key: 'jobName' },
    { title: '????????????', dataIndex: 'content', key: 'content' },
    { title: '????????????(s)', dataIndex: 'jobInterval', key: 'jobInterval' },
    {
      title: '????????????',
      dataIndex: 'runType',
      key: 'runType',
      valueEnum: { 1: '????????????', 0: '????????????' },
    },
    {
      title: '??????',
      dataIndex: 'status',
      key: 'status',
      valueEnum: {
        on: { text: <Tag color="green">??????</Tag> },
        off: { text: <Tag color="magenta">??????</Tag> },
      },
      // valueEnum: { on: '??????', off: '??????' },
    },
    {
      title: '??????',
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
            setModalTitle('??????????????????');
          }}
          deleteMalProps={{
            title: '????????????',
            content: '???????????????????????????',
            okText: '??????',
            cancelText: '??????',
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
      <Card title={'??????????????????'} style={{ marginBottom: 16 }}>
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
            // ??????????????????
            searchConfig: {
              resetText: '??????',
              submitText: '??????',
            },
          }}
        >
          <ProFormSelect
            name="pipelineId"
            label="??????"
            showSearch
            valueEnum={calibration.pipelineMap}
          />
          <ProFormDateTimeRangePicker
            name="create"
            label="????????????"
            colSize={2}
            fieldProps={{
              format: 'YYYY/MM/DD HH:mm:ss',
            }}
            rules={[{ required: true }]}
          />
        </QueryFilter>
      </Card>
      <Card title={'????????????K??????'} style={{ marginBottom: 16 }}>
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
            // ??????????????????
            searchConfig: {
              resetText: '??????',
              submitText: '??????',
            },
          }}
        >
          <ProFormSelect
            name="pipelineId"
            label="??????"
            showSearch
            rules={[{ required: true }]}
            valueEnum={calibration.pipelineMap}
          />
          <ProFormSelect
            name="sensorId"
            label="?????????"
            showSearch
            rules={[{ required: true }]}
            valueEnum={calibration.sensorMap}
          />
          <ProFormText name="q" label="?????????(m3/h)" rules={[{ required: true }]}/>
          <ProFormDateTimePicker
            name="end"
            label="????????????"
            fieldProps={{
              format: 'YYYY/MM/DD HH:mm:ss',
            }}
            rules={[{ required: true }]}
          />
        </QueryFilter>
      </Card>
      <ProTable<API.SchedulerJobItem>
        headerTitle={'??????????????????'}
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
            ??????
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

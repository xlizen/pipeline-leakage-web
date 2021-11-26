import {PageContainer} from '@ant-design/pro-layout';
import type {Dispatch} from 'umi';
import {connect} from 'umi';
import {Button, message} from 'antd';
import React, {useRef, useState} from 'react';
import type {PipeLineModelState} from '@/models/pipeline';
import {
  deletePipeline,
  deleteSensor,
  pipelines,
  savePipeline,
  updatePipeline,
  updateSensor,
} from '@/services/monitor/pipeline';
import type {ActionType, ProColumns} from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {PlusOutlined} from '@ant-design/icons';
import UpdateSensorKModal from './components/UpdateSensorKModal';
import UpdatePipelineModal from './components/UpdatePipelineModal';
import NewPipelineModal from './components/NewPipelineModal';
import TableOperateCell from '@/components/TableOperateCell';

interface PipelinePageProps {
  pipeline: PipeLineModelState;
  dispatch: Dispatch;
}

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleAddPipeline = async (fields: API.PipeLineListItem) => {
  const hide = message.loading('Configuring');
  try {
    await savePipeline(fields);
    hide();
    message.success('Configuration is successful');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleUpdatePipeline = async (fields: API.PipeLineListItem) => {
  const hide = message.loading('Configuring');
  try {
    await updatePipeline(fields);
    hide();
    message.success('Configuration is successful');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleUpdateSensor = async (fields: API.SensorListItem) => {
  const hide = message.loading('Configuring');
  try {
    await updateSensor(fields);
    hide();
    message.success('Configuration is successful');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};

const handleDeletePipeline = async (fields: API.PipeLineListItem) => {
  try {
    await deletePipeline(fields);
    message.success('Configuration is successful');
    return true;
  } catch (err) {
    message.error('Configuration failed, please try again!');
    return false;
  }
};

const handleDeleteSensor = async (fields: API.SensorListItem) => {
  try {
    await deleteSensor(fields);
    message.success('Configuration is successful');
    return true;
  } catch (err) {
    message.error('Configuration failed, please try again!');
    return false;
  }
};

const PipelineList: React.FC<PipelinePageProps> = () => {
  const [newPipelineModalVisible, handlePipelineNewModalVisible] = useState<boolean>(false);

  const [updatePipelineModalVisible, handlePipelineUpdateModalVisible] = useState<boolean>(false);

  const [updateSensorModalVisible, handleSensorUpdateModalVisible] = useState<boolean>(false);

  const [currentSensor, setCurrentSensor] = useState<API.SensorListItem>();

  const [currentPipeline, setCurrentPipeline] = useState<API.PipeLineListItem>();

  const actionRef = useRef<ActionType>();

  const expandedRowRender = (record: API.PipeLineListItem) => {
    const columns: ProColumns<API.SensorListItem>[] = [
      {title: 'ID', dataIndex: 'id', key: 'id'},
      // {title: '压力值(bar)', dataIndex: 'currentValue', key: 'currentValue'},
      {title: '前置传感器', dataIndex: 'pre', key: 'pre'},
      {title: '后置传感器', dataIndex: 'next', key: 'next'},
      {title: '系数', dataIndex: 'k', key: 'k'},
      {title: '传感器间距(m)', dataIndex: 'l', key: 'l'},
      {title: '管路半径(m)', dataIndex: 'r', key: 'r'},
      {title: '传感器类型', dataIndex: 'type', key: 'type'},
      {title: '记录时间', dataIndex: 'createTime', key: 'createTime'},
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (_, rc) => (
          <TableOperateCell
            onEditClick={() => {
              setCurrentSensor(rc);
              handleSensorUpdateModalVisible(true);
            }}
            deleteMalProps={{
              title: '删除传感器',
              content: '确定删除该传感器吗？',
              okText: '确认',
              cancelText: '取消',
              onOk: async () => {
                const success = await handleDeleteSensor(rc);
                if (success) {
                  if (actionRef.current) {
                    actionRef.current.reload();
                  }
                }
              },
            }}
          />
        ),
      },
    ];
    return (
      <ProTable<API.SensorListItem>
        columns={columns}
        headerTitle={false}
        search={false}
        options={false}
        rowKey={(sensor) => sensor.no}
        dataSource={record.sensorList}
        pagination={false}
      />
    );
  };

  const columns: ProColumns<API.PipeLineListItem>[] = [
    {title: 'ID', dataIndex: 'id', key: 'id', search: false},
    {title: '管路名称', dataIndex: 'name', key: 'name'},
    {title: '泄漏标准(m3/h)', dataIndex: 'standard', key: 'standard'},
    {title: '持续时间(h)', dataIndex: 'duration', key: 'duration'},
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      valueType: 'option',
      search: false,
      ellipsis: true,
      render: (_, record) => (
        <TableOperateCell
          onEditClick={() => {
            handlePipelineUpdateModalVisible(true);
            setCurrentPipeline(record);
          }}
          deleteMalProps={{
            title: '删除管路',
            content: '确定删除该管路吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
              const success = await handleDeletePipeline(record);
              if (success) {
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            },
          }}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.PipeLineListItem>
        headerTitle={'管网信息'}
        columns={columns}
        form={
          {
            labelWidth:"auto"
          }
        }
        request={(params) => {
          const {pageSize: limit, current: page, ...filter} = params;
          return pipelines({
            limit,
            page,
            ...filter,
          });
        }}
        rowKey="id"
        actionRef={actionRef}
        pagination={{
          showQuickJumper: true,
          pageSize: 10,
        }}
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined/>}
            type="primary"
            onClick={() => {
              handlePipelineNewModalVisible(true);
            }}
          >
            新建
          </Button>,
        ]}
        expandedRowRender={(record) => expandedRowRender(record)}
      />
      <NewPipelineModal
        onSubmit={async (v) => {
          const success = await handleAddPipeline(v);
          if (success) {
            handlePipelineNewModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        updateModalVisible={newPipelineModalVisible}
        handlerVisible={(flag) => {
          setCurrentPipeline(undefined);
          handlePipelineNewModalVisible(flag);
        }}
      />
      <UpdatePipelineModal
        onSubmit={async (v) => {
          const success = await handleUpdatePipeline(v);
          if (success) {
            handleSensorUpdateModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        updateModalVisible={updatePipelineModalVisible}
        values={currentPipeline}
        handlerVisible={(flag) => handlePipelineUpdateModalVisible(flag)}
      />
      <UpdateSensorKModal
        onSubmit={async (v) => {
          const success = await handleUpdateSensor(v);
          if (success) {
            handleSensorUpdateModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        updateModalVisible={updateSensorModalVisible}
        values={currentSensor}
        handlerVisible={(flag) => handleSensorUpdateModalVisible(flag)}
      />
    </PageContainer>
  );
};

const mapStateToProps = ({pipeline}: { pipeline: PipeLineModelState }) => {
  return {pipeline};
};

export default connect(mapStateToProps)(PipelineList);

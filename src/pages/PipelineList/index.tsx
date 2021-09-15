import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm, { ModalForm, ProFormText } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import type { Dispatch } from 'umi';
import { connect } from 'umi';
import { Button, message, Modal, Space } from 'antd';
import React, { useState, useRef } from 'react';
import type { PipeLineModelState } from '@/models/pipeline';
import { deletePipeline, pipelines, updatePipeline } from '@/services/ant-design-pro/pipelineApi';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';

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
const handleUpdatePipeline = async (fields: API.PipeLineListItem) => {
  const hide = message.loading('Configuring');
  try {
    await updatePipeline({
      id: fields.id,
      name: fields.name,
      standard: fields.standard,
      duration: fields.duration,
      referencePoint: fields.referencePoint,
    });
    hide();
    message.success('Configuration is successful');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};

const confirmDeletePipeline = async (id: string) => {
  try {
    await deletePipeline(id);
    message.success('Configuration is successful');
    return true;
  } catch (err) {
    message.error('Configuration failed, please try again!');
    return false;
  }
};

const PipelineList: React.FC<PipelinePageProps> = ({ dispatch }) => {
  
  const [updatePipelineModalVisible, handlePipelineUpdateModalVisible] = useState<boolean>(false);

  const expandedRowRender = (record: API.PipeLineListItem) => {
    const columns: ProColumns<API.Sensor>[] = [
      { title: 'no', dataIndex: 'id', key: 'id' },
      { title: '压力值', dataIndex: 'currentValue', key: 'currentValue' },
      { title: '前置传感器', dataIndex: 'pre', key: 'pre' },
      { title: '后置传感器', dataIndex: 'next', key: 'next' },
      { title: '系数', dataIndex: 'k', key: 'k' },
      { title: '传感器间距', dataIndex: 'l', key: 'l' },
      { title: '管路半径', dataIndex: 'r', key: 'r' },
      { title: '记录时间', dataIndex: 'createTime', key: 'createTime' },
      // {
      //   title: 'Action',
      //   dataIndex: 'operation',
      //   key: 'operation',
      //   render: () => (
      //     <Space size="middle">
      //       <a>Pause</a>
      //       <a>Stop</a>
      //     </Space>
      //   ),
      // },
    ];
    return (
      <ProTable
        columns={columns}
        headerTitle={false}
        search={false}
        options={false}
        rowKey={(sensor) => sensor.id}
        dataSource={record.sensors}
        pagination={false}
      />
    );
  };

  const pipelineFormRef = useRef<ProFormInstance>();

  const columns: ProColumns<API.PipeLineListItem>[] = [
    { title: 'ID', dataIndex: 'id', key: 'id', search: false },
    { title: '管路名称', dataIndex: 'name', key: 'name' },
    { title: '泄露标准', dataIndex: 'standard', key: 'standard' },
    { title: '持续时间', dataIndex: 'duration', key: 'duration' },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      valueType: 'option',
      search: false,
      render: (_, record) => [
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => {
              handlePipelineUpdateModalVisible(true);
              pipelineFormRef?.current?.setFieldsValue(record);
            }}
          >
            编辑
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => {
              Modal.confirm({
                title: '删除管路',
                content: '确定删除该管路吗？',
                okText: '确认',
                cancelText: '取消',
                onOk: () => confirmDeletePipeline(record.id),
              });
            }}
          >
            删除
          </Button>
        </Space>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.PipeLineListItem>
        columns={columns}
        request={(params) => pipelines(params)}
        rowKey="id"
        pagination={{
          showQuickJumper: true,
          pageSize: 10,
        }}
        toolBarRender={() => [
          <Button key="button" icon={<PlusOutlined />} type="primary">
            新建
          </Button>,
        ]}
        expandedRowRender={(record) => expandedRowRender(record)}
      />
      <ModalForm
        title={'编辑管路'}
        formRef={pipelineFormRef}
        visible={updatePipelineModalVisible}
        onVisibleChange={handlePipelineUpdateModalVisible}
        onFinish={async (value) => {
          const success = await handleUpdatePipeline(value as API.PipeLineListItem);
          if (success) {
            handlePipelineUpdateModalVisible(false);
            dispatch({
              type: 'pipeline/loadPipeline',
            });
          }
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
            label="泄漏标准"
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
            label="持续时间"
            width="md"
            name="duration"
          />
        </ProForm.Group>
        <ProFormText label="管路基准点" name="referencePoint" />
      </ModalForm>
    </PageContainer>
  );
};

const mapStateToProps = ({ pipeline }: { pipeline: PipeLineModelState }) => {
  return { pipeline };
};

export default connect(mapStateToProps)(PipelineList);

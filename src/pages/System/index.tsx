import type { CalibrationModelState } from '@/models/calibration';
import { PageContainer } from '@ant-design/pro-layout';
import React from 'react';
import type { Dispatch } from 'umi';
import { connect } from 'umi';
import { ProFormDateRangePicker, ProFormSelect, QueryFilter } from '@ant-design/pro-form';
import { Card } from 'antd';
import { recordZero } from '@/services/ant-design-pro/pipelineApi';

type SystemPageProps = {
  calibration: CalibrationModelState;
  dispacth: Dispatch;
};

const System: React.FC<SystemPageProps> = ({ calibration }) => {
  return (
    <PageContainer>
      <Card style={{ width: '100%' }}>
        <QueryFilter<API.CalibrationParam>
          onFinish={async (params) => {
            console.log(params);
            await recordZero(params);
            return true;
          }}
        >
          <ProFormSelect
            name="pipelineId"
            label="管路"
            showSearch
            valueEnum={calibration.pipelineMap}
          />
          <ProFormDateRangePicker name="create" label="创建时间" colSize={2} />
        </QueryFilter>
      </Card>
    </PageContainer>
  );
};

const mapStateToProps = ({ calibration }: { calibration: CalibrationModelState }) => {
  return { calibration };
};

export default connect(mapStateToProps)(System);

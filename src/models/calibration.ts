import { pipelineMap, sensorMap } from '@/services/monitor/pipeline';
import type { Effect, Reducer, Subscription } from 'umi';

export type CalibrationModelState = {
  pipelineMap: Record<string, string>;
  sensorMap: Record<string, string>;
  jobMap: Record<string, string>;
};

export interface CalibrationModelType {
  namespace: string;

  state: CalibrationModelState;

  effects: {
    loadPipelineMap: Effect;
    loadSensorMap: Effect;
  };

  reducers: {
    savePipelineMap: Reducer<CalibrationModelState>;
    saveSensorMap: Reducer<CalibrationModelState>;
    updateJobMap: Reducer<CalibrationModelState>;
  };

  subscriptions: { setup: Subscription };
}

const calibrationModel: CalibrationModelType = {
  namespace: 'calibration',
  state: {
    pipelineMap: {},
    sensorMap: {},
    jobMap: {},
  },

  effects: {
    *loadPipelineMap(action, { call, put }) {
      const result = yield call(pipelineMap);
      if (result.total > 0) {
        yield put({
          type: 'savePipelineMap',
          payload: result.data,
        });
      }
    },

    *loadSensorMap(action, { call, put }) {
      const result = yield call(sensorMap, action.payload);
      console.log(JSON.stringify(result));
      if (result.total > 0) {
        yield put({
          type: 'saveSensorMap',
          payload: result.data,
        });
      }
    },
  },

  reducers: {
    savePipelineMap(state, { payload }) {
      return {
        ...state,
        pipelineMap: payload.selectItems,
        jobMap: payload.jobItems,
      } as CalibrationModelState;
    },

    saveSensorMap(state, { payload }) {
      return {
        ...state,
        sensorMap: payload,
      } as CalibrationModelState;
    },
    
    updateJobMap(state, { payload }) {
      return {
        ...state,
        jobMap: payload,
      } as CalibrationModelState;
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/system/list') {
          dispatch({
            type: 'loadPipelineMap',
          });
        }
      });
    },
  },
};

export default calibrationModel;

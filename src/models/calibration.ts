import { pipelineMap } from '@/services/monitor/pipeline';
import type { Effect, Reducer, Subscription } from 'umi';

export type CalibrationModelState = {
  pipelineMap: Record<string, string>;
  jobMap: Record<string, string>;
};

export interface CalibrationModelType {
  namespace: string;

  state: CalibrationModelState;

  effects: {
    loadPipelineMap: Effect;
  };

  reducers: {
    savePipelineMap: Reducer<CalibrationModelState>;
    updateJobMap: Reducer<CalibrationModelState>;
  };

  subscriptions: { setup: Subscription };
}

const calibrationModel: CalibrationModelType = {
  namespace: 'calibration',
  state: {
    pipelineMap: {},
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
  },

  reducers: {
    savePipelineMap(state, { payload }) {
      return {
        ...state,
        pipelineMap: payload.selectItems,
        jobMap: payload.jobItems,
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

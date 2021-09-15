import { pipelineMap } from '@/services/ant-design-pro/pipelineApi';
import type { Effect, Reducer, Subscription } from 'umi';

export type CalibrationModelState = {
  pipelineMap: Record<string,string>
};

export interface CalibrationModelType {
  namespace: string;

  state: CalibrationModelState;

  effects: {
    loadPipelineMap: Effect;
  };

  reducers: {
    savePipelineMap: Reducer<CalibrationModelState>;
  };
  subscriptions: { setup: Subscription };
}

const calibrationModel: CalibrationModelType = {
  namespace: 'calibration',
  state: {
    pipelineMap: {},
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
        pipelineMap: payload,
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
